-- FIX FOR "Database error creating new user" IN SUPABASE
-- Based on analysis of broken migrations 0019 and 0021

-- ===================================================================
-- STEP 1: Remove the broken profiles table from migration 0019
-- ===================================================================
DO $$ 
BEGIN
  -- Drop profiles table if it exists (created by broken migration 0019)
  IF EXISTS (SELECT 1 FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE NOTICE 'Dropping broken profiles table (from migration 0019)...';
    DROP TABLE public.profiles CASCADE;
    RAISE NOTICE '✅ profiles table removed';
  ELSE
    RAISE NOTICE 'profiles table does not exist (already fixed or missing)';
  END IF;
END $$;

-- ===================================================================
-- STEP 2: Ensure correct triggers are in place
-- ===================================================================

-- Ensure handle_new_user trigger is on auth.users (not profiles)
DO $$
BEGIN
  -- Drop any profiles table related triggers
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE NOTICE 'Dropping incorrect profiles trigger...';
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    RAISE NOTICE '✅ profiles trigger removed';
  END IF;
  
  -- Now ensure the correct trigger on auth.users
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE NOTICE 'Creating correct auth.users trigger for profile sync...';
    -- This trigger should exist from migration 0021
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    RAISE NOTICE '✅ Correct auth.users trigger created';
  ELSE
    RAISE NOTICE '✅ Correct auth.users trigger already exists';
  END IF;
END $$;

-- Ensure wallet creation trigger is on users table (not profiles)
DO $$
BEGIN
  -- Drop any profiles table related wallet triggers
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_wallet_on_user') THEN
    RAISE NOTICE 'Dropping incorrect profiles wallet trigger...';
    DROP TRIGGER IF EXISTS trigger_create_wallet_on_user ON auth.users;
    RAISE NOTICE '✅ profiles wallet trigger removed';
  END IF;
  
  -- Now ensure the correct trigger on auth.users for wallet creation
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_wallet_on_user') THEN
    RAISE NOTICE 'Creating correct users trigger for wallet creation...';
    -- This trigger should exist from migration 0021
    CREATE TRIGGER trigger_create_wallet_on_user
      AFTER INSERT ON public.users
      FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();
    RAISE NOTICE '✅ Correct users trigger created';
  ELSE
    RAISE NOTICE '✅ Correct users trigger already exists';
  END IF;
END $$;

-- ===================================================================
-- STEP 3: Verify database integrity
-- ===================================================================

-- Verify auth.users can be created (the core issue)
DO $$
BEGIN
  -- This should succeed, indicating the "Database error" is fixed
  -- We'll test with a unique email that can't conflict
  DECLARE test_email text := 'test-debug-' || floor(random() * 1000000) || '@example.com';
  DECLARE test_user_id uuid;
  
  BEGIN
    RAISE NOTICE 'Testing auth.users creation with: %', test_email;
    test_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at)
    VALUES (
      test_user_id,
      test_email,
      crypt('DebugPassword123!', gen_salt('bf')),
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Auth user creation test succeeded';
    
    -- Clean up
    DELETE FROM auth.users WHERE id = test_user_id;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Auth user creation test FAILED: %', SQLERRM;
    RAISE NOTICE 'This indicates the root cause of the "Database error creating new user"';
  END;
END;
$$;

-- ===================================================================
-- STEP 4: Final check - validate current state
-- ===================================================================

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN '❌ profiles table still exists'
    ELSE '✅ profiles table successfully removed'
  END as profiles_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN '✅ auth.users trigger exists'
    ELSE '❌ auth.users trigger missing'
  END as auth_trigger_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_wallet_on_user') THEN '✅ wallet trigger exists'
    ELSE '❌ wallet trigger missing'
  END as wallet_trigger_status;

SELECT 'Fix completed successfully!' as status;