-- Migration 0019: Restore signup bonus trigger with idempotent handling

-- Ensure the profiles table exists (idempotent)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security if the table exists
DO $rls$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='profiles') THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $rls$;

-- Create policies only if they don't already exist (using pg_policy catalog)
DO $policy$
DECLARE
  tbl_oid oid;
BEGIN
  SELECT c.oid INTO tbl_oid FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname='public' AND c.relname='profiles';
  IF tbl_oid IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = tbl_oid AND polname = 'Public profiles are viewable by everyone.') THEN
      CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = tbl_oid AND polname = 'Users can insert their own profile.') THEN
      CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = tbl_oid AND polname = 'Users can update own profile.') THEN
      CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
  END IF;
END $policy$;

-- Function: handle_new_user (sync auth.users → public.profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users if not present
DO $trigger_user$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $trigger_user$;

-- Function: create_wallet_for_user (grant signup bonus)
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS trigger AS $$
DECLARE v_wallet_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = NEW.id) THEN
    v_wallet_id := gen_random_uuid();
    INSERT INTO public.wallets (id, user_id, balance, lifetime_earned)
    VALUES (v_wallet_id, NEW.id, 500, 500);
    INSERT INTO public.coin_transactions (id, user_id, type, amount, balance_after, description)
    VALUES (gen_random_uuid(), NEW.id, 'earn', 500, 500, 'Signup bonus — Welcome to CMPapp!');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach wallet trigger to public.profiles if not present
DO $trigger_wallet$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_wallet_on_user') THEN
      CREATE TRIGGER trigger_create_wallet_on_user
        AFTER INSERT ON public.profiles
        FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();
    END IF;
  END IF;
END $trigger_wallet$;
