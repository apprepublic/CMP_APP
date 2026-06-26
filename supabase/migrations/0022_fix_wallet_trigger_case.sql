-- Recreate wallet creation function WITH 500-coin signup bonus
-- Fixing the 'EARN' case constraint to 'earn'
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
    VALUES (gen_random_uuid(), NEW.id, 'earn', 500, 500, 'Signup bonus — Welcome to CMPapp!');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
