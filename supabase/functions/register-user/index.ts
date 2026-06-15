import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== FUNCTION STARTED ===");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    console.log("Environment variables loaded:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      hasResend: !!resendApiKey
    });

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is missing!");
      return new Response(JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const body = await req.json();
    
    console.log("Request body received:", JSON.stringify(body));

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const referralCode = typeof body.referralCode === "string" ? body.referralCode.trim().slice(0, 20) : null;

    console.log("Parsed data:", { email, fullName, referralCode });

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!fullName || fullName.length < 2) {
      return new Response(JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: existingProfile } = await supabase
      .from("users").select("id").eq("email", email.toLowerCase()).maybeSingle();

    if (existingProfile) {
      return new Response(JSON.stringify({ error: "Email already exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const verificationToken = crypto.randomUUID();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await supabase.from("pending_registrations").delete().eq("email", email.toLowerCase());

    const { error: insertError } = await supabase.from("pending_registrations").insert({
      email: email.toLowerCase(),
      full_name: fullName,
      verification_token: verificationToken,
      verification_code: verificationCode,
      referral_code: referralCode || null,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log("Registration created successfully, email would be sent (disabled for testing)");
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Registration created (email disabled)",
      email: email.toLowerCase(),
      code: verificationCode // For testing only
    }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("=== FUNCTION ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return new Response(JSON.stringify({ error: "Internal server error", details: error?.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);