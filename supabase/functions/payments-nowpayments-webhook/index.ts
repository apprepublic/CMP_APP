import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ipnSecret = Deno.env.get("NOWPAYMENTS_IPN_SECRET");

    if (!ipnSecret) {
      console.error("[NOWPAYMENTS WEBHOOK] IPN secret not configured");
      return new Response(JSON.stringify({ error: "IPN secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify HMAC signature
    const hmacSignature = req.headers.get("x-nowpayments-sig");
    if (!hmacSignature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bodyText = await req.text();

    const key = new TextEncoder().encode(ipnSecret);
    const msg = new TextEncoder().encode(bodyText);
    const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, msg);
    const calculatedSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

    if (calculatedSig !== hmacSignature) {
      console.error("[NOWPAYMENTS WEBHOOK] Invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = JSON.parse(bodyText);

    const {
      payment_id,
      payment_status,
      pay_address,
      price_amount,
      price_currency,
      pay_amount,
      pay_currency,
      order_id,
      purchase_id,
      created_at,
      updated_at,
    } = body;

    console.log("[NOWPAYMENTS WEBHOOK] Received:", { payment_id, payment_status, order_id, price_amount, pay_amount });

    const statusMap: Record<string, "PENDING" | "COMPLETED" | "FAILED"> = {
      waiting: "PENDING",
      confirming: "PENDING",
      confirmed: "PENDING",
      sending: "PENDING",
      paid: "PENDING",
      finished: "COMPLETED",
      failed: "FAILED",
      refunded: "FAILED",
      expired: "FAILED",
    };

    const internalStatus = statusMap[payment_status] || "PENDING";

    const [_, userId, timestamp] = order_id.split("_");

    if (!userId) {
      console.error("[NOWPAYMENTS WEBHOOK] Invalid order_id format:", order_id);
      return new Response(JSON.stringify({ error: "Invalid order ID format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: cryptoPayment, error: cryptoError } = await supabase
      .from("crypto_payments")
      .select("id, coin_amount, status")
      .eq("order_id", order_id)
      .single();

    if (cryptoError || !cryptoPayment) {
      console.error("[NOWPAYMENTS WEBHOOK] crypto_payments record not found for order_id:", order_id);
      return new Response(JSON.stringify({ error: "Payment record not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id, coin_balance")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      console.error("[NOWPAYMENTS WEBHOOK] Wallet not found for user:", userId);
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const coinAmount = cryptoPayment.coin_amount;

    if (internalStatus === "COMPLETED") {
      const newBalance = BigInt(wallet.coin_balance) + BigInt(coinAmount);

      const { error: updateError } = await supabase
        .from("wallets")
        .update({ coin_balance: newBalance.toString(), updated_at: new Date().toISOString() })
        .eq("id", wallet.id);

      if (updateError) {
        console.error("[NOWPAYMENTS WEBHOOK] Failed to update wallet:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update wallet" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase.from("coin_transactions").insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: "TOPUP",
        amount: coinAmount,
        balance_after: newBalance.toString(),
        description: `Crypto top-up via NOWPayments (${pay_currency.toUpperCase()})`,
        reference_id: payment_id,
      } as any);

      await supabase
        .from("crypto_payments")
        .update({ status: "COMPLETED", updated_at: new Date().toISOString() })
        .eq("id", cryptoPayment.id);

      await supabase.from("notifications").insert({
        user_id: userId,
        type: "SYSTEM",
        title: "Top-up Successful",
        message: `Your deposit of ${coinAmount} coins via ${pay_currency.toUpperCase()} has been credited.`,
      } as any);
    } else if (internalStatus === "FAILED") {
      await supabase
        .from("crypto_payments")
        .update({ status: "FAILED", updated_at: new Date().toISOString() })
        .eq("id", cryptoPayment.id);

      await supabase.from("coin_transactions").insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: "TOPUP",
        amount: 0,
        balance_after: wallet.coin_balance,
        description: `Failed crypto top-up via NOWPayments (${pay_currency.toUpperCase()})`,
        reference_id: payment_id,
      } as any);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[NOWPAYMENTS WEBHOOK] Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
