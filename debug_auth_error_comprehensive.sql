-- COMPREHENSIVE AUTH CREATION DEBUGGING
-- Run this on Supabase to identify exact cause of "Database error creating new user"

-- ==================== STEP 1: CHECK AUTH USERS SCHEMA ====================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- ==================== STEP 2: CHECK FOR UNIQUE CONSTRAINTS ====================
SELECT 
  conname,
  connamespace::regnamespace AS schema_name,
  conrelid::regclass AS table_name,
  oid::regclass AS index_name
FROM pg_constraint
WHERE conrelid IN (
  SELECT oid FROM pg_class WHERE relname = 'users' AND relnamespace IN (
    SELECT oid FROM pg_namespace WHERE nspname = 'auth'
  )
)
AND contype IN ('u', 'p');

-- ==================== STEP 3: CHECK RLS ON auth.USERS ====================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- ==================== STEP 4: CHECK TRIGGERS ON auth.USERS ====================
SELECT 
  trigger_schema,
  trigger_name,
  timing,
  events,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users'
  AND trigger_schema = 'auth';

-- ==================== STEP 5: CHECK LOCAL TRIGGERS (public schema) ====================
SELECT 
  tgname,
  event_object_table,
  action_statement
FROM pg_trigger
WHERE tgname NOT IN ('pgfkeyid', 'pgfkeyid2')
  AND (evclassid::regclass).schemaname = 'public';

-- ==================== STEP 6: CHECK PROFILES TABLE (LEGACY ISSUE) ====================
SELECT 
  table_schema,
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles';

-- ==================== STEP 7: CHECK USERS TABLE STRUCTURE ====================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- ==================== STEP 8: CHECK WALLET TABLE REFERENCES ====================
SELECT 
  table_schema,
  table_name,
  column_name,
  referenced_table_schema,
  referenced_table_name,
  referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'public'
  AND (table_name = 'wallets' OR table_name = 'coin_transactions')
ORDER BY table_name, column_name;

-- ==================== STEP 9: TEST AUTH USER CREATION ====================
-- This will reproduce the error to see exact details
DO $$
BEGIN
  -- First, check if the test user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'test-debug@example.com') THEN
    RAISE NOTICE 'Test user already exists';
  ELSE
    -- Try to create a simple user
    RAISE NOTICE 'Attempting to create a test user to reproduce error...';
    BEGIN
      INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at)
      VALUES (
        gen_random_uuid(),
        'test-debug@example.com',
        crypt('TestPassword123!', gen_salt('bf')),
        NOW(),
        NOW()
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ AUTH CREATION ERROR: %', SQLERRM;
      RAISE NOTICE 'Error code: %, State: %, Message: %', 
        COALESCE(SQLCODE, 'UNKNOWN'), 
        COALESCE(SQLSTATE, 'UNKNOWN'), 
        SQLERRM;
    END;
  END IF;
END;
$$;

SELECT 'Debug completed' as status;