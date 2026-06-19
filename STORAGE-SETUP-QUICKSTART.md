# 🎵 Music Upload Setup - Quick Start Guide

## TL;DR - Do This Now

### Option A: Using Supabase Dashboard (Easiest - 2 minutes)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your CMPapp project

2. **Run SQL Script**
   - Click **SQL Editor** in left sidebar
   - Click **"New Query"**
   - Copy entire file: `services/api/prisma/migrations/setup-storage.sql`
   - Paste into editor
   - Click **"Run"** (Ctrl+Enter or Cmd+Enter)

3. **Verify**
   - Click **Storage** in left sidebar
   - Confirm 4 buckets exist: `music`, `task-attachments`, `profile-photos`, `cover-photos`

4. **Test**
   - Go to your app: `/tasks/post`
   - Select "Stream Music"
   - Upload an MP3 file
   - It should work! ✅

### Option B: Using Supabase CLI (Automated - 5 minutes)

```bash
# Install CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Run setup script
./scripts/setup-supabase-storage.sh

# Enter your Project ID when prompted
# (Find it in Supabase Dashboard > Settings > API)
```

---

## What Gets Created

### 4 Storage Buckets:
1. **`music`** - Audio files & cover art (public, 50MB limit)
2. **`task-attachments`** - Task files (private, 100MB limit)
3. **`profile-photos`** - User avatars (public, 10MB limit)
4. **`cover-photos`** - Cover images (public, 10MB limit)

### 16 RLS Policies:
- Public read access for music streaming
- Authenticated user uploads
- Owner-only delete permissions
- Organized by bucket

### Helper Functions:
- `get_user_storage_prefix()` - Organize files by user
- `is_file_owner()` - Check file ownership

---

## Testing Checklist

After setup, verify everything works:

### ✅ 1. Check Buckets Exist
```
Supabase Dashboard → Storage
Should see: music, task-attachments, profile-photos, cover-photos
```

### ✅ 2. Test File Upload
```
App → /tasks/post → Stream Music
Upload MP3 file → Should succeed
```

### ✅ 3. Verify Storage
```
Supabase Dashboard → Storage → music bucket
Should see: audio/[file].mp3 and covers/[file].jpg
```

### ✅ 4. Check Database
```
Supabase Dashboard → Table Editor → Song
Should see: New song record with audioUrl
```

### ✅ 5. Test Streaming
```
App → /music → Find your song → Play
Should stream from Supabase URL
```

### ✅ 6. Verify Rewards
```
After 30 seconds of streaming:
- SongStream record created
- Artist wallet +1 coin
- Song playCount +1
```

---

## File Locations

All setup files are in your repository:

```
CMP_APP/
├── services/api/prisma/migrations/
│   └── setup-storage.sql          # Main SQL script
├── scripts/
│   └── setup-supabase-storage.sh  # CLI automation script
├── docs/
│   ├── SUPABASE-STORAGE-SETUP.md  # Detailed setup guide
│   ├── music-upload-setup.md      # Technical documentation
│   ├── music-upload-implementation.md
│   └── VERIFICATION-CHECKLIST.md  # Complete testing guide
└── apps/web/
    ├── lib/
    │   ├── storage.ts             # Upload utilities
    │   └── __tests__/
    │       └── storage-test.ts    # Browser test script
    └── app/(app)/tasks/post/
        └── page.tsx               # Updated with file upload UI
```

---

## Common Issues & Solutions

### ❌ "Bucket already exists"
**Solution**: That's fine! The script uses `ON CONFLICT DO NOTHING`, so it's safe to run multiple times.

### ❌ "Permission denied"
**Solution**: Make sure you're logged in as project admin in Supabase.

### ❌ Upload fails in app
**Solutions**:
1. Check bucket is public (Storage → music → Settings → Public)
2. Verify RLS policies exist (Authentication → Policies → storage.objects)
3. Check browser console for specific errors
4. Ensure `.env.local` has correct Supabase credentials

### ❌ File not accessible after upload
**Solutions**:
1. Check bucket is set to **Public**
2. Verify "Allow public read access" policy exists
3. Test URL directly in browser

---

## Next Steps After Setup

1. **Test End-to-End Flow**
   - Post a music streaming task
   - Verify song appears in Music section
   - Test streaming and downloads
   - Check artist receives coins

2. **Monitor Storage**
   - Watch storage usage in Dashboard
   - Set up alerts for quota limits
   - Review upload logs

3. **Configure Production**
   - Repeat setup in production project
   - Update environment variables
   - Test in production environment

4. **Gather Feedback**
   - Is upload speed acceptable?
   - Is UI intuitive for users?
   - Any missing features?

---

## Support & Documentation

- **Quick Setup**: This file
- **Detailed Guide**: `docs/SUPABASE-STORAGE-SETUP.md`
- **Technical Docs**: `docs/music-upload-setup.md`
- **Testing Guide**: `docs/VERIFICATION-CHECKLIST.md`
- **Implementation**: `docs/music-upload-implementation.md`

---

## Ready to Go! 🚀

Your Supabase Storage is now configured for music uploads. Users can:
- ✅ Upload MP3 files directly
- ✅ Upload cover art
- ✅ Create music streaming tasks
- ✅ Songs appear in Music section
- ✅ Users earn coins by streaming
- ✅ Artists earn coins from streams

**Status**: ✅ Ready to test  
**Time to Setup**: 2-5 minutes  
**Difficulty**: Easy

Go ahead and run the SQL script now! 🎵