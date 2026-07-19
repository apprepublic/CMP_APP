import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io/v1";

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
    const nowpaymentsApiKey = Deno.env.get("NOWPAYMENTS_API_KEY");

    if (!nowpaymentsApiKey) {
      return new Response(JSON.stringify({ error: "NOWPayments API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { amount, currency = "USD", pay_currency, orderId, description, cmpAmount } = body;

    if (!amount || !orderId) {
      return new Response(JSON.stringify({ error: "Amount and orderId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appUrl = Deno.env.get("APP_URL") || "https://cmpapp.ng";

    const paymentRes = await fetch(`${NOWPAYMENTS_BASE_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": nowpaymentsApiKey,
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: currency.toUpperCase(),
        pay_currency: pay_currency || null,
        ipn_callback_url: `${supabaseUrl}/functions/v1/payments-nowpayments-webhook`,
        order_id: orderId,
        order_description: description || `Wallet top-up for order ${orderId}`,
      }),
    });

    if (!paymentRes.ok) {
      const errBody = await paymentRes.json();
      console.error("[NOWPAYMENTS] API Error:", errBody);
      return new Response(JSON.stringify({ error: errBody.message || errBody.error || "Failed to create payment with NOWPayments" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payment = await paymentRes.json();

    const { data: inserted, error: insertError } = await supabase.from("crypto_payments").insert({
      user_id: user.id,
      nowpayments_id: payment.id,
      order_id: payment.order_id,
      price_amount: payment.price_amount,
      price_currency: payment.price_currency,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency,
      pay_address: payment.pay_address,
      coin_amount: cmpAmount || 0,
      status: "PENDING",
      metadata: { cmpAmount, fiatAmount: amount, paymentUrl: payment.payment_url },
      expires_at: payment.expiration_estimate_date,
    } as any).select("id").single();

    if (insertError) {
      console.error("[NOWPAYMENTS] Failed to insert crypto_payments record:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save payment record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      id: inserted.id,
      paymentId: payment.id,
      tokenId: payment.token_id,
      orderId: payment.order_id,
      paymentUrl: payment.payment_url,
      payAddress: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      expirationDate: payment.expiration_estimate_date,
      priceAmount: payment.price_amount,
      priceCurrency: payment.price_currency,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[NOWPAYMENTS] Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to create payment" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
