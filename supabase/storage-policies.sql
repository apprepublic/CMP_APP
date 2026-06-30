
-- Drop broken placeholder policy
DROP POLICY IF EXISTS "Auth upload 1q2q05_0" ON storage.objects;

-- Drop existing task-attachments policies (will recreate with bucket-scoped names)
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth update own" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete own" ON storage.objects;

-- ============================================================
-- music bucket
-- ============================================================
CREATE POLICY "music_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'music');
CREATE POLICY "music_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'music' AND auth.uid() = owner);
CREATE POLICY "music_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'music' AND auth.uid() = owner) WITH CHECK (bucket_id = 'music' AND auth.uid() = owner);
CREATE POLICY "music_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'music' AND auth.uid() = owner);

-- ============================================================
-- task-attachments bucket
-- ============================================================
CREATE POLICY "task_attach_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'task-attachments');
CREATE POLICY "task_attach_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'task-attachments' AND auth.uid() = owner);
CREATE POLICY "task_attach_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'task-attachments' AND auth.uid() = owner) WITH CHECK (bucket_id = 'task-attachments' AND auth.uid() = owner);
CREATE POLICY "task_attach_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'task-attachments' AND auth.uid() = owner);

-- ============================================================
-- profile-photos bucket
-- ============================================================
CREATE POLICY "profile_photos_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'profile-photos');
CREATE POLICY "profile_photos_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-photos' AND auth.uid() = owner);
CREATE POLICY "profile_photos_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile-photos' AND auth.uid() = owner) WITH CHECK (bucket_id = 'profile-photos' AND auth.uid() = owner);
CREATE POLICY "profile_photos_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'profile-photos' AND auth.uid() = owner);

-- ============================================================
-- cover-photos bucket
-- ============================================================
CREATE POLICY "cover_photos_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cover-photos');
CREATE POLICY "cover_photos_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cover-photos' AND auth.uid() = owner);
CREATE POLICY "cover_photos_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cover-photos' AND auth.uid() = owner) WITH CHECK (bucket_id = 'cover-photos' AND auth.uid() = owner);
CREATE POLICY "cover_photos_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cover-photos' AND auth.uid() = owner);
