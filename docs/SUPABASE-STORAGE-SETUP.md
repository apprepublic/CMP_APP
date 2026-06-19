# Supabase Storage Setup - Quick Start

## 🚀 Option 1: Automatic Setup (Recommended)

If you have the Supabase CLI installed:

```bash
# Run the setup script
./scripts/setup-supabase-storage.sh
```

The script will:
1. Check if Supabase CLI is installed
2. Authenticate with Supabase
3. Ask for your Project ID
4. Create all storage buckets
5. Configure RLS policies
6. Verify the setup

## 📝 Option 2: Manual Setup (No CLI Required)

### Step 1: Go to Supabase Dashboard
1. Navigate to https://app.supabase.com
2. Select your CMPapp project
3. Go to **SQL Editor** (left sidebar)

### Step 2: Run SQL Script
1. Click **"New Query"**
2. Copy the entire contents of `services/api/prisma/migrations/setup-storage.sql`
3. Paste into the SQL Editor
4. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)

### Step 3: Verify Setup
After running the SQL, you should see output showing:
- ✅ 4 buckets created (music, task-attachments, profile-photos, cover-photos)
- ✅ 16 RLS policies created
- ✅ Helper functions created

## 🔍 Verify Buckets Were Created

### In Supabase Dashboard:
1. Go to **Storage** (left sidebar)
2. You should see 4 buckets:
   - `music` (public, 50MB limit)
   - `task-attachments` (private, 100MB limit)
   - `profile-photos` (public, 10MB limit)
   - `cover-photos` (public, 10MB limit)

### Check RLS Policies:
1. Go to **Authentication** → **Policies**
2. Select `storage.objects` table
3. You should see policies for each bucket

## 🧪 Test the Setup

### Quick Test in Browser Console:
```javascript
// Open browser console on your app
import { testStorageSetup } from '@/lib/__tests__/storage-test';
await testStorageSetup();
```

Expected output:
```
✅ Music bucket exists: music
✅ Upload successful
✅ Public URL is accessible
✅ All tests passed!
```

### Test in App:
1. Navigate to `/tasks/post`
2. Select **"Stream Music"** task type
3. Upload an MP3 file (drag & drop or click)
4. Upload cover art (optional)
5. Fill in other details
6. Click **"Preview & Post"**
7. Submit the task

### Verify Upload:
1. Go to Supabase Dashboard → **Storage** → **music** bucket
2. You should see:
   - `audio/[timestamp]-[random].mp3`
   - `covers/[timestamp]-[random].jpg` (if uploaded)
3. Click the file → **Copy URL**
4. Paste URL in browser - should play/download the file

## 📋 Bucket Configuration Details

### Music Bucket
- **Public**: Yes (for streaming)
- **Max Size**: 50MB
- **Allowed Types**: MP3, WAV, OGG, JPEG, PNG, WebP, GIF
- **Path Structure**: 
  - Audio: `music/audio/[timestamp]-[random].mp3`
  - Covers: `music/covers/[timestamp]-[random].jpg`

### Task-Attachments Bucket
- **Public**: No (private)
- **Max Size**: 100MB
- **Allowed Types**: Images, PDFs, Text files, JSON
- **Use Case**: Future task file attachments

### Profile-Photos Bucket
- **Public**: Yes
- **Max Size**: 10MB
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Use Case**: User avatars

### Cover-Photos Bucket
- **Public**: Yes
- **Max Size**: 10MB
- **Allowed Types**: JPEG, PNG, WebP
- **Use Case**: User/artist cover images

## 🔒 RLS Policies Explained

### Music Bucket Policies:
1. **Public Read**: Anyone can stream music and view cover art
2. **Authenticated Upload**: Only logged-in users can upload
3. **Owner Delete**: Users can only delete their own files
4. **Owner Update**: Users can update their own files

### Security Benefits:
- ✅ Prevents anonymous uploads
- ✅ Users can't delete others' files
- ✅ Public access for streaming (no auth required to listen)
- ✅ Organized file structure by user

## 🐛 Troubleshooting

### Buckets Not Created
**Error**: "bucket already exists"
- **Solution**: Buckets already exist, that's fine! Continue.

**Error**: "permission denied"
- **Solution**: Make sure you're using the correct project ID and have admin access

### RLS Policies Not Working
**Error**: "new row violates row-level security policy"
- **Solution**: Check that you're logged in when uploading
- **Solution**: Verify policies were created (see verification queries in SQL file)

### Upload Fails in App
**Error**: "Upload failed"
- Check browser console for specific error
- Verify buckets exist in Supabase Dashboard
- Check RLS policies are enabled
- Ensure environment variables are set:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

### Files Not Accessible
**Error**: 403 Forbidden when accessing file URL
- **Solution**: Check bucket is set to **Public** in Storage dashboard
- **Solution**: Verify "Allow public read access" policy exists

## 📞 Need Help?

1. **Check SQL Output**: Review the SQL execution output for errors
2. **Verify Buckets**: Check Storage dashboard shows all 4 buckets
3. **Test Upload**: Try uploading directly in Supabase Dashboard
4. **Check Logs**: Go to Logs in Supabase Dashboard for storage events
5. **Review Policies**: Ensure RLS policies match the SQL script

## ✅ Success Checklist

- [ ] All 4 buckets created
- [ ] RLS policies configured (16 total)
- [ ] Buckets have correct size limits
- [ ] Buckets have correct MIME types
- [ ] Music bucket is public
- [ ] Can upload file in Supabase Dashboard
- [ ] Can access uploaded file via public URL
- [ ] Can upload file through app
- [ ] Song appears in Music section after task creation

---

**Status**: Ready for setup  
**Last Updated**: 2026-06-19  
**Version**: 1.0.0