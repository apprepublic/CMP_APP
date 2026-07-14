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
    if (apiKey !== Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
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
        SELECT id, user_id, posted_task_id, coins_earned, completed_at, proof_data
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
            SELECT id, coin_balance, lifetime_earned FROM wallets WHERE user_id = ${completion.user_id} LIMIT 1
          `;
          const wallet = walletResult.rows[0] as any;

          if (wallet) {
            const res = await client.queryObject`
              UPDATE wallets
              SET coin_balance = coin_balance + ${Number(completion.coins_earned)},
                  lifetime_earned = lifetime_earned + ${Number(completion.coins_earned)},
                  updated_at = NOW()
              WHERE id = ${wallet.id}
              RETURNING coin_balance
            `;
            const newBalance = Number((res.rows[0] as any)?.coin_balance || 0);

            const txId = crypto.randomUUID();
            await client.queryObject`
              INSERT INTO coin_transactions (id, wallet_id, user_id, type, amount, balance_after, description)
              VALUES (${txId}, ${wallet.id}, ${completion.user_id}, 'bonus', ${Number(completion.coins_earned)}, ${newBalance}, ${'Auto-approved task completion'})
            `;
          }

            approved++;

            // Delete screenshot proof if present
            const proofData = completion.proof_data as any;
            if (proofData?.screenshot && typeof proofData.screenshot === 'string') {
              try {
                const screenshotUrl = proofData.screenshot;
                const parsedUrl = new URL(screenshotUrl);
                const pathParts = parsedUrl.pathname.split('/');
                const bucketIdx = pathParts.indexOf('task-attachments');
                if (bucketIdx !== -1) {
                  const storagePath = pathParts.slice(bucketIdx + 1).join('/');
                  if (storagePath) {
                    await authClient.storage.from('task-attachments').remove([storagePath]);
                  }
                }
              } catch {
                // Non-storage URL — skip silently
              }
            }
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
