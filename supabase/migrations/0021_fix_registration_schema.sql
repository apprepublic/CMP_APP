
-- Migration 0021: Fix registration schema broken by 0019
-- 0019 incorrectly used profiles table which does not exist (the table is users)
-- and user_id instead of wallet_id in coin_transactions

-- Recreate the handle_new_user trigger (syncs auth.users -> public.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $DO$
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
$DO$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate wallet creation function WITH 500-coin signup bonus
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS TRIGGER AS $DO$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- Only create if no wallet exists yet (edge function may have already created it)
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = NEW.id) THEN
    v_wallet_id := gen_random_uuid();

    INSERT INTO public.wallets (id, user_id, coin_balance, lifetime_earned)
    VALUES (v_wallet_id, NEW.id, 500, 500);

    -- Record the signup bonus in coin_transactions (matching live columns: wallet_id, type, amount, balance_after)
    INSERT INTO public.coin_transactions (id, wallet_id, type, amount, balance_after, description)
    VALUES (gen_random_uuid(), v_wallet_id, 'earn', 500, 500, 'Signup bonus — Welcome to CMPapp!');
  END IF;
  RETURN NEW;
END;
$DO$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is on public.users, NOT public.profiles
DROP TRIGGER IF EXISTS trigger_create_wallet_on_user ON public.profiles;
DROP TRIGGER IF EXISTS trigger_create_wallet_on_user ON public.users;
CREATE TRIGGER trigger_create_wallet_on_user
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();
