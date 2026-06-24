-- ===========================================
-- MUSIC SCHEMA + SEED DATA (0017)
-- Self-contained: creates tables if missing,
-- then inserts demo artists and songs.
-- Safe to run multiple times (idempotent).
-- References auth.users (Supabase built-in) instead of
-- public.users which may not exist on all instances.
-- ===========================================

-- ---- ARTISTS TABLE (from 0004, safe re-run) ----
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- ---- SONGS TABLE (from 0004, safe re-run) ----
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
  coin_reward INTEGER NOT NULL DEFAULT 0,
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

-- ---- SONG PLAYS TABLE (from 0004, safe re-run) ----
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

-- ---- updated_at TRIGGER ----
-- Reuses the update_updated_at_column() function from 0001
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_artists_updated_at'
  ) THEN
    CREATE TRIGGER update_artists_updated_at
      BEFORE UPDATE ON artists
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_songs_updated_at'
  ) THEN
    CREATE TRIGGER update_songs_updated_at
      BEFORE UPDATE ON songs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ---- ROW LEVEL SECURITY ----
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_plays ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'artists' AND policyname = 'Anyone can view artists'
  ) THEN
    CREATE POLICY "Anyone can view artists"
      ON artists FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'Anyone can view published songs'
  ) THEN
    CREATE POLICY "Anyone can view published songs"
      ON songs FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'song_plays' AND policyname = 'Users can view own plays'
  ) THEN
    CREATE POLICY "Users can view own plays"
      ON song_plays FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'song_plays' AND policyname = 'Users can log own plays'
  ) THEN
    CREATE POLICY "Users can log own plays"
      ON song_plays FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
  END IF;
END $$;

-- ===========================================
-- SEED DATA — Demo Artists
-- ===========================================
INSERT INTO artists (id, stage_name, slug, bio, avatar_url, cover_url, genre, is_verified, follower_count, monthly_listeners)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'AfroBeats Nation',
    'afrobeats-nation',
    'Bringing the best of Afrobeats from Lagos to the world.',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
    'Afrobeats',
    true,
    12400,
    98000
  ),
  (
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'Naija Vibes',
    'naija-vibes',
    'Fresh sounds blending Afropop and highlife from the heart of Nigeria.',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&q=80',
    'Afropop',
    true,
    8700,
    54000
  ),
  (
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'Sunset Collective',
    'sunset-collective',
    'Chill lo-fi and R&B sounds for late nights and early mornings.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&q=80',
    'R&B',
    false,
    3100,
    21000
  )
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- SEED DATA — Demo Songs (public-domain MP3s)
-- ===========================================
INSERT INTO songs (
  id, artist_id, title, slug, description,
  audio_url, cover_url, duration_seconds,
  genre, coin_reward, play_count, is_featured, is_published
)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001'::uuid,
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'Lagos Nights',
    'lagos-nights',
    'A pulsating Afrobeats track that captures the energy of Lagos after dark.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    214, 'Afrobeats', 10, 4520, true, true
  ),
  (
    'b1000000-0000-0000-0000-000000000002'::uuid,
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'Harmattan Dance',
    'harmattan-dance',
    'Dusty rhythms and electric percussion inspired by Northern Nigeria.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    198, 'Afrobeats', 8, 3210, false, true
  ),
  (
    'b1000000-0000-0000-0000-000000000003'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'Eko Bridge',
    'eko-bridge',
    'Smooth Afropop with traditional highlife guitar lines.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&q=80',
    227, 'Afropop', 12, 5800, true, true
  ),
  (
    'b1000000-0000-0000-0000-000000000004'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'Monday Morning',
    'monday-morning',
    'An upbeat track to start your week right.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80',
    183, 'Afropop', 10, 2940, false, true
  ),
  (
    'b1000000-0000-0000-0000-000000000005'::uuid,
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'Late Hours',
    'late-hours',
    'Lo-fi R&B beats for studying, chilling, and winding down.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    241, 'R&B', 15, 7120, true, true
  ),
  (
    'b1000000-0000-0000-0000-000000000006'::uuid,
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'Golden Hour',
    'golden-hour',
    'Dreamy R&B inspired by sunset colours and city lights.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    196, 'R&B', 15, 6340, false, true
  ),
  (
    'b1000000-0000-0000-0000-000000000007'::uuid,
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'Surulere Shuffle',
    'surulere-shuffle',
    'Old-school Afrobeats with a modern production twist.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=600&q=80',
    219, 'Afrobeats', 8, 1890, false, true
  ),
  (
    'b1000000-0000-0000-0000-000000000008'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'Victoria Island',
    'victoria-island',
    'Luxury vibes and smooth melodies from the island.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
    205, 'Afropop', 10, 3670, false, true
  )
ON CONFLICT (id) DO NOTHING;
