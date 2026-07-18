import "https://esm.sh/@supabase/supabase-js@2";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  const headers = { "Content-Type": "application/json" };
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers });

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });

    const today = new Date(); today.setHours(0, 0, 0, 0);

    const [totalUsers, activeUsers, pendingKyc, todayReg, pendingWd, articles, postedTasks, sysTasks, songs] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("kyc_status", "PENDING"),
      supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      supabase.from("withdrawal_requests").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("user_posted_tasks").select("*", { count: "exact", head: true }),
      supabase.from("tasks").select("*", { count: "exact", head: true }),
      supabase.from("songs").select("*", { count: "exact", head: true }),
    ]);

    const { data: wallets } = await supabase.from("wallets").select("coin_balance");
    const totalCoinSupply = wallets?.reduce((sum: number, w: any) => sum + Number(w.coin_balance || 0), 0) || 0;

    const { data: withdrawn } = await supabase.from("withdrawal_requests").select("coin_amount").eq("status", "PROCESSED");
    const totalWithdrawnCoins = withdrawn?.reduce((sum: number, r: any) => sum + Number(r.coin_amount || 0), 0) || 0;

    const data = {
      totalUsers: totalUsers.count || 0, activeUsers: activeUsers.count || 0,
      totalCoinSupply, pendingWithdrawals: pendingWd.count || 0,
      pendingKyc: pendingKyc.count || 0, totalArticles: articles.count || 0,
      postedTasksCount: postedTasks.count || 0, systemTasksCount: sysTasks.count || 0,
      totalSongs: songs.count || 0, todayRegistrations: todayReg.count || 0,
      totalWithdrawnCoins, usersByType: [], revenueByMonth: [],
    };

    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
