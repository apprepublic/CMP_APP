-- Drop broken auth triggers that referenced non-existent snake_case tables
-- The verify-registration edge function now handles User + Wallet creation after password submission

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_create_wallet_on_user ON public.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_wallet_for_user() CASCADE;
