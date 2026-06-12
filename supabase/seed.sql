-- Supabase Seed Data
-- Realistic test data for development and testing

-- ===========================================
-- USERS (via Supabase Auth - these would be created via auth API)
-- ===========================================
-- Note: Users must be created via Supabase Auth API, not direct SQL
-- This file assumes users already exist with these IDs

-- ===========================================
-- WALLETS
-- ===========================================
INSERT INTO wallets (user_id, coin_balance, lifetime_earned, lifetime_spent, referral_code)
SELECT 
  id,
  FLOOR(RANDOM() * 100000)::BIGINT,
  FLOOR(RANDOM() * 500000)::BIGINT,
  FLOOR(RANDOM() * 100000)::BIGINT,
  'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
FROM auth.users
LIMIT 10;

-- ===========================================
-- REFERRALS
-- ===========================================
INSERT INTO referrals (referrer_id, referred_user_id, status)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
  (SELECT id FROM auth.users LIMIT 1 OFFSET 1),
  'ACTIVE'
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 2);

INSERT INTO referrals (referrer_id, referred_user_id, status)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 1),
  (SELECT id FROM auth.users LIMIT 1 OFFSET 2),
  'ACTIVE'
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 3);

-- ===========================================
-- TASKS
-- ===========================================
INSERT INTO tasks (title, description, coin_reward, category, frequency, is_active, sort_order)
VALUES
  ('Daily Check-In', 'Check in daily to earn coins', 50, 'ENGAGEMENT', 'DAILY', true, 1),
  ('Watch Music Video', 'Watch a featured music video', 25, 'CONTENT', 'DAILY', true, 2),
  ('Share on Social Media', 'Share your favorite track', 100, 'SOCIAL', 'WEEKLY', true, 3),
  ('Complete Profile', 'Fill out your complete profile', 200, 'ONBOARDING', 'ONE_TIME', true, 4),
  ('Invite Friends', 'Refer a friend to the platform', 500, 'REFERRAL', 'UNLIMITED', true, 5),
  ('Rate a Song', 'Rate and review a track', 30, 'ENGAGEMENT', 'DAILY', true, 6),
  ('Create Playlist', 'Create and share a playlist', 150, 'CONTENT', 'ONE_TIME', true, 7),
  ('Attend Live Session', 'Join an artist live session', 75, 'EVENTS', 'WEEKLY', true, 8);

-- ===========================================
-- TASK COMPLETIONS
-- ===========================================
INSERT INTO task_completions (user_id, task_id, status, completion_count, last_completed_at)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
  id,
  'COMPLETED',
  FLOOR(RANDOM() * 30)::INTEGER,
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM tasks
WHERE category IN ('ENGAGEMENT', 'CONTENT')
LIMIT 5;

-- ===========================================
-- STREAKS
-- ===========================================
INSERT INTO streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date, next_reset_at)
SELECT 
  id,
  'DAILY_LOGIN',
  FLOOR(RANDOM() * 30)::INTEGER,
  FLOOR(RANDOM() * 60)::INTEGER,
  NOW() - (RANDOM() * INTERVAL '1 days'),
  NOW() + INTERVAL '1 day'
FROM auth.users
LIMIT 10;

-- ===========================================
-- ARTICLES
-- ===========================================
INSERT INTO articles (title, slug, excerpt, content, author_id, category, read_time_minutes, view_count, is_published, published_at)
VALUES
  ('How to Maximize Your Earnings', 'maximize-earnings-guide', 'Learn the best strategies to earn more coins', '<p>Complete guide content here...</p>', NULL, 'GUIDE', 5, 1250, true, NOW() - INTERVAL '7 days'),
  ('Top 10 Artists This Week', 'top-10-artists-weekly', 'Discover the hottest trending artists', '<p>Artist showcase content...</p>', NULL, 'NEWS', 3, 890, true, NOW() - INTERVAL '3 days'),
  ('New Feature: Crypto Wallet', 'crypto-wallet-announcement', 'Top up your wallet with cryptocurrency', '<p>Feature announcement...</p>', NULL, 'ANNOUNCEMENT', 2, 2100, true, NOW() - INTERVAL '1 day'),
  ('Music Industry Insights 2024', 'music-industry-insights-2024', 'Trends shaping the music industry', '<p>Industry analysis...</p>', NULL, 'INDUSTRY', 8, 567, true, NOW() - INTERVAL '14 days'),
  ('Artist Spotlight: Rising Stars', 'artist-spotlight-rising-stars', 'Meet the next generation of music icons', '<p>Artist profiles...</p>', NULL, 'FEATURE', 6, 432, true, NOW() - INTERVAL '5 days');

