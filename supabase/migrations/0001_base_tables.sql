-- Base Tables Migration
-- Creates core tables from Prisma schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- USERS TABLE (synced with Supabase Auth)
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  kyc_status TEXT DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
  kyc_metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update users from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (if Supabase auth is used)
-- Note: This requires superuser privileges to create
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT OR UPDATE ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- WALLETS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coin_balance BIGINT NOT NULL DEFAULT 0,
  lifetime_earned BIGINT NOT NULL DEFAULT 0,
  lifetime_spent BIGINT NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE NOT NULL DEFAULT CONCAT('REF', UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE UNIQUE INDEX idx_wallets_referral_code ON wallets(referral_code);

-- Trigger to create wallet on user creation
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallet_on_user
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();

-- ===========================================
-- REFERRALS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_user_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, ACTIVE, COMPLETED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);

-- ===========================================
-- TASKS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL, -- ENGAGEMENT, CONTENT, SOCIAL, ONBOARDING, REFERRAL
  frequency TEXT NOT NULL DEFAULT 'ONE_TIME', -- ONE_TIME, DAILY, WEEKLY, UNLIMITED
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_active ON tasks(is_active);

-- ===========================================
-- TASK COMPLETIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
  completion_count INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_task_completions_user_task ON task_completions(user_id, task_id);
CREATE INDEX idx_task_completions_user ON task_completions(user_id);

-- ===========================================
-- STREAKS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL, -- DAILY_LOGIN, TASK_COMPLETION
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 day',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_streaks_user_type ON streaks(user_id, streak_type);
CREATE INDEX idx_streaks_user ON streaks(user_id);

-- ===========================================
-- ARTICLES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  read_time_minutes INTEGER DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(is_published);

-- ===========================================
-- CONTESTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  entry_deadline TIMESTAMPTZ,
  prize_pool_coins INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'UPCOMING', -- UPCOMING, ACTIVE, COMPLETED, CANCELLED
  category TEXT NOT NULL, -- COVER, ORIGINAL, REMIX
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contests_status ON contests(status);
CREATE INDEX idx_contests_category ON contests(category);

-- ===========================================
-- STORES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_stores_slug ON stores(slug);

-- ===========================================
-- PRODUCTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_coins INTEGER NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_available ON products(is_available);

-- ===========================================
-- WITHDRAWAL REQUESTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(18,2) NOT NULL,
  coin_amount BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, PROCESSED
  account_details JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_withdrawal_requests_user ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

-- ===========================================
-- COIN TRANSACTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- EARN, SPEND, TOPUP, WITHDRAWAL, REFERRAL, TASK, STREAM
  amount BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coin_transactions_wallet ON coin_transactions(wallet_id);
CREATE INDEX idx_coin_transactions_type ON coin_transactions(type);
CREATE INDEX idx_coin_transactions_created ON coin_transactions(created_at);

-- ===========================================
-- NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- SYSTEM, REWARD, REFERRAL, CONTEST, PROMOTION
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ===========================================
-- ANALYTICS EVENTS TABLE (Optional)
-- ===========================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- Task completions policies
CREATE POLICY "Users can view own task completions"
  ON task_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own task completions"
  ON task_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task completions"
  ON task_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Articles - public read, auth required for write
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Contests - public read
CREATE POLICY "Anyone can view contests"
  ON contests FOR SELECT
  USING (true);

-- Stores - public read
CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  USING (is_active = true);

-- Products - public read
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (is_available = true);

-- Withdrawal requests policies
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own withdrawal requests"
  ON withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Coin transactions policies
CREATE POLICY "Users can view own transactions"
  ON coin_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wallets WHERE wallets.id = coin_transactions.wallet_id AND wallets.user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can create analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_completions_updated_at BEFORE UPDATE ON task_completions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contests_updated_at BEFORE UPDATE ON contests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON TABLE users IS 'User profiles synced with Supabase Auth';
COMMENT ON TABLE wallets IS 'User wallet balances and lifetime stats';
COMMENT ON TABLE referrals IS 'Referral relationships between users';
COMMENT ON TABLE tasks IS 'Earnable tasks for users';
COMMENT ON TABLE task_completions IS 'Track user task completion history';
COMMENT ON TABLE streaks IS 'User activity streaks';
COMMENT ON TABLE articles IS 'Blog posts and news articles';
COMMENT ON TABLE contests IS 'Music contests and challenges';
COMMENT ON TABLE stores IS 'Virtual stores in the marketplace';
COMMENT ON TABLE products IS 'Products available for purchase with coins';
COMMENT ON TABLE withdrawal_requests IS 'User withdrawal requests to bank accounts';
COMMENT ON TABLE coin_transactions IS 'Audit log of all coin movements';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE analytics_events IS 'User behavior tracking events';