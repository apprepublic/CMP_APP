import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("=== FUNCTION STARTED ===");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    console.log("Env vars:", { hasUrl: !!supabaseUrl, hasKey: !!supabaseServiceKey });

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const body = await req.json();
    
    console.log("Body:", JSON.stringify(body));

    const email = body.email?.trim() || "";
    const fullName = body.fullName?.trim() || "";

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!fullName || fullName.length < 2) {
      return new Response(JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check existing user
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Email exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create pending registration
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomUUID();
    
    await supabase.from("pending_registrations").delete().eq("email", email.toLowerCase());
    
    const { error } = await supabase.from("pending_registrations").insert({
      email: email.toLowerCase(),
      full_name: fullName,
      verification_code: code,
      verification_token: token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) {
      console.error("DB error:", error);
      return new Response(JSON.stringify({ error: "DB error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log("Success! Code:", code);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Registration created",
      email: email.toLowerCase(),
      verificationCode: code // For testing - remove in production
    }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error("ERROR:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);