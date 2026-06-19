# Music Streaming Task File Upload - Verification Checklist

## ✅ Implementation Complete

### Frontend Changes
- [x] Created `apps/web/lib/storage.ts` with upload utilities
- [x] Updated task posting form (`apps/web/app/(app)/tasks/post/page.tsx`)
  - [x] Added file upload state management
  - [x] Implemented drag-and-drop UI for audio files
  - [x] Implemented drag-and-drop UI for cover images
  - [x] Added file validation (type and size)
  - [x] Added upload progress indicators
  - [x] Updated submission logic to upload files first
  - [x] Enhanced preview modal
  - [x] Added cleanup for object URLs
- [x] Updated `usePostTask` hook type definition
- [x] TypeScript compilation passes ✓

### Backend (Already Configured)
- [x] Database schema has required fields
  - [x] `UserPostedTask.audioUrl`
  - [x] `UserPostedTask.coverImageUrl`
  - [x] `UserPostedTask.genre`
  - [x] `UserPostedTask.durationSeconds`
  - [x] `UserPostedTask.isDownloadEnabled`
  - [x] `UserPostedTask.songId` (unique link to Song)
- [x] API creates Song record when STREAM_MUSIC task is posted
- [x] Music streaming endpoints exist
  - [x] `POST /music/songs/:id/stream` - Records streams, credits artist
  - [x] `POST /music/songs/:id/download` - Records downloads, credits artist

### Documentation
- [x] Created `docs/music-upload-setup.md` - Setup guide
- [x] Created `docs/music-upload-implementation.md` - Implementation details
- [x] Created `apps/web/lib/__tests__/storage-test.ts` - Test utilities

## 🔧 Required Setup Steps

### 1. Supabase Storage Configuration

Create these buckets in Supabase Dashboard > Storage:

```
1. music
2. task-attachments
3. profile-photos
4. cover-photos
```

### 2. Configure RLS Policies

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable public read access for music bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'music');

-- Enable authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'music' AND
  auth.role() = 'authenticated'
);

-- Enable owner delete
CREATE POLICY "Allow owners to delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'music' AND
  auth.uid() = owner
);
```

### 3. Set File Size Limits

In Supabase Dashboard > Storage > Settings:
- Set max file size: 50MB (for audio)
- Set allowed MIME types: `audio/mpeg`, `audio/mp3`, `image/*`

### 4. Verify Environment Variables

Ensure these are set in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 Testing Steps

### Step 1: Verify Storage Setup
```bash
# In browser console on your app
import { testStorageSetup } from '@/lib/__tests__/storage-test';
await testStorageSetup();
```

Expected output:
```
🧪 Testing Supabase Storage Setup...
1️⃣ Testing music bucket access...
✅ Music bucket exists: music
2️⃣ Testing file upload...
✅ Upload successful: test/test-upload.mp3
3️⃣ Testing public URL access...
📎 Public URL: ...
✅ Public URL is accessible
4️⃣ Cleaning up test file...
✅ Test file deleted successfully
✅ All tests passed! Storage is properly configured.
```

### Step 2: Post a Music Task

1. Navigate to `/tasks/post`
2. Select "Stream Music" task type
3. Fill in form:
   - Title: "Test Track"
   - Description: "Testing music upload"
   - Upload MP3 file (drag & drop)
   - Upload cover art (optional)
   - Select genre: "Afrobeats"
   - Set duration: 180 seconds
   - Set participants: 100
   - Set budget: 5000 coins
4. Click "Preview & Post"
5. Review and confirm

### Step 3: Verify Upload

**Check Supabase Storage:**
- Go to Supabase Dashboard > Storage > music bucket
- Verify file exists: `music/audio/[timestamp]-[random].mp3`
- Verify cover exists: `music/covers/[timestamp]-[random].jpg`
- Click file → Copy public URL

**Check Database:**
- Go to Supabase Dashboard > Table Editor
- Check `Song` table:
  - New record exists
  - `audioUrl` matches uploaded file URL
  - `coverUrl` matches uploaded image URL
  - `isPublished` = true
- Check `UserPostedTask` table:
  - New record exists
  - `songId` is set (links to Song)
  - `audioUrl` matches

### Step 4: Test Music Streaming

1. Navigate to `/music`
2. Find your uploaded track
3. Click play
4. Let it play for > 30 seconds
5. Check:
   - `SongStream` table has new record
   - Artist wallet increased by 1 coin
   - `Song.playCount` incremented

### Step 5: Test Download (if enabled)

1. Click download button on track
2. Verify download starts
3. Check:
   - `Song.downloadCount` incremented
   - Artist wallet increased by 3 coins

## 📊 Success Criteria

All of these must be true:
- ✅ Files upload to Supabase Storage successfully
- ✅ Upload progress is shown to user
- ✅ Task creation succeeds with uploaded files
- ✅ Song record created in database
- ✅ Song appears in Music section
- ✅ Streaming works and credits artist
- ✅ Download works and credits artist
- ✅ TypeScript compilation passes
- ✅ No console errors

## 🐛 Known Issues

None at this time.

## 📝 Next Steps

1. **Deploy to Production**
   - Ensure Supabase storage is configured in production
   - Update environment variables
   - Test end-to-end flow in production

2. **Monitor Performance**
   - Track upload success rates
   - Monitor storage usage
   - Watch for large file uploads

3. **Gather User Feedback**
   - Is upload speed acceptable?
   - Is UI intuitive?
   - Any missing features?

4. **Plan Phase 2**
   - Album uploads
   - Playlist creation
   - Artist analytics

## 🔍 Debugging Tips

### Upload Fails
```javascript
// Check browser console for errors
// Common issues:
// - Bucket doesn't exist
// - RLS policy blocks upload
// - File too large
// - Wrong MIME type
```

### Song Not Appearing
```sql
-- Check if song was created
SELECT * FROM "Song" WHERE title = 'Your Track Title';

-- Verify isPublished is true
SELECT "isPublished" FROM "Song" WHERE id = 'song-id';

-- Check if task was created
SELECT * FROM "UserPostedTask" WHERE "songId" = 'song-id';
```

### Streaming Not Working
```javascript
// Check audio URL is accessible
fetch(song.audioUrl).then(r => console.log(r.ok));

// Check player component
// apps/web/components/music/PlayerProvider.tsx:78
// audio.src = song.audio_url;
```

## 📞 Support

If you encounter issues:
1. Run storage test script
2. Check Supabase logs
3. Review RLS policies
4. Verify environment variables
5. Check browser console for errors

---

**Status**: ✅ READY FOR TESTING  
**Last Updated**: 2026-06-19  
**Version**: 1.0.0