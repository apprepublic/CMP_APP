-- Migration 0040: Fix create_wallet_for_user trigger
-- 1. Use coin_balance instead of balance
-- 2. Include wallet_id in coin_transactions insert
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS TRIGGER AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = NEW.id) THEN
    v_wallet_id := gen_random_uuid();
    INSERT INTO public.wallets (id, user_id, coin_balance, lifetime_earned)
    VALUES (v_wallet_id, NEW.id, 500, 500);
    INSERT INTO public.coin_transactions (id, wallet_id, user_id, type, amount, balance_after, description)
    VALUES (gen_random_uuid(), v_wallet_id, NEW.id, 'earn', 500, 500, 'Signup bonus -- Welcome to CMPapp!');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
