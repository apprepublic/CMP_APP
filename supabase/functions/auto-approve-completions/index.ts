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

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authClient = createClient(supabaseUrl, supabaseServiceKey);

  // Verify caller is authenticated (cron or admin)
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) {
    // Also allow service role key
    const apiKey = req.headers.get("apikey");
    if (apiKey !== Deno.env.get("SUPABASE_ANON_KEY")) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  let pool;
  try {
    const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
    pool = new Pool(dbUrl, 1);
    const client = await pool.connect();

    try {
      // Find all PENDING completions older than 24 hours
      const result = await client.queryObject`
        SELECT id, user_id, posted_task_id, coins_earned, completed_at
        FROM user_task_completions
        WHERE status = 'PENDING'
          AND completed_at < NOW() - INTERVAL '24 hours'
        ORDER BY completed_at ASC
        LIMIT 100
      `;

      const completions = result.rows as any[];
      console.log(`Found ${completions.length} completions to auto-approve`);

      let approved = 0;
      let errors = 0;

      for (const completion of completions) {
        try {
          // Approve the completion
          await client.queryObject`
            UPDATE user_task_completions
            SET status = 'APPROVED', reviewed_at = NOW(), rejection_reason = 'Auto-approved after 24 hours'
            WHERE id = ${completion.id}
          `;

          // Credit user's wallet
          const walletResult = await client.queryObject`
            SELECT id, balance, lifetime_earned FROM wallets WHERE user_id = ${completion.user_id} LIMIT 1
          `;
          const wallet = walletResult.rows[0] as any;

          if (wallet) {
            const newBalance = Number(wallet.balance) + Number(completion.coins_earned);
            const newLifetimeEarned = Number(wallet.lifetime_earned) + Number(completion.coins_earned);

            await client.queryObject`
              UPDATE wallets
              SET balance = ${newBalance}, lifetime_earned = ${newLifetimeEarned}, updated_at = NOW()
              WHERE id = ${wallet.id}
            `;

            // Create coin transaction
            const txId = crypto.randomUUID();
            await client.queryObject`
              INSERT INTO coin_transactions (id, user_id, type, amount, balance_after, description, reference_id)
              VALUES (${txId}, ${completion.user_id}, 'bonus', ${Number(completion.coins_earned)}, ${newBalance}, ${'Auto-approved task completion'}, ${completion.posted_task_id})
            `;
          }

          approved++;
        } catch (err) {
          console.error(`Failed to auto-approve ${completion.id}:`, err);
          errors++;
        }
      }

      return new Response(JSON.stringify({
        message: "Auto-approve completed",
        approved,
        errors,
        total: completions.length,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } finally {
    if (pool) await pool.end();
  }
};

serve(handler);
