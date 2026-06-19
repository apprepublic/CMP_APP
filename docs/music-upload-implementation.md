# Music Streaming Task - File Upload Implementation

## Summary of Changes

This implementation adds native file upload support for music streaming tasks, replacing the previous URL-based approach. Users can now directly upload MP3 files and cover art through the task posting interface.

## Files Modified/Created

### New Files
1. **`apps/web/lib/storage.ts`** - Supabase storage utilities
   - `uploadFile()` - Generic file upload function
   - `uploadAudioFile()` - Specialized audio upload
   - `uploadCoverImage()` - Specialized image upload
   - `deleteFile()` - File deletion utility
   - `STORAGE_BUCKETS` - Bucket name constants

2. **`apps/web/lib/__tests__/storage-test.ts`** - Storage setup verification tests

3. **`docs/music-upload-setup.md`** - Complete setup and configuration guide

### Modified Files
1. **`apps/web/app/(app)/tasks/post/page.tsx`**
   - Added file upload state (`audioFile`, `coverImageFile`)
   - Added upload progress tracking
   - Implemented drag-and-drop file upload UI
   - Added file validation (type, size)
   - Updated submission logic to upload files before creating task
   - Enhanced preview modal to show file names
   - Added cleanup for object URLs

2. **`apps/web/lib/hooks.ts`**
   - Updated `usePostTask` type to include music metadata fields

## User Experience Improvements

### Before
- Users had to upload files externally
- Required manual URL copying
- No upload progress feedback
- No file validation
- Error-prone process

### After
- Direct drag-and-drop upload
- Visual file previews
- Upload progress indicators
- Automatic file validation
- Seamless integration with task creation
- File size and type validation

## Technical Implementation

### Upload Flow
```
1. User selects file via drag-drop or browse
2. Frontend validates:
   - File type (MP3 for audio, image/* for cover)
   - File size (50MB audio, 10MB images)
3. User submits task
4. Files upload to Supabase Storage:
   - Audio → music/audio/[timestamp]-[random].mp3
   - Cover → music/covers/[timestamp]-[random].jpg
5. Get public URLs from Supabase
6. Create task with URLs
7. Create Song record in database
8. Link Song to UserPostedTask
```

### State Management
```typescript
interface FormData {
  // File objects (not uploaded yet)
  audioFile: File | null;
  coverImageFile: File | null;
  
  // URLs (after upload or from previous uploads)
  audioUrl: string;
  coverImageUrl: string;
  
  // Metadata
  genre: string;
  durationSeconds: number;
  isDownloadEnabled: boolean;
}
```

### Upload Progress
```typescript
const [uploadProgress, setUploadProgress] = useState({
  audio: 0,  // 0-100
  cover: 0   // 0-100
});
```

## Database Schema

### Song Model (Already Exists)
```prisma
model Song {
  id              String    @id
  artistId        String
  title           String
  description     String?
  audioUrl        String    // Supabase public URL
  coverUrl        String?   // Supabase public URL
  durationSeconds Int
  genre           String?
  playCount       Int       @default(0)
  downloadCount   Int       @default(0)
  isPublished     Boolean   @default(false)
  isFeatured      Boolean   @default(false)
  coinReward      Int       // From task
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  artist          ArtistProfile
  streams         SongStream[]
}
```

### UserPostedTask Model (Already Has Fields)
```prisma
model UserPostedTask {
  // ... existing fields
  audioUrl          String?
  coverImageUrl     String?
  genre             String?
  durationSeconds   Int?
  isDownloadEnabled Boolean  @default(false)
  songId            String?  @unique  // Links to Song
}
```

## API Integration

### Task Creation Endpoint
`POST /api/tasks/create`

When `type === 'STREAM_MUSIC'`:
1. Validates `musicMetadata.audioUrl` is present
2. Checks user has artist profile
3. Creates Song record with metadata
4. Creates UserPostedTask with `songId` reference
5. Deducts coins from creator's wallet

### Music Streaming Endpoints

**Stream a song:**
```
POST /api/music/songs/:id/stream
Body: { duration: number }
- Records stream if duration > 30s
- Credits artist 1 coin
- Increments play count
```

**Download a song:**
```
POST /api/music/songs/:id/download
- Records download
- Credits artist 3 coins
- Increments download count
- Returns download URL
```

## Security & Validation

### Frontend Validation
- File type checking (MP3, images)
- File size limits (50MB audio, 10MB images)
- Required fields validation
- Upload progress feedback

### Backend Validation
- Artist profile requirement
- Audio URL presence check
- Genre validation
- Duration bounds (30s - 2hrs)

### Supabase Storage Security
- RLS policies for authenticated uploads
- Public read access for streaming
- Owner-only delete permissions
- Bucket-level access control

## Testing Checklist

### Manual Testing
- [ ] Create music bucket in Supabase
- [ ] Configure RLS policies
- [ ] Post a music streaming task with file upload
- [ ] Verify file appears in Supabase Storage
- [ ] Check Song record created in database
- [ ] Test song appears in Music section
- [ ] Stream song and verify coin reward
- [ ] Test download functionality
- [ ] Verify artist receives coins

### Automated Testing (Future)
- Unit tests for storage utilities
- Integration tests for upload flow
- E2E tests for complete flow

## Migration Notes

### For Existing Tasks
- Existing tasks with `audioUrl` continue to work
- No database migration needed
- Backward compatible

### For New Tasks
- All new STREAM_MUSIC tasks use file upload
- URLs stored in same fields
- No schema changes required

## Performance Considerations

### Upload Optimization
- Files upload directly to Supabase (no server proxy)
- Progress feedback for large files
- Error handling and retry logic

### Streaming Optimization
- Direct CDN delivery from Supabase
- No server bandwidth costs
- Global distribution

### Future Optimizations
- Implement chunked uploads for large files
- Add audio transcoding for multiple bitrates
- Implement CDN caching headers
- Add image optimization for cover art

## Troubleshooting

### Common Issues

**Upload fails immediately:**
- Check bucket exists
- Verify RLS policies
- Check file size/type

**File uploads but song doesn't appear:**
- Verify `isPublished` is true
- Check Song record in database
- Confirm audioUrl is valid

**Streaming doesn't earn coins:**
- Ensure stream > 30 seconds
- Check SongStream record created
- Verify artist wallet exists

## Future Enhancements

### Phase 2
- [ ] Album/multi-track uploads
- [ ] Playlist creation
- [ ] Artist analytics dashboard
- [ ] Stream quality selection

### Phase 3
- [ ] Audio fingerprinting
- [ ] Copyright detection
- [ ] Automatic genre classification
- [ ] Waveform visualization

### Phase 4
- [ ] Live streaming integration
- [ ] Podcast support
- [ ] Collaborative playlists
- [ ] Social sharing features

## Support

For issues or questions:
1. Check `docs/music-upload-setup.md`
2. Run storage test: `apps/web/lib/__tests__/storage-test.ts`
3. Review Supabase Dashboard logs
4. Check browser console for errors