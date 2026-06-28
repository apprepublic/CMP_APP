-- Verification script for checking migration 0019 and 0021

-- This script checks if the problematic trigger setup is correct

-- 1. Check which tables exist
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'users')
ORDER BY table_name;

-- 2. Check if both handle_new_user triggers exist
SELECT trigger_schema, trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN ('handle_new_user', 'on_auth_user_created')
ORDER BY trigger_name;

-- 3. Check wallet creation triggers
SELECT trigger_schema, trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%wallet%'
ORDER BY trigger_name;

-- 4. Check pending_registrations table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'pending_registrations'
ORDER BY ordinal_position;

-- 5. Check if auth.users schema has raw_user_meta_data
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
  AND column_name LIKE '%meta%' OR column_name LIKE '%data%'
ORDER BY column_name;