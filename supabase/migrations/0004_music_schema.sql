-- ===========================================
-- MUSIC SCHEMA MIGRATION (0004)
-- Adds the music vertical the web app needs: artists, songs and play logs.
-- The web app reads Supabase directly, and the base schema had no music
-- tables, so the music page could only use mock data. This adds them.
-- ===========================================

-- ===========================================
-- ARTISTS
-- ===========================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- nullable: platform/label artists need no auth user
  stage_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  genre TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  follower_count INTEGER NOT NULL DEFAULT 0,
  monthly_listeners INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_genre ON artists(genre);

-- ===========================================
-- SONGS
-- ===========================================
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  genre TEXT,
  coin_reward INTEGER NOT NULL DEFAULT 0, -- coins earned per qualifying stream
  play_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  released_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_slug ON songs(slug);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
CREATE INDEX IF NOT EXISTS idx_songs_featured ON songs(is_featured);
CREATE INDEX IF NOT EXISTS idx_songs_published ON songs(is_published);

-- ===========================================
-- SONG PLAYS (stream-to-earn audit log)
-- ===========================================
CREATE TABLE IF NOT EXISTS song_plays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seconds_played INTEGER NOT NULL DEFAULT 0,
  is_rewarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_song_plays_song ON song_plays(song_id);
CREATE INDEX IF NOT EXISTS idx_song_plays_user ON song_plays(user_id);

-- ===========================================
-- updated_at triggers (reuse function from base migration)
-- ===========================================
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ROW LEVEL SECURITY (public read for catalog; writes via service role / API)
-- ===========================================
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artists"
  ON artists FOR SELECT USING (true);

CREATE POLICY "Anyone can view published songs"
  ON songs FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view own plays"
  ON song_plays FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log own plays"
  ON song_plays FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

COMMENT ON TABLE artists IS 'Music artists / creators';
COMMENT ON TABLE songs IS 'Streamable tracks with audio URLs and stream-to-earn rewards';
COMMENT ON TABLE song_plays IS 'Per-stream audit log used to award streaming coins';