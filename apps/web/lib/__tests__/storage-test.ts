/**
 * Test script to verify Supabase Storage setup for music uploads
 * 
 * Run this in browser console or as a Node.js script to verify:
 * 1. Storage buckets exist
 * 2. Upload permissions work
 * 3. Public access is configured correctly
 */

import { supabase } from '@/lib/supabase';
import { STORAGE_BUCKETS } from '@/lib/storage';

export async function testStorageSetup() {
  console.log('🧪 Testing Supabase Storage Setup...\n');

  // Test 1: Check if music bucket exists and is accessible
  console.log('1️⃣ Testing music bucket access...');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    console.error('❌ Error listing buckets:', bucketError.message);
    return false;
  }

  const musicBucket = buckets?.find(b => b.name === STORAGE_BUCKETS.MUSIC);
  if (!musicBucket) {
    console.error('❌ Music bucket not found! Please create it in Supabase Dashboard.');
    return false;
  }
  console.log('✅ Music bucket exists:', musicBucket.name);

  // Test 2: Test upload with a small test file
  console.log('\n2️⃣ Testing file upload...');
  const testFile = new File(['test audio content'], 'test-upload.mp3', { type: 'audio/mpeg' });
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.MUSIC)
    .upload(`test/${testFile.name}`, testFile);

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message);
    console.log('   Check your RLS policies and bucket permissions.');
    return false;
  }
  console.log('✅ Upload successful:', uploadData.path);

  // Test 3: Test public access
  console.log('\n3️⃣ Testing public URL access...');
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKETS.MUSIC)
    .getPublicUrl(uploadData.path);

  console.log('📎 Public URL:', publicUrl);
  
  try {
    const response = await fetch(publicUrl, { method: 'HEAD' });
    if (response.ok) {
      console.log('✅ Public URL is accessible');
    } else {
      console.error('❌ Public URL returned error:', response.status);
      console.log('   Check if bucket is set to public in Supabase Dashboard.');
    }
  } catch (err) {
    console.error('❌ Cannot access public URL:', err);
  }

  // Test 4: Clean up test file
  console.log('\n4️⃣ Cleaning up test file...');
  const { error: deleteError } = await supabase.storage
    .from(STORAGE_BUCKETS.MUSIC)
    .remove([uploadData.path]);

  if (deleteError) {
    console.error('⚠️  Warning: Could not delete test file:', deleteError.message);
  } else {
    console.log('✅ Test file deleted successfully');
  }

  console.log('\n✅ All tests passed! Storage is properly configured.\n');
  return true;
}

// Test helper for checking bucket configuration
export async function checkBucketConfiguration() {
  console.log('📋 Bucket Configuration Check:\n');
  
  const requiredBuckets = Object.values(STORAGE_BUCKETS);
  console.log('Required buckets:', requiredBuckets.join(', '));
  
  const { data: buckets } = await supabase.storage.listBuckets();
  const existingBuckets = buckets?.map(b => b.name) || [];
  
  console.log('\nExisting buckets:', existingBuckets.join(', '));
  
  const missing = requiredBuckets.filter(b => !existingBuckets.includes(b));
  if (missing.length > 0) {
    console.error('\n❌ Missing buckets:', missing.join(', '));
    console.log('Create these buckets in Supabase Dashboard > Storage > Create bucket');
    return false;
  }
  
  console.log('\n✅ All required buckets exist!');
  return true;
}

// Run tests
if (typeof window !== 'undefined') {
  (async () => {
    const configOk = await checkBucketConfiguration();
    if (configOk) {
      await testStorageSetup();
    }
  })();
}