-- ===========================================
-- CONTESTS
-- ===========================================
INSERT INTO contests (title, description, start_date, end_date, entry_deadline, prize_pool_coins, status, category)
VALUES
  ('Best Cover Song Challenge', 'Submit your best cover version', NOW() - INTERVAL '10 days', NOW() + INTERVAL '10 days', NOW() + INTERVAL '5 days', 50000, 'ACTIVE', 'COVER'),
  ('Original Track Competition', 'Create an original masterpiece', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', NOW() + INTERVAL '20 days', 100000, 'ACTIVE', 'ORIGINAL'),
  ('Remix Battle', 'Remix the featured track', NOW() + INTERVAL '5 days', NOW() + INTERVAL '35 days', NOW() + INTERVAL '30 days', 75000, 'UPCOMING', 'REMIX');

-- ===========================================
-- STORES
-- ===========================================
INSERT INTO stores (name, slug, description, is_active)
VALUES
  ('Music Merchandise', 'music-merch', 'Official artist merchandise and collectibles', true),
  ('Digital Downloads', 'digital-downloads', 'Exclusive tracks and albums', true),
  ('VIP Experiences', 'vip-experiences', 'Concert tickets and meet & greets', true),
  ('Brand Partnerships', 'brand-partnerships', 'Special offers from our partners', true);

-- ===========================================
-- PRODUCTS
-- ===========================================
INSERT INTO products (store_id, name, description, price_coins, stock_quantity, image_url, is_available, category)
VALUES
  ((SELECT id FROM stores WHERE slug = 'music-merchandise' LIMIT 1), 'Limited Edition T-Shirt', 'Exclusive artist tour merchandise', 2500, 100, '/products/tshirt.jpg', true, 'APPAREL'),
  ((SELECT id FROM stores WHERE slug = 'music-merchandise' LIMIT 1), 'Signed Poster', 'Artist signed promotional poster', 1500, 50, '/products/poster.jpg', true, 'COLLECTIBLES'),
  ((SELECT id FROM stores WHERE slug = 'digital-downloads' LIMIT 1), 'Exclusive Single Download', 'High-quality FLAC format', 500, 999999, '/products/single.jpg', true, 'MUSIC'),
  ((SELECT id FROM stores WHERE slug = 'digital-downloads' LIMIT 1), 'Full Album Bundle', 'Complete album with bonus tracks', 2000, 999999, '/products/album.jpg', true, 'MUSIC'),
  ((SELECT id FROM stores WHERE slug = 'vip-experiences' LIMIT 1), 'VIP Concert Ticket', 'Front row seat with backstage access', 15000, 20, '/products/vip.jpg', true, 'EVENTS'),
  ((SELECT id FROM stores WHERE slug = 'brand-partnerships' LIMIT 1), 'Headphones Discount Voucher', '50% off premium headphones', 1000, 200, '/products/headphones.jpg', true, 'VOUCHER');

-- ===========================================
-- WITHDRAWAL REQUESTS
-- ===========================================
INSERT INTO withdrawal_requests (user_id, amount, coin_amount, status, account_details)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
  5000.00,
  500000,
  'PENDING',
  jsonb_build_object(
    'bank_name', 'GTBank',
    'account_number', '0123456789',
    'account_name', 'John Doe'
  )
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================
INSERT INTO notifications (user_id, type, title, message, is_read)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
  'SYSTEM',
  'Welcome to the Platform!',
  'Start earning coins by completing daily tasks',
  false
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

INSERT INTO notifications (user_id, type, title, message, is_read)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
  'REWARD',
  'Task Completed',
  'You earned 50 coins for Daily Check-In',
  true
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- ===========================================
-- ANALYTICS (Optional tracking)
-- ===========================================
INSERT INTO analytics_events (user_id, event_type, event_data)
SELECT 
  id,
  'PAGE_VIEW',
  jsonb_build_object('page', '/dashboard', 'timestamp', NOW())
FROM auth.users
LIMIT 20;

-- ===========================================
-- VERIFICATION
-- ===========================================
SELECT 'Seed data created successfully!' as status;
SELECT COUNT(*) as user_count FROM auth.users;
SELECT COUNT(*) as wallet_count FROM wallets;
SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as article_count FROM articles;
SELECT COUNT(*) as contest_count FROM contests;
SELECT COUNT(*) as product_count FROM products;