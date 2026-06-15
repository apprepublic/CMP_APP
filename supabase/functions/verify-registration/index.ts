import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE_RE = /^\d{6}$/;

const jsonResponse = (body: Record<string, any>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json();

    const token = typeof body.token === "string" ? body.token.trim() : undefined;
    const code = typeof body.code === "string" ? body.code.replace(/[^0-9]/g, "").slice(0, 6) : undefined;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
    const password = typeof body.password === "string" ? body.password : undefined;
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : undefined;

    let query = supabase.from("pending_registrations").select("*");
    if (token && UUID_RE.test(token)) {
      query = query.eq("verification_token", token);
    } else if (code && CODE_RE.test(code) && email) {
      query = query.eq("verification_code", code).eq("email", email);
    } else {
      return jsonResponse({ error: "Token or code+email required" });
    }

    const { data: pendingReg, error: lookupError } = await query.single();
    if (lookupError || !pendingReg) {
      return jsonResponse({ error: "Invalid or expired verification. Please register again." });
    }

    if (new Date(pendingReg.expires_at) < new Date()) {
      await supabase.from("pending_registrations").delete().eq("id", pendingReg.id);
      return jsonResponse({ error: "Verification expired. Please register again." });
    }

    if (pendingReg.used_at) {
      return jsonResponse({ error: "Already used. Please sign in." });
    }

    if (!password) {
      return jsonResponse({ 
        requiresPassword: true, 
        email: pendingReg.email, 
        fullName: pendingReg.full_name,
        referralCode: pendingReg.referral_code 
      });
    }

    if (password.length < 8 || password.length > 128) {
      return jsonResponse({ error: "Password must be 8-128 characters" });
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: pendingReg.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: pendingReg.full_name },
    });

    if (authError) {
      return jsonResponse({ error: "Failed to create account. Please try again." });
    }

    const userId = authData.user.id;

    await supabase.from("users").insert({
      id: userId,
      email: pendingReg.email,
      full_name: pendingReg.full_name,
    });

    await supabase.from("wallets").insert({
      user_id: userId,
      coin_balance: 500,
      lifetime_earned: 500,
      lifetime_spent: 0,
    });

    await supabase.from("coin_transactions").insert({
      wallet_id: (await supabase.from("wallets").select("id").eq("user_id", userId).single()).data.id,
      type: "EARN",
      amount: 500,
      balance_after: 500,
      description: "Signup bonus",
    });

    if (pendingReg.referral_code) {
      const { data: referrer } = await supabase
        .from("wallets").select("user_id").eq("referral_code", pendingReg.referral_code).single();
      if (referrer) {
        await supabase.from("referrals").insert({
          referrer_id: referrer.user_id,
          referred_user_id: userId,
          referral_code: pendingReg.referral_code,
          status: "pending",
        });
      }
    }

    await supabase.from("pending_registrations").delete().eq("id", pendingReg.id);

    return jsonResponse({ success: true, message: "Account created successfully", email: pendingReg.email });
  } catch (error) {
    console.error("Verification error:", error);
    return jsonResponse({ error: "Internal server error" });
  }
};

serve(handler);