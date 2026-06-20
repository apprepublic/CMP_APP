import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CREATION_FEE = 500;
const VALID_TASK_TYPES = [
  "READ_ARTICLE",
  "WATCH_VIDEO",
  "SHARE_SOCIAL",
  "COMPLETE_SURVEY",
  "APP_DOWNLOAD",
  "VOTE",
  "SOCIAL_ENGAGEMENT",
  "STREAM_MUSIC",
];

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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    const title = body.title;
    const description = body.description;
    const type = body.type;
    const participantThreshold = body.participantThreshold;
    const totalBudget = body.totalBudget;
    const socialRequirements = body.socialRequirements;
    const musicMetadata = body.musicMetadata;

    if (!title || title.length < 3 || title.length > 200) {
      return new Response(JSON.stringify({ error: "Title must be 3-200 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!description || description.length < 3 || description.length > 1000) {
      return new Response(JSON.stringify({ error: "Description must be 3-1000 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!VALID_TASK_TYPES.includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid task type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!participantThreshold || participantThreshold < 10 || participantThreshold > 10000) {
      return new Response(JSON.stringify({ error: "Participants must be 10-10000" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!totalBudget || totalBudget < 1000 || totalBudget > 1000000) {
      return new Response(JSON.stringify({ error: "Budget must be 1000-1000000" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const coinPerParticipant = Math.floor(totalBudget / participantThreshold);
    if (coinPerParticipant < 10) {
      return new Response(JSON.stringify({ error: "Coin per participant must be at least 10" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "STREAM_MUSIC" && (!musicMetadata || !musicMetadata.audioUrl)) {
      return new Response(JSON.stringify({ error: "Music tasks require audioUrl" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalCost = CREATION_FEE + totalBudget;

    const { data: wallet, error: walletError } = await supabase
      .from("Wallet")
      .select("id, coinBalance, lifetimeSpent")
      .eq("userId", user.id)
      .single();

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentBalance = Number(wallet.coinBalance);

    if (currentBalance < totalCost) {
      return new Response(
        JSON.stringify({
          error: "Insufficient balance. Please top up your wallet.",
          code: "INSUFFICIENT_BALANCE",
          required: totalCost,
          available: currentBalance,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newBalance = currentBalance - totalCost;

    let songId = null;
    if (type === "STREAM_MUSIC" && musicMetadata) {
      const { data: artistProfile } = await supabase
        .from("ArtistProfile")
        .select("id")
        .eq("userId", user.id)
        .single();

      if (artistProfile) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
        const { data: song, error: songError } = await supabase
          .from("Song")
          .insert({
            artistId: artistProfile.id,
            title,
            slug,
            description,
            audioUrl: musicMetadata.audioUrl,
            coverUrl: musicMetadata.coverImageUrl || null,
            genre: musicMetadata.genre || "Unknown",
            durationSeconds: musicMetadata.durationSeconds || 0,
            coinReward: coinPerParticipant,
            isPublished: true,
          })
          .select("id")
          .single();

        if (!songError && song) {
          songId = song.id;
        }
      }
    }

    const { data: postedTask, error: taskError } = await supabase
      .from("UserPostedTask")
      .insert({
        creatorId: user.id,
        title,
        description,
        type,
        category: "USER_CREATED",
        participantThreshold,
        totalBudget,
        coinPerParticipant,
        creationFee: CREATION_FEE,
        status: "PENDING",
        currentParticipants: 0,
        isActive: false,
        audioUrl: musicMetadata?.audioUrl || null,
        coverImageUrl: musicMetadata?.coverImageUrl || null,
        genre: musicMetadata?.genre || null,
        durationSeconds: musicMetadata?.durationSeconds || null,
        isDownloadEnabled: musicMetadata?.isDownloadEnabled || false,
        songId,
      })
      .select("id")
      .single();

    if (taskError) {
      console.error("Task insert error:", taskError);
      return new Response(JSON.stringify({ error: "Failed to create task: " + taskError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentLifetimeSpent = Number(wallet.lifetimeSpent || 0);
    const newLifetimeSpent = currentLifetimeSpent + totalCost;

    const { error: walletUpdateError } = await supabase
      .from("Wallet")
      .update({
        coinBalance: newBalance,
        lifetimeSpent: newLifetimeSpent,
      })
      .eq("id", wallet.id);

    if (walletUpdateError) {
      console.error("Wallet update error:", walletUpdateError);
    }

    const { error: txError } = await supabase.from("CoinTransaction").insert({
      walletId: wallet.id,
      type: "TASK_CREATION",
      amount: -totalCost,
      balanceAfter: newBalance,
      description: `Posted task: ${title}`,
      metadata: {
        postedTaskId: postedTask.id,
        creationFee: CREATION_FEE,
        budget: totalBudget,
      },
    });

    if (txError) {
      console.error("Transaction insert error:", txError);
    }

    return new Response(
      JSON.stringify({
        message: "Task created successfully",
        task: postedTask,
        totalCost,
        coinPerParticipant,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
