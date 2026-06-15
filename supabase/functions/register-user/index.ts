import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const handler = async (req: Request): Promise<Response> => {
  console.log("HELLO FROM FUNCTION");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: { "Access-Control-Allow-Origin": "*" } 
    });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    message: "Function is working!",
    method: req.method,
    url: req.url 
  }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
};

serve(handler);