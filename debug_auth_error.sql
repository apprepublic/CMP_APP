-- Debugging script for Auth Admin API error
-- Run this on Supabase to identify root cause

-- 1. Check if profiles table exists (from broken migration)
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'profiles';

-- 2. Check users table (correct table from migration 0001)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Check auth.users schema (where Auth Admin API creates users)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Check for problematic profiles-related triggers
SELECT trigger_schema, trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (trigger_name LIKE '%profile%' OR trigger_name LIKE '%user%' OR trigger_name LIKE '%wallet%')
ORDER BY trigger_name;

-- 5. Check if Auth Admin API has proper permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY grantee;

-- 6. Test creating a user (to reproduce error)
-- This simulates what verify-registration does
DO $$
BEGIN
  -- Try to create a test user via admin API
  -- This will fail and show the exact error
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
    RAISE NOTICE 'Database error creating test user: %', SQLERRM;
  END;
END;
$$;

SELECT 'If no test user was created successfully, we reproduced the issue' as debug_hint;