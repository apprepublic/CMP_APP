-- Fix RLS policies and triggers for auth flow

-- Grant service_role access (needed for triggers and migrations)
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.wallets TO service_role;
GRANT ALL ON public.referrals TO service_role;
GRANT ALL ON public.task_completions TO service_role;
GRANT ALL ON public.streaks TO service_role;
GRANT ALL ON public.withdrawal_requests TO service_role;
GRANT ALL ON public.coin_transactions TO service_role;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.analytics_events TO service_role;

-- Grant anon access for public reads
GRANT SELECT ON public.tasks TO anon;
GRANT SELECT ON public.articles TO anon;
GRANT SELECT ON public.contests TO anon;
GRANT SELECT ON public.stores TO anon;
GRANT SELECT ON public.products TO anon;

-- Users: allow insert for authenticated users (signup creates own profile)
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Wallets: allow insert (trigger creates wallet after user insert)
CREATE POLICY "Users can insert own wallet"
  ON wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Streaks: allow insert for own streaks
CREATE POLICY "Users can insert own streaks"
  ON streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notifications: allow insert for own notifications
CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Tasks: public read for authenticated users
CREATE POLICY "Authenticated users can view active tasks"
  ON tasks FOR SELECT
  USING (is_active = true AND auth.role() = 'authenticated');

-- Enable the auth trigger: auto-create user profile + wallet on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone_number, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure wallet creation trigger is active
DROP TRIGGER IF EXISTS trigger_create_wallet_on_user ON public.users;
CREATE TRIGGER trigger_create_wallet_on_user
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();

-- Grant signup bonus on wallet creation
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, coin_balance, lifetime_earned)
  VALUES (NEW.id, 500, 500);
  -- Record signup bonus transaction
  INSERT INTO public.coin_transactions (wallet_id, type, amount, balance_after, description)
  SELECT w.id, 'EARN', 500, 500, 'Signup bonus'
  FROM public.wallets w WHERE w.user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
