import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

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
    const coinsToCredit = Math.max(Math.floor(amountNaira * 0.9), Number(cmpAmount) || 0); // 10% platform fee → 0.9 coins per Naira

    // Credit wallet via DB pool for atomic update
    const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
    const pool = new Pool(dbUrl, 1);
    const pgClient = await pool.connect();
    let newBalance: number;
    let walletId: string;

    try {
      const res = await pgClient.queryObject`
        UPDATE wallets SET coin_balance = coin_balance + ${coinsToCredit}, updated_at = NOW()
        WHERE user_id = ${user.id}
        RETURNING id, coin_balance
      `;

      if (!res.rows.length) {
        return new Response(JSON.stringify({ error: "Wallet not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const row = res.rows[0] as any;
      walletId = row.id;
      newBalance = Number(row.coin_balance);

      // Record transaction
      const { error: txnError } = await supabase
        .from("coin_transactions")
        .insert({
          wallet_id: walletId,
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
    } finally {
      pgClient.release();
      await pool.end();
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
