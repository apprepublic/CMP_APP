# Music Streaming Task File Upload - Setup Guide

## Overview
The music streaming task posting flow now supports direct file uploads to Supabase Storage instead of requiring URLs. When users post a STREAM_MUSIC task, they can upload MP3 audio files and cover art images directly through the UI.

## Supabase Storage Setup

### Required Buckets
You need to create the following buckets in your Supabase project:

1. **`music`** - Stores audio files and cover art
   - Audio files path: `music/audio/[timestamp]-[random].[ext]`
   - Cover art path: `music/covers/[timestamp]-[random].[ext]`

2. **`task-attachments`** - General task attachments (future use)
   - Path: `task-attachments/[category]/[filename]`

3. **`profile-photos`** - User profile pictures (future use)

4. **`cover-photos`** - User/artist cover photos (future use)

### Bucket Configuration

For the `music` bucket:

#### Public Access
```sql
-- Allow public read access to music files
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'music');
```

#### Upload Permissions (Authenticated Users)
```sql
-- Allow authenticated users to upload to music bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'music' AND
  auth.role() = 'authenticated'
);
```

#### Delete Permissions (Owners Only)
```sql
-- Allow users to delete their own files
CREATE POLICY "Allow owners to delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'music' AND
  auth.uid() = owner
);
```

### File Size Limits
Configure these limits in Supabase Dashboard > Storage > Settings:
- **Audio files**: Max 50MB
- **Images**: Max 10MB
- **Allowed MIME types for audio**: `audio/mpeg`, `audio/mp3`
- **Allowed MIME types for images**: `image/*`

## Flow Architecture

### 1. Frontend Upload Flow
```
User selects file → Validate file type/size → Upload to Supabase Storage 
→ Get public URL → Submit task with URL → Create Song record
```

### 2. Backend Processing
When a STREAM_MUSIC task is created:
1. Validate audio URL is present
2. Check user has artist profile
3. Create Song record in database with:
   - `audioUrl`: Public URL from Supabase Storage
   - `coverUrl`: Optional cover art URL
   - `genre`, `durationSeconds`, etc.
   - `coinReward`: From task configuration
   - `isPublished`: true (immediately available in Music section)
4. Link Song to UserPostedTask via `songId`

### 3. Music Streaming
Users can:
- Browse songs in Music section
- Stream audio directly from Supabase Storage URL
- Earn coins per stream (>30 seconds)
- Download if enabled by artist

## API Changes

### Updated Schema
The `createPostedTaskSchema` now accepts:
```typescript
{
  type: 'STREAM_MUSIC',
  musicMetadata: {
    audioUrl: string.url(),  // URL from Supabase Storage
    coverImageUrl?: string.url(),
    genre?: string,
    durationSeconds?: number,
    isDownloadEnabled?: boolean
  }
}
```

### Database Changes
The `UserPostedTask` model includes:
- `audioUrl`: String (nullable)
- `coverImageUrl`: String (nullable)
- `genre`: String (nullable)
- `durationSeconds`: Int (nullable)
- `isDownloadEnabled`: Boolean (default: false)
- `songId`: String (nullable, unique) - Links to Song model

## Testing the Flow

### End-to-End Test Steps

1. **Setup**
   - Ensure Supabase storage buckets are created
   - Configure RLS policies as above
   - Verify environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Post a Music Task**
   - Navigate to `/tasks/post`
   - Select "Stream Music" task type
   - Upload MP3 file (drag & drop or browse)
   - Upload cover art (optional)
   - Select genre
   - Set duration
   - Configure reward and participant settings
   - Preview and submit

3. **Verify Upload**
   - Check Supabase Storage bucket for uploaded files
   - Verify file paths: `music/audio/[file]` and `music/covers/[file]`
   - Confirm public URLs are accessible

4. **Verify Database**
   - Check `Song` table for new record
   - Verify `UserPostedTask` has correct `songId`
   - Confirm `audioUrl` matches Supabase public URL

5. **Test Streaming**
   - Navigate to `/music`
   - Find the uploaded song
   - Play the track
   - Verify stream is logged after 30 seconds
   - Check artist wallet for coin credit

6. **Test Download** (if enabled)
   - Click download button
   - Verify download count increments
   - Check artist receives 3 coins

## Troubleshooting

### Upload Fails
- Check bucket exists and is public
- Verify RLS policies allow inserts
- Check file size is within limits
- Ensure correct MIME type

### Song Not Appearing in Music Section
- Verify `isPublished` is true
- Check `Song` record exists
- Confirm `audioUrl` is valid public URL

### Streaming Not Earning Coins
- Ensure stream duration > 30 seconds
- Check `SongStream` record is created
- Verify artist has wallet
- Confirm transaction is recorded

## Security Considerations

1. **File Validation**: Frontend validates file type and size before upload
2. **RLS Policies**: Only authenticated users can upload
3. **Public Access**: Files are publicly readable for streaming
4. **Owner Control**: Users can only delete their own files
5. **Artist Verification**: Only users with artist profiles can post music tasks

## Future Enhancements

- [ ] Audio transcoding (convert to multiple bitrates)
- [ ] Image optimization (resize cover art)
- [ ] CDN integration for faster streaming
- [ ] Progress tracking during upload
- [ ] Resume interrupted uploads
- [ ] Batch upload for albums
- [ ] Audio fingerprinting for copyright detection