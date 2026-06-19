'use client';

import { useState } from 'react';
import { uploadAudioFile, uploadCoverImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function DebugUpload() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function testSupabaseAuth() {
    setStatus('Checking auth status...');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setStatus(`✅ Logged in as: ${user.email}`);
    } else {
      setStatus('❌ Not logged in - uploads will fail!');
      setError('User must be authenticated to upload files');
    }
  }

  async function testBucketAccess() {
    setStatus('Testing bucket access...');
    const { data, error } = await supabase.storage.from('music').list('audio', { limit: 1 });
    if (error) {
      setStatus('❌ Bucket access failed');
      setError(error.message);
    } else {
      setStatus('✅ Bucket access successful');
    }
  }

  async function testFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('Uploading file...');
    setError('');

    const result = await uploadAudioFile(file);
    
    if (result.success) {
      setStatus(`✅ Upload successful! URL: ${result.url}`);
    } else {
      setStatus('❌ Upload failed');
      setError(result.error || 'Unknown error');
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Upload Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testSupabaseAuth}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Auth Status
        </button>

        <button
          onClick={testBucketAccess}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Test Bucket Access
        </button>

        <div>
          <label className="block mb-2">Test File Upload:</label>
          <input
            type="file"
            accept="audio/*"
            onChange={testFileUpload}
            className="block w-full"
          />
        </div>

        {status && (
          <div className="p-4 bg-gray-100 rounded">
            <p className="font-mono text-sm">{status}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            <p className="font-mono text-sm">ERROR: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
