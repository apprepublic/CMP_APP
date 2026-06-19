# Manual Supabase Storage Setup - No SQL Required

## Step-by-Step Guide (5 minutes)

### Part 1: Create Buckets (2 minutes)

1. **Go to Storage Dashboard**
   - https://app.supabase.com
   - Select your project
   - Click **Storage** in left sidebar

2. **Create Music Bucket**
   - Click **"New bucket"**
   - Name: `music`
   - Toggle **"Public bucket"** to ON (green)
   - Click **"Create bucket"**

3. **Create Task Attachments Bucket**
   - Click **"New bucket"**
   - Name: `task-attachments`
   - Leave **"Public bucket"** OFF (private)
   - Click **"Create bucket"**

4. **Create Profile Photos Bucket**
   - Click **"New bucket"**
   - Name: `profile-photos`
   - Toggle **"Public bucket"** to ON
   - Click **"Create bucket"**

5. **Create Cover Photos Bucket**
   - Click **"New bucket"**
   - Name: `cover-photos`
   - Toggle **"Public bucket"** to ON
   - Click **"Create bucket"**

✅ You should now have 4 buckets!

---

### Part 2: Configure RLS Policies (3 minutes)

1. **Go to Authentication Dashboard**
   - Click **Authentication** in left sidebar
   - Click **Policies** tab at top

2. **Add Policy for Music - Public Read**
   - Find `storage.objects` table
   - Click **"New policy"**
   - Select **"CREATE A POLICY FROM SCRATCH"**
   - Policy name: `Allow public read access to music`
   - Policy type: `SELECT`
   - Target roles: `public` (or leave as default)
   - Policy definition (SQL):
     ```sql
     bucket_id = 'music'
     ```
   - Click **"Review"** then **"Save policy"**

3. **Add Policy for Music - Authenticated Upload**
   - Click **"New policy"** again
   - Policy name: `Allow authenticated uploads to music`
   - Policy type: `INSERT`
   - Target roles: `authenticated`
   - Policy definition (SQL):
     ```sql
     bucket_id = 'music' AND auth.role() = 'authenticated'
     ```
   - Click **"Review"** then **"Save policy"**

4. **Add Policy for Music - Owner Delete**
   - Click **"New policy"** again
   - Policy name: `Allow owners to delete music files`
   - Policy type: `DELETE`
   - Target roles: `authenticated`
   - Policy definition (SQL):
     ```sql
     bucket_id = 'music' AND auth.uid() = owner
     ```
   - Click **"Review"** then **"Save policy"**

5. **Repeat for Other Buckets**

   For **`task-attachments`**:
   - INSERT policy: `bucket_id = 'task-attachments' AND auth.role() = 'authenticated'`
   - SELECT policy: `bucket_id = 'task-attachments' AND auth.role() = 'authenticated'`
   - DELETE policy: `bucket_id = 'task-attachments' AND auth.uid() = owner`

   For **`profile-photos`**:
   - SELECT policy: `bucket_id = 'profile-photos'`
   - INSERT policy: `bucket_id = 'profile-photos' AND auth.role() = 'authenticated'`
   - UPDATE policy: `bucket_id = 'profile-photos' AND auth.uid() = owner`
   - DELETE policy: `bucket_id = 'profile-photos' AND auth.uid() = owner`

   For **`cover-photos`**:
   - SELECT policy: `bucket_id = 'cover-photos'`
   - INSERT policy: `bucket_id = 'cover-photos' AND auth.role() = 'authenticated'`
   - UPDATE policy: `bucket_id = 'cover-photos' AND auth.uid() = owner`
   - DELETE policy: `bucket_id = 'cover-photos' AND auth.uid() = owner`

---

### Part 3: Verify Setup (1 minute)

1. **Check Buckets**
   - Go back to **Storage**
   - You should see 4 buckets:
     - ✅ music (public icon)
     - ✅ task-attachments (private icon)
     - ✅ profile-photos (public icon)
     - ✅ cover-photos (public icon)

2. **Check Policies**
   - Go to **Authentication** → **Policies**
   - Select `storage.objects` table from dropdown
   - You should see 16 policies total

---

### Part 4: Test Upload (1 minute)

1. **Test in Supabase Dashboard**
   - Go to **Storage** → **music** bucket
   - Click **"Upload"**
   - Upload a small MP3 file
   - After upload, click the file
   - Click **"Copy URL"**
   - Paste URL in new browser tab
   - Should play the audio! ✅

2. **Test in Your App**
   - Navigate to `/tasks/post`
   - Select **"Stream Music"** task type
   - Upload an MP3 file
   - Should upload successfully! ✅

---

## Quick Reference

### Bucket Settings

| Bucket | Public | Max Size | Purpose |
|--------|--------|----------|---------|
| music | ✅ Yes | 50MB | Audio files & cover art |
| task-attachments | ❌ No | 100MB | Task files (future) |
| profile-photos | ✅ Yes | 10MB | User avatars |
| cover-photos | ✅ Yes | 10MB | Cover images |

### Policy SQL Snippets

**Public Read:**
```sql
bucket_id = 'bucket-name'
```

**Authenticated Upload:**
```sql
bucket_id = 'bucket-name' AND auth.role() = 'authenticated'
```

**Owner Delete:**
```sql
bucket_id = 'bucket-name' AND auth.uid() = owner
```

---

## Troubleshooting

### Can't Create Bucket
- Make sure you're project admin
- Check you haven't exceeded storage quota

### Policy Not Working
- Double-check bucket name matches exactly (case-sensitive!)
- Ensure policy type matches (SELECT for read, INSERT for upload, etc.)
- Check you're logged in when testing upload

### Upload Fails
- Verify bucket is not full
- Check file size is within limit
- Ensure file type is allowed
- Check browser console for specific error

### File Not Accessible
- Make sure bucket is set to **Public**
- Verify public read policy exists
- Check file URL is correct

---

## Next Steps

✅ Setup complete! Now you can:
1. Test the full music upload flow in your app
2. Post a music streaming task
3. Verify songs appear in Music section
4. Test streaming and coin rewards

See `docs/VERIFICATION-CHECKLIST.md` for complete testing steps.

---

**Time Required**: 5 minutes  
**Difficulty**: Easy  
**No SQL Required**: ✅