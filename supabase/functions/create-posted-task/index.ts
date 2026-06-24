import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CREATION_FEE = 500;
const VALID_TASK_TYPES = [
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

  let pool;
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized - missing auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { title, description, type, participantThreshold, totalBudget, socialRequirements, musicMetadata } = body;

    // Validations
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

    // Connect to database
    const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
    pool = new Pool(dbUrl, 1);
    const client = await pool.connect();

    try {
      // Get wallet
      const walletResult = await client.queryObject`
        SELECT id, balance, lifetime_earned FROM wallets WHERE user_id = ${user.id} LIMIT 1
      `;
      const wallet = walletResult.rows[0] as any;

      if (!wallet) {
        return new Response(JSON.stringify({ error: "Wallet not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const currentBalance = Number(wallet.balance);
      if (currentBalance < totalCost) {
        return new Response(JSON.stringify({
          error: "Insufficient balance. Please top up your wallet.",
          code: "INSUFFICIENT_BALANCE",
          required: totalCost,
          available: currentBalance,
        }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const newBalance = currentBalance - totalCost;

      let artistId = null;
      let songId = null;

      if (type === "STREAM_MUSIC" && musicMetadata) {
        // Find if artist already exists for this user
        const artistQuery = await client.queryObject`
          SELECT id FROM artists WHERE user_id = ${user.id} LIMIT 1
        `;
        
        if (artistQuery.rows.length > 0) {
          artistId = (artistQuery.rows[0] as any).id;
        } else {
          // Create a new artist profile for the user
          const stageName = user.user_metadata?.full_name || user.email?.split('@')[0] || "User Artist";
          const baseSlug = stageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || "artist";
          const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
          
          const newArtistQuery = await client.queryObject`
            INSERT INTO artists (user_id, stage_name, slug, bio, is_verified)
            VALUES (${user.id}, ${stageName}, ${uniqueSlug}, 'Artist profile created from posted task', false)
            RETURNING id
          `;
          artistId = (newArtistQuery.rows[0] as any).id;
        }

        // Create the song record
        const songBaseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || "song";
        const songSlug = `${songBaseSlug}-${Math.random().toString(36).substring(2, 7)}`;
        
        const songInsertQuery = await client.queryObject`
          INSERT INTO songs (artist_id, title, slug, description, audio_url, cover_url, duration_seconds, genre, coin_reward, is_published)
          VALUES (${artistId}, ${title}, ${songSlug}, ${description}, ${musicMetadata.audioUrl}, ${musicMetadata.coverImageUrl || null}, ${musicMetadata.durationSeconds || 180}, ${musicMetadata.genre || null}, ${coinPerParticipant}, false)
          RETURNING id
        `;
        songId = (songInsertQuery.rows[0] as any).id;
      }

      const taskResult = await client.queryObject`
        INSERT INTO user_posted_tasks (creator_id, title, description, type, category, participant_threshold, total_budget, coin_per_participant, creation_fee, status, current_participants, is_active, social_requirements, audio_url, cover_image_url, genre, duration_seconds, is_download_enabled, song_id)
        VALUES (${user.id}, ${title}, ${description}, ${type}, 'USER_CREATED', ${participantThreshold}, ${totalBudget}, ${coinPerParticipant}, ${CREATION_FEE}, 'PENDING', 0, false, ${socialRequirements ? JSON.stringify(socialRequirements) : null}::jsonb, ${musicMetadata?.audioUrl || null}, ${musicMetadata?.coverImageUrl || null}, ${musicMetadata?.genre || null}, ${musicMetadata?.durationSeconds || null}, ${musicMetadata?.isDownloadEnabled || false}, ${songId})
        RETURNING id
      `;
      const postedTask = taskResult.rows[0] as any;
      console.log("Task created:", postedTask.id);

      await client.queryObject`
        UPDATE wallets SET balance = ${newBalance}, updated_at = NOW() WHERE id = ${wallet.id}
      `;

      const txId = crypto.randomUUID();
      await client.queryObject`
        INSERT INTO coin_transactions (id, user_id, type, amount, balance_after, description, reference_id)
        VALUES (${txId}, ${user.id}, 'spend', ${totalCost}, ${newBalance}, ${`Posted task: ${title}`}, ${postedTask.id})
      `;

      return new Response(JSON.stringify({
        message: "Task created successfully",
        task: postedTask,
        totalCost,
        coinPerParticipant,
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
