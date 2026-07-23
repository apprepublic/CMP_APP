import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const jsonResponse = (body: Record<string, any>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : undefined;

    if (!token || !UUID_RE.test(token)) return jsonResponse({ error: "Invalid reset token" });

    // Look up token
    const { data: resetToken, error: lookupError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (lookupError || !resetToken) return jsonResponse({ error: "Invalid or expired reset link" });

    if (resetToken.used_at) return jsonResponse({ error: "This reset link has already been used" });

    if (new Date(resetToken.expires_at) < new Date()) return jsonResponse({ error: "This reset link has expired" });

    // If no password provided, just validate the token
    if (!password) {
      return jsonResponse({ valid: true, email: resetToken.email });
    }

    // Validate password
    if (password.length < 8) return jsonResponse({ error: "Password must be at least 8 characters" });
    if (password.length > 128) return jsonResponse({ error: "Password too long" });

    // Look up user by email from public.users (mirrors auth.users)
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", resetToken.email)
      .single();
    if (userError || !userRecord) return jsonResponse({ error: "User not found" });

    // Update password via Auth Admin API
    const adminRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userRecord.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!adminRes.ok) {
      const adminBody = await adminRes.json().catch(() => ({}));
      return jsonResponse({ error: adminBody?.msg || "Failed to update password" });
    }

    // Mark token as used
    await supabase.from("password_reset_tokens").update({ used_at: new Date().toISOString() }).eq("id", resetToken.id);

    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ error: err?.message || "Internal server error" });
  }
};

serve(handler);
