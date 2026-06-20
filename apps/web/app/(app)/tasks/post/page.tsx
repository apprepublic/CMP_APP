'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostTask } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { uploadAudioFile, uploadCoverImage, STORAGE_BUCKETS } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

// Debug: log supabase import
if (typeof window !== 'undefined') {
  console.log('Supabase imported:', !!supabase, supabase ? 'OK' : 'UNDEFINED');
}
// File truncated for debugging - full file restored in next commit
