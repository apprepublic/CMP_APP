-- ============================================
-- CMPapp Supabase Storage Setup Script
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- This creates buckets and configures RLS policies
-- Works with standard user permissions
-- ============================================

-- Step 1: Create Storage Buckets
-- ============================================
-- Note: If you get "already exists" errors, that's fine - buckets already exist!

-- Create music bucket for audio files and cover art
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'music') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'music',
      'music',
      true,
      52428800, -- 50MB in bytes
      ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- Create task-attachments bucket for general task files
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'task-attachments') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'task-attachments',
      'task-attachments',
      false,
      104857600, -- 100MB in bytes
      ARRAY['image/*', 'application/pdf', 'text/*', 'application/json']
    );
  END IF;
END $$;

-- Create profile-photos bucket for user avatars
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profile-photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'profile-photos',
      'profile-photos',
      true,
      10485760, -- 10MB in bytes
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- Create cover-photos bucket for user/artist covers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'cover-photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'cover-photos',
      'cover-photos',
      true,
      10485760, -- 10MB in bytes
      ARRAY['image/jpeg', 'image/png', 'image/webp']
    );
  END IF;
END $$;

-- Step 2: Configure RLS Policies for Music Bucket
-- ============================================

-- Policy 1: Allow public read access to music bucket
-- This allows anyone to stream music and view cover art
DROP POLICY IF EXISTS "Allow public read access to music" ON storage.objects;
CREATE POLICY "Allow public read access to music"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'music'
);

-- Policy 2: Allow authenticated users to upload to music bucket
-- This allows logged-in users to upload audio files and cover art
DROP POLICY IF EXISTS "Allow authenticated uploads to music" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to music"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'music' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Allow users to delete their own files in music bucket
-- Users can only delete files they uploaded
DROP POLICY IF EXISTS "Allow owners to delete music files" ON storage.objects;
CREATE POLICY "Allow owners to delete music files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'music' AND
  auth.uid() = owner
);

-- Policy 4: Allow users to update their own files (for metadata changes)
DROP POLICY IF EXISTS "Allow owners to update music files" ON storage.objects;
CREATE POLICY "Allow owners to update music files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'music' AND
  auth.uid() = owner
);

-- Step 3: Configure RLS Policies for Task-Attachments Bucket
-- ============================================

-- Policy 1: Allow authenticated users to upload task attachments
DROP POLICY IF EXISTS "Allow authenticated uploads to task-attachments" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to task-attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'task-attachments' AND
  auth.role() = 'authenticated'
);

-- Policy 2: Allow authenticated users to read task attachments
DROP POLICY IF EXISTS "Allow authenticated read task-attachments" ON storage.objects;
CREATE POLICY "Allow authenticated read task-attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'task-attachments' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Allow owners to delete their own task attachments
DROP POLICY IF EXISTS "Allow owners to delete task-attachments" ON storage.objects;
CREATE POLICY "Allow owners to delete task-attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'task-attachments' AND
  auth.uid() = owner
);

-- Step 4: Configure RLS Policies for Profile-Photos Bucket
-- ============================================

-- Policy 1: Allow public read access to profile photos
DROP POLICY IF EXISTS "Allow public read profile-photos" ON storage.objects;
CREATE POLICY "Allow public read profile-photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'profile-photos'
);

-- Policy 2: Allow authenticated users to upload their own profile photo
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-photos" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to profile-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Allow users to update their own profile photo
DROP POLICY IF EXISTS "Allow owners to update profile-photos" ON storage.objects;
CREATE POLICY "Allow owners to update profile-photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-photos' AND
  auth.uid() = owner
);

-- Policy 4: Allow users to delete their own profile photo
DROP POLICY IF EXISTS "Allow owners to delete profile-photos" ON storage.objects;
CREATE POLICY "Allow owners to delete profile-photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-photos' AND
  auth.uid() = owner
);

-- Step 5: Configure RLS Policies for Cover-Photos Bucket
-- ============================================

-- Policy 1: Allow public read access to cover photos
DROP POLICY IF EXISTS "Allow public read cover-photos" ON storage.objects;
CREATE POLICY "Allow public read cover-photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cover-photos'
);

-- Policy 2: Allow authenticated users to upload cover photos
DROP POLICY IF EXISTS "Allow authenticated uploads to cover-photos" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to cover-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cover-photos' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Allow users to update their own cover photos
DROP POLICY IF EXISTS "Allow owners to update cover-photos" ON storage.objects;
CREATE POLICY "Allow owners to update cover-photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cover-photos' AND
  auth.uid() = owner
);

-- Policy 4: Allow users to delete their own cover photos
DROP POLICY IF EXISTS "Allow owners to delete cover-photos" ON storage.objects;
CREATE POLICY "Allow owners to delete cover-photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cover-photos' AND
  auth.uid() = owner
);

-- ============================================
-- Setup Complete!
-- ============================================
-- Your storage buckets are now ready to use.
-- Test the setup by uploading a file through the app.
-- ============================================

-- Verification: List all buckets
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
ORDER BY name;

-- Verification: List all policies
SELECT 
  policyname,
  tablename,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY policyname;