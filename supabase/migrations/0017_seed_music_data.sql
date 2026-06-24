-- ===========================================
-- MUSIC SEED DATA (0017)
-- Adds demo artists and songs so the music page
-- has real content to display.
-- Uses royalty-free / public-domain audio samples.
-- ===========================================

-- ---- ARTISTS ----
INSERT INTO artists (id, stage_name, slug, bio, avatar_url, cover_url, genre, is_verified, follower_count, monthly_listeners)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
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
    'a1000000-0000-0000-0000-000000000002',
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
    'a1000000-0000-0000-0000-000000000003',
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

-- ---- SONGS ----
-- Using freely available MP3 samples from public CDNs
INSERT INTO songs (
  id, artist_id, title, slug, description,
  audio_url, cover_url, duration_seconds,
  genre, coin_reward, play_count, is_featured, is_published
)
VALUES
  (
    's1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Lagos Nights',
    'lagos-nights',
    'A pulsating Afrobeats track that captures the energy of Lagos after dark.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    214,
    'Afrobeats',
    10,
    4520,
    true,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'Harmattan Dance',
    'harmattan-dance',
    'Dusty rhythms and electric percussion inspired by Northern Nigeria.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    198,
    'Afrobeats',
    8,
    3210,
    false,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002',
    'Eko Bridge',
    'eko-bridge',
    'Smooth Afropop with traditional highlife guitar lines.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&q=80',
    227,
    'Afropop',
    12,
    5800,
    true,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    'Monday Morning',
    'monday-morning',
    'An upbeat track to start your week right.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80',
    183,
    'Afropop',
    10,
    2940,
    false,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000003',
    'Late Hours',
    'late-hours',
    'Lo-fi R&B beats for studying, chilling, and winding down.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    241,
    'R&B',
    15,
    7120,
    true,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000003',
    'Golden Hour',
    'golden-hour',
    'Dreamy R&B inspired by sunset colours and city lights.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    196,
    'R&B',
    15,
    6340,
    false,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000007',
    'a1000000-0000-0000-0000-000000000001',
    'Surulere Shuffle',
    'surulere-shuffle',
    'Old-school Afrobeats with a modern production twist.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=600&q=80',
    219,
    'Afrobeats',
    8,
    1890,
    false,
    true
  ),
  (
    's1000000-0000-0000-0000-000000000008',
    'a1000000-0000-0000-0000-000000000002',
    'Victoria Island',
    'victoria-island',
    'Luxury vibes and smooth melodies from the island.',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
    205,
    'Afropop',
    10,
    3670,
    false,
    true
  )
ON CONFLICT (id) DO NOTHING;
