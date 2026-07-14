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

    console.log("Creating auth user via direct Auth Admin API...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Log env diagnostics (mask key for safety)
    console.log("SUPABASE_URL:", supabaseUrl ? supabaseUrl.slice(0, 30) + "..." : "MISSING");
    console.log("SERVICE_ROLE_KEY present:", !!serviceRoleKey);

    // Rollback helper: delete auth user if downstream steps fail
    let userId: string | null = null;
    const cleanupAuthUser = async () => {
      if (userId) {
        try {
          await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
            method: "DELETE",
            headers: {
              "apikey": serviceRoleKey,
              "Authorization": `Bearer ${serviceRoleKey}`,
            },
          });
        } catch (e) {
          console.error("Failed to clean up auth user:", e);
        }
      }
    };

    // Insert into users table FIRST (no auth dependency)
    const tempId = crypto.randomUUID();
    const { error: usersError } = await supabase.from("users").insert({
      id: tempId,
      email: pendingReg.email,
      full_name: pendingReg.full_name,
      phone_number: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (usersError) {
      console.error("Users table insert error:", usersError);
      return jsonResponse({ error: "Failed to create user profile" });
    }

    // Create wallet with 500 signup bonus
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .insert({
        user_id: tempId,
        coin_balance: 500,
        lifetime_earned: 500,
        lifetime_spent: 0,
        referral_code: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (walletError) {
      console.error("Wallet creation error:", walletError);
      await supabase.from("users").delete().eq("id", tempId);
      return jsonResponse({ error: "Failed to create wallet" });
    }

    const walletId = walletData?.id;
    console.log("Wallet created for temp user:", tempId, "wallet_id:", walletId);

    // Record signup bonus in coin_transactions
    if (walletId) {
      const { error: coinTransactionError } = await supabase.from("coin_transactions").insert({
        id: crypto.randomUUID(),
        wallet_id: walletId,
        type: 'earn',
        amount: 500,
        balance_after: 500,
        description: 'Signup bonus — Welcome to CMPapp!',
        created_at: new Date().toISOString(),
      });

      if (coinTransactionError) {
        console.error("Coin transaction error:", coinTransactionError);
      }
    }

    // NOW create the auth user (last step — nothing depends on it to succeed)
    const adminRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        email: pendingReg.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: pendingReg.full_name },
      }),
    });

    const adminBody = await adminRes.json().catch(() => ({}));
    console.log("Auth Admin API response:", adminRes.status, JSON.stringify(adminBody));

    if (!adminRes.ok) {
      const errMsg = adminBody?.msg
        ?? adminBody?.message
        ?? adminBody?.error_description
        ?? adminBody?.error
        ?? `Auth API returned ${adminRes.status}`;

      if (
        typeof errMsg === "string" &&
        (errMsg.includes("already been registered") || errMsg.includes("User already exists"))
      ) {
        // Auth user already exists — clean up the temp profile/wallet we created
        await supabase.from("coin_transactions").delete().eq("wallet_id", walletId);
        await supabase.from("wallets").delete().eq("id", walletId);
        await supabase.from("users").delete().eq("id", tempId);
        return jsonResponse({ error: "This email is already registered. Please sign in instead." });
      }
      console.error("Auth Admin API error:", adminRes.status, JSON.stringify(adminBody));
      // Auth creation failed — clean up temp profile/wallet
      await supabase.from("coin_transactions").delete().eq("wallet_id", walletId);
      await supabase.from("wallets").delete().eq("id", walletId);
      await supabase.from("users").delete().eq("id", tempId);
      return jsonResponse({ error: "Failed to create account: " + errMsg });
    }

    userId = adminBody.id;
    console.log("Auth user created:", userId);

    // Update temp user id to real auth user id
    const { error: updateIdError } = await supabase.from("users").update({ id: userId }).eq("id", tempId);
    if (updateIdError) {
      console.error("Failed to update user id, rolling back...", updateIdError);
      await supabase.from("coin_transactions").delete().eq("wallet_id", walletId);
      await supabase.from("wallets").delete().eq("id", walletId);
      await supabase.from("users").delete().eq("id", tempId);
      await cleanupAuthUser();
      return jsonResponse({ error: "Failed to finalize account" });
    }

    // Update wallet user_id and pending_registration id
    await supabase.from("wallets").update({ user_id: userId }).eq("user_id", tempId);
    await supabase.from("pending_registrations").delete().eq("id", pendingReg.id);

    // Handle referral if provided
    if (pendingReg.referral_code) {
      const { data: referrerWallet } = await supabase
        .from("wallets")
        .select("user_id")
        .eq("referral_code", pendingReg.referral_code)
        .maybeSingle();

      if (referrerWallet?.user_id) {
        const { error: referralError } = await supabase.from("referrals").insert({
          referrer_id: referrerWallet.user_id,
          referred_user_id: userId,
          status: "PENDING",
          created_at: new Date().toISOString(),
        });
        if (referralError) {
          console.error("Referral creation error:", referralError);
        }
      }
    }

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