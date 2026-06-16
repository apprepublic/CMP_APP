import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    console.log("=== VERIFY FUNCTION STARTED ===");
    
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json();
    
    console.log("Request body:", JSON.stringify(body));

    const token = typeof body.token === "string" ? body.token.trim() : undefined;
    const code = typeof body.code === "string" ? body.code.replace(/[^0-9]/g, "").slice(0, 6) : undefined;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
    const password = typeof body.password === "string" ? body.password : undefined;

    console.log("Parsed:", { token, code, email, hasPassword: !!password });

    let query = supabase.from("pending_registrations").select("*");
    if (token && UUID_RE.test(token)) {
      query = query.eq("verification_token", token);
    } else if (code && CODE_RE.test(code) && email) {
      query = query.eq("verification_code", code).eq("email", email);
    } else {
      console.log("Invalid token/code");
      return jsonResponse({ error: "Token or code+email required" });
    }

    const { data: pendingReg, error: lookupError } = await query.single();
    
    if (lookupError || !pendingReg) {
      console.log("Lookup error:", lookupError);
      return jsonResponse({ error: "Invalid or expired verification. Please register again." });
    }

    console.log("Found pending registration:", pendingReg.email);

    if (new Date(pendingReg.expires_at) < new Date()) {
      await supabase.from("pending_registrations").delete().eq("id", pendingReg.id);
      return jsonResponse({ error: "Verification expired. Please register again." });
    }

    if (pendingReg.used_at) {
      return jsonResponse({ error: "Already used. Please sign in." });
    }

    if (!password) {
      console.log("No password provided, returning requiresPassword");
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

    console.log("Creating auth user...");
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: pendingReg.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: pendingReg.full_name },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return jsonResponse({ error: "Failed to create account: " + authError.message });
    }

    const userId = authData.user.id;
    console.log("Auth user created:", userId);

    // Create profile
    console.log("Creating user profile...");
    const { error: profileError } = await supabase.from("User").insert({
      id: userId,
      email: pendingReg.email,
      displayName: pendingReg.full_name,
    });

    if (profileError) {
      console.error("Profile error:", profileError);
      return jsonResponse({ error: "Failed to create profile: " + profileError.message });
    }

    // Create wallet
    console.log("Creating wallet...");
    const { error: walletError } = await supabase.from("Wallet").insert({
      userId: userId,
      coinBalance: 500,
      lifetimeEarned: 500,
      lifetimeSpent: 0,
    });

    if (walletError) {
      console.error("Wallet error:", walletError);
      return jsonResponse({ error: "Failed to create wallet: " + walletError.message });
    }

    // Create transaction
    console.log("Creating transaction...");
    const { data: walletData } = await supabase.from("Wallet").select("id").eq("userId", userId).single();
    
    if (walletData) {
      await supabase.from("CoinTransaction").insert({
        walletId: walletData.id,
        type: "EARN",
        amount: 500,
        balanceAfter: 500,
        description: "Signup bonus",
      });
    }

    // Handle referral
    if (pendingReg.referral_code) {
      const { data: referrer } = await supabase
        .from("Wallet").select("userId").eq("referralCode", pendingReg.referral_code).single();
      if (referrer) {
        await supabase.from("Referral").insert({
          referrerId: referrer.userId,
          referredUserId: userId,
          referralCode: pendingReg.referral_code,
          status: "pending",
        });
      }
    }

    // Delete pending registration
    await supabase.from("pending_registrations").delete().eq("id", pendingReg.id);

    console.log("Account created successfully!");
    return jsonResponse({ success: true, message: "Account created successfully", email: pendingReg.email });
  } catch (error) {
    console.error("=== VERIFY FUNCTION ERROR ===");
    console.error("Error:", error);
    console.error("Message:", error?.message);
    return jsonResponse({ error: "Internal server error: " + error?.message });
  }
};

serve(handler);