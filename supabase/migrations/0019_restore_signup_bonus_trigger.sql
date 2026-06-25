-- Migration 0019: Restore signup bonus trigger as DB-level safety net
-- Context: Migration 0009 dropped the create_wallet_for_user trigger.
-- The verify-registration edge function now handles wallet creation directly,
-- but this trigger acts as a fallback for any auth path that bypasses the edge function.

-- Recreate the handle_new_user trigger (syncs auth.users -> public.profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate wallet creation function WITH 500-coin signup bonus
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS TRIGGER AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- Only create if no wallet exists yet (edge function may have already created it)
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = NEW.id) THEN
    v_wallet_id := gen_random_uuid();

    INSERT INTO public.wallets (id, user_id, balance, lifetime_earned)
    VALUES (v_wallet_id, NEW.id, 500, 500);

    -- Record the signup bonus in coin_transactions (matching live columns: user_id, type, amount, balance_after)
    INSERT INTO public.coin_transactions (id, user_id, type, amount, balance_after, description)
    VALUES (gen_random_uuid(), NEW.id, 'EARN', 500, 500, 'Signup bonus — Welcome to CMPapp!');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_create_wallet_on_user ON public.profiles;
CREATE TRIGGER trigger_create_wallet_on_user
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();

