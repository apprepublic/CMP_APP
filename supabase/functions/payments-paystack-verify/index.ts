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
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!paystackSecretKey) {
      return new Response(JSON.stringify({ error: "Paystack secret key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller is authenticated
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized – missing auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { reference, cmpAmount } = body;

    if (!reference || !cmpAmount) {
      return new Response(JSON.stringify({ error: "Missing required fields: reference, cmpAmount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify transaction with Paystack API
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!verifyRes.ok) {
      const errBody = await verifyRes.text();
      console.error("[PAYSTACK] Verification request failed:", errBody);
      return new Response(JSON.stringify({ error: "Failed to verify transaction with Paystack" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await verifyRes.json();

    if (!result.status || result.data.status !== "success") {
      return new Response(JSON.stringify({ error: `Transaction not successful: ${result.data.status}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amountKobo = result.data.amount;
    const amountNaira = amountKobo / 100;
    const coinAmount = Math.floor(amountNaira * 90); // 10% platform fee
    const coinsToCredit = Math.max(coinAmount, cmpAmount);

    // Credit wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id, coin_balance")
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentBalance = Number((wallet as any).coin_balance) || 0;
    const newBalance = currentBalance + coinsToCredit;

    const { error: updateError } = await supabase
      .from("wallets")
      .update({ coin_balance: newBalance.toString() } as any)
      .eq("id", (wallet as any).id);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Failed to credit wallet" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record transaction
    const { error: txnError } = await supabase
      .from("coin_transactions")
      .insert({
        wallet_id: (wallet as any).id,
        user_id: user.id,
        type: "TOPUP",
        amount: coinsToCredit,
        balance_after: newBalance.toString(),
        description: `Top-up via Paystack: ₦${amountNaira.toLocaleString()}`,
        metadata: {
          paystackReference: reference,
          amountNaira,
          amountKobo,
        },
      } as any);

    if (txnError) {
      console.error("[PAYSTACK] Failed to record transaction:", txnError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        coinsCredited: coinsToCredit,
        amountPaid: amountNaira,
        reference,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("[PAYSTACK] Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Verification failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
