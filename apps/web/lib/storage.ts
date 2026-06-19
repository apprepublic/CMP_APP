import { supabase } from './supabase';

export const STORAGE_BUCKETS = {
  MUSIC: 'music',
  TASK_ATTACHMENTS: 'task-attachments',
  PROFILE_PHOTOS: 'profile-photos',
  COVER_PHOTOS: 'cover-photos',
} as const;

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * @param bucket - The storage bucket name
 * @param file - The file to upload
 * @param path - Optional custom path within the bucket
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path?: string
): Promise<UploadResult> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to upload files. Please sign in and try again.',
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    console.log(`[Storage] Uploading to ${bucket}/${filePath}...`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[Storage] Upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed. Please try again.',
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    console.log(`[Storage] Upload successful: ${publicUrl}`);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (err: any) {
    console.error('[Storage] Upload error:', err);
    return {
      success: false,
      error: err.message || 'Upload failed',
    };
  }
}

/**
 * Upload audio file for music streaming task
 * @param file - Audio file to upload
 */
export async function uploadAudioFile(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.MUSIC, file, 'audio');
}

/**
 * Upload cover image for music or tasks
 * @param file - Image file to upload
 */
export async function uploadCoverImage(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.MUSIC, file, 'covers');
}

/**
 * Delete a file from Supabase storage
 * @param bucket - The storage bucket name
 * @param filePath - Path to the file within the bucket
 */
export async function deleteFile(bucket: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Delete error:', err);
    return {
      success: false,
      error: err.message || 'Delete failed',
    };
  }
}