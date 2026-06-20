'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostTask } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { uploadAudioFile, uploadCoverImage, STORAGE_BUCKETS } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

const TASK_TYPES = [
  { value: 'READ_ARTICLE', label: 'Read Article', icon: 'article', minBudget: 1000 },
  { value: 'WATCH_VIDEO', label: 'Watch Video', icon: 'play_circle', minBudget: 2000 },
  { value: 'SHARE_SOCIAL', label: 'Share on Social', icon: 'share', minBudget: 3000 },
  { value: 'SOCIAL_ENGAGEMENT', label: 'Social Engagement', icon: 'thumb_up', minBudget: 2000 },
  { value: 'COMPLETE_SURVEY', label: 'Complete Survey', icon: 'poll', minBudget: 5000 },
  { value: 'APP_DOWNLOAD', label: 'App Download', icon: 'download', minBudget: 10000 },
  { value: 'VOTE', label: 'Vote/Poll', icon: 'how_to_vote', minBudget: 1000 },
  { value: 'STREAM_MUSIC', label: 'Stream Music', icon: 'music_note', minBudget: 5000 },
];

const SOCIAL_PLATFORMS = [
  { value: 'TWITTER', label: 'Twitter/X', logo: '/platform-logos/twitter-alt.svg', color: '#000000' },
  { value: 'INSTAGRAM', label: 'Instagram', logo: '/platform-logos/instagram.svg', color: '#E4405F' },
  { value: 'TIKTOK', label: 'TikTok', logo: '/platform-logos/tik-tok.svg', color: '#000000' },
  { value: 'YOUTUBE', label: 'YouTube', logo: '/platform-logos/youtube-circle.svg', color: '#FF0000' },
  { value: 'FACEBOOK', label: 'Facebook', logo: '/platform-logos/facebook.svg', color: '#1877F2' },
  { value: 'LINKEDIN', label: 'LinkedIn', logo: '/platform-logos/linkedin.svg', color: '#0A66C2' },
];

const SOCIAL_ACTIONS = [
  { value: 'LIKE', label: 'Like', icon: 'thumb_up' },
  { value: 'COMMENT', label: 'Comment', icon: 'comment' },
  { value: 'SHARE', label: 'Share', icon: 'share' },
  { value: 'RETWEET', label: 'Retweet/Repost', icon: 'repeat' },
  { value: 'FOLLOW', label: 'Follow', icon: 'person_add' },
  { value: 'SUBSCRIBE', label: 'Subscribe', icon: 'subscriptions' },
];

const CREATION_FEE = 500;
const MIN_COIN_PER_PARTICIPANT = 10;

export default function PostTaskPage() {
  const router = useRouter();
  const postTask = usePostTask();
  const { wallet } = useWallet();
  const coinBalance = Number(wallet?.coin_balance ?? 0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setAuthChecked(true);
      
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/tasks/post');
      }
    };
    checkAuth();
  }, [router]);

  const [formData, setFormData] = useState({
    type: 'READ_ARTICLE',
    participantThreshold: 100,
    totalBudget: 5000,
    // Social engagement fields
    targetUrl: '',
    commentText: '',
    minCommentLength: 10,
    requiresScreenshot: false,
    // Read article fields
    articleUrl: '',
    minReadTime: 2,
    // Watch video fields
    videoUrl: '',
    minWatchTime: 30,
    // App download fields
    appStoreUrl: '',
    requiresReview: false,
    minRating: 4,
    // Survey fields
    surveyUrl: '',
    minQuestions: 5,
    // Share social fields
    sharePlatform: 'TWITTER',
    shareMessage: '',
    requiresHashtag: false,
    hashtag: '',
    // Music stream fields
    audioFile: null as File | null,
    audioUrl: '',
    coverImageFile: null as File | null,
    coverImageUrl: '',
    genre: '',
    durationSeconds: 180,
    isDownloadEnabled: false,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ audio: 0, cover: 0 });
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [coverUploaded, setCoverUploaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);

  const handleAudioFileSelected = useCallback(async (file: File) => {
    if (!isAuthenticated) {
      setErrors({ submit: 'Please sign in to upload files' });
      router.push('/login?redirect=/tasks/post');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors({ audioUrl: 'File size must be less than 50MB' });
      return;
    }
    setAudioUploaded(false);
    setFormData(prev => ({ ...prev, audioFile: file }));
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, audio: 10 }));
    setErrors(prev => ({ ...prev, audioUrl: '' }));

    const result = await uploadAudioFile(file);
    if (!result.success || !result.url) {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, audio: 0 }));
      setFormData(prev => ({ ...prev, audioFile: null, audioUrl: '' }));
      setErrors({ audioUrl: result.error || 'Failed to upload audio file' });
      return;
    }
    setUploadProgress(prev => ({ ...prev, audio: 100 }));
    setFormData(prev => ({ ...prev, audioUrl: result.url! }));
    setAudioUploaded(true);
    setUploading(false);
  }, [isAuthenticated, router]);

  const handleCoverFileSelected = useCallback(async (file: File) => {
    if (!isAuthenticated) {
      setErrors({ submit: 'Please sign in to upload files' });
      router.push('/login?redirect=/tasks/post');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ coverImageUrl: 'File size must be less than 10MB' });
      return;
    }
    setCoverUploaded(false);
    setFormData(prev => ({ ...prev, coverImageFile: file }));
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, cover: 10 }));
    setErrors(prev => ({ ...prev, coverImageUrl: '' }));

    const result = await uploadCoverImage(file);
    if (!result.success || !result.url) {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, cover: 0 }));
      setFormData(prev => ({ ...prev, coverImageFile: null, coverImageUrl: '' }));
      setErrors({ coverImageUrl: result.error || 'Failed to upload cover image' });
      return;
    }
    setUploadProgress(prev => ({ ...prev, cover: 100 }));
    setFormData(prev => ({ ...prev, coverImageUrl: result.url! }));
    setCoverUploaded(true);
    setUploading(false);
  }, [isAuthenticated, router]);

  const [selectedPlatform, setSelectedPlatform] = useState<string>('TWITTER');
  const [selectedActions, setSelectedActions] = useState<string[]>(['LIKE']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const coinPerParticipant = useMemo(() => {
    return Math.floor(formData.totalBudget / formData.participantThreshold);
  }, [formData.totalBudget, formData.participantThreshold]);

  const totalCost = useMemo(() => {
    return CREATION_FEE + formData.totalBudget;
  }, [formData.totalBudget]);

  const isValid = useMemo(() => {
    const baseValid = (
      coinPerParticipant >= MIN_COIN_PER_PARTICIPANT &&
      totalCost <= coinBalance
    );

    if (uploading) return false;

    if (formData.type === 'STREAM_MUSIC') {
      const hasAudio = !!formData.audioUrl || audioUploaded;
      const hasGenre = !!formData.genre;
      return baseValid && hasAudio && hasGenre;
    }

    if (formData.type === 'SOCIAL_ENGAGEMENT') {
      return baseValid && formData.targetUrl.length > 0 && selectedActions.length > 0;
    }

    return baseValid;
  }, [formData, coinPerParticipant, totalCost, coinBalance, selectedActions, uploading, audioUploaded]);

  useEffect(() => {
    const minBudget = TASK_TYPES.find(t => t.value === formData.type)?.minBudget ?? 1000;
    if (formData.totalBudget < minBudget) {
      setFormData(prev => ({ ...prev, totalBudget: minBudget }));
    }
  }, [formData.type]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAction = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  // Auto-generate title and description based on task type and selections
  const generateTitleAndDescription = useCallback((data: typeof formData) => {
    let title = '';
    let description = '';

    switch (data.type) {
      case 'READ_ARTICLE':
        title = `Read Article: ${data.articleUrl ? new URL(data.articleUrl).hostname : 'Article'}`;
        description = `Read the article for at least ${data.minReadTime} minutes to earn ${coinPerParticipant} coins.`;
        break;
      case 'WATCH_VIDEO':
        title = `Watch Video: ${data.videoUrl ? new URL(data.videoUrl).hostname : 'Video'}`;
        description = `Watch the video for at least ${data.minWatchTime} seconds to earn ${coinPerParticipant} coins.`;
        break;
      case 'APP_DOWNLOAD':
        title = `Download App: ${data.appStoreUrl ? new URL(data.appStoreUrl).hostname : 'App'}`;
        description = `Download and review this app with a minimum ${data.minRating}-star rating to earn ${coinPerParticipant} coins.`;
        break;
      case 'COMPLETE_SURVEY':
        title = `Complete Survey: ${data.surveyUrl ? new URL(data.surveyUrl).hostname : 'Survey'}`;
        description = `Complete this survey with at least ${data.minQuestions} questions to earn ${coinPerParticipant} coins.`;
        break;
      case 'SHARE_SOCIAL':
        title = `Share on ${SOCIAL_PLATFORMS.find(p => p.value === data.sharePlatform)?.label || 'Social'}`;
        description = `Share the specified content on ${SOCIAL_PLATFORMS.find(p => p.value === data.sharePlatform)?.label || 'social media'}${data.requiresHashtag ? ` with hashtag ${data.hashtag}` : ''} to earn ${coinPerParticipant} coins.`;
        break;
      case 'SOCIAL_ENGAGEMENT':
        const platform = SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.label || 'Social';
        const actions = selectedActions.map(a => SOCIAL_ACTIONS.find(act => act.value === a)?.label).join(', ');
        title = `Engage on ${platform}: ${actions}`;
        description = `${actions} on the specified ${platform} post to earn ${coinPerParticipant} coins.${data.requiresScreenshot ? ' Screenshot required.' : ''}`;
        break;
      case 'STREAM_MUSIC':
        const audioName = data.audioFile?.name || data.genre || 'Track';
        title = `Stream Music: ${audioName}`;
        description = `Stream this ${data.genre || 'music'} track (${Math.floor(data.durationSeconds / 60)}:${(data.durationSeconds % 60).toString().padStart(2, '0')}) to earn ${coinPerParticipant} coins.${data.isDownloadEnabled ? ' Download also available.' : ''}`;
        break;
      default:
        title = 'Complete Task';
        description = 'Complete this task to earn coins.';
    }

    return { title, description };
  }, [selectedPlatform, selectedActions, coinPerParticipant]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (coinPerParticipant < MIN_COIN_PER_PARTICIPANT) {
      newErrors.budget = `Coin per participant must be at least ${MIN_COIN_PER_PARTICIPANT}`;
    }
    if (totalCost > coinBalance) {
      newErrors.balance = 'Insufficient balance';
    }

    // Task-specific validation
    switch (formData.type) {
      case 'READ_ARTICLE':
        if (!formData.articleUrl) {
          newErrors.articleUrl = 'Article URL is required';
        }
        break;
      case 'WATCH_VIDEO':
        if (!formData.videoUrl) {
          newErrors.videoUrl = 'Video URL is required';
        }
        break;
      case 'APP_DOWNLOAD':
        if (!formData.appStoreUrl) {
          newErrors.appStoreUrl = 'App Store URL is required';
        }
        break;
      case 'COMPLETE_SURVEY':
        if (!formData.surveyUrl) {
          newErrors.surveyUrl = 'Survey URL is required';
        }
        break;
      case 'SHARE_SOCIAL':
        if (!formData.shareMessage) {
          newErrors.shareMessage = 'Share message is required';
        }
        if (formData.requiresHashtag && !formData.hashtag) {
          newErrors.hashtag = 'Hashtag is required';
        }
        break;
      case 'STREAM_MUSIC':
        if (!formData.audioUrl && !formData.audioFile) {
          newErrors.audioUrl = 'Audio file is required';
        }
        if (!formData.audioUrl && formData.audioFile && !audioUploaded) {
          newErrors.audioUrl = 'Please wait for audio upload to complete';
        }
        if (!formData.genre) {
          newErrors.genre = 'Genre is required';
        }
        break;
      case 'SOCIAL_ENGAGEMENT':
        if (!formData.targetUrl) {
          newErrors.targetUrl = 'Target URL is required';
        }
        if (selectedActions.length === 0) {
          newErrors.actions = 'Select at least one action';
        }
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { title, description } = generateTitleAndDescription(formData);

      const payload: any = {
        title,
        description,
        type: formData.type,
        participantThreshold: formData.participantThreshold,
        totalBudget: formData.totalBudget,
      };

      if (formData.type === 'SOCIAL_ENGAGEMENT') {
        payload.socialRequirements = {
          platform: selectedPlatform,
          actions: selectedActions,
          targetUrl: formData.targetUrl || undefined,
          commentText: formData.commentText || undefined,
          minCommentLength: formData.minCommentLength,
          requiresScreenshot: formData.requiresScreenshot,
        };
      }

      if (formData.type === 'STREAM_MUSIC') {
        payload.musicMetadata = {
          audioUrl: formData.audioUrl,
          coverImageUrl: formData.coverImageUrl || undefined,
          genre: formData.genre || undefined,
          durationSeconds: formData.durationSeconds,
          isDownloadEnabled: formData.isDownloadEnabled,
        };
      }

      await postTask.mutateAsync(payload);
      
      // Success - show success modal
      setShowPreview(false);
      setShowSuccess(true);
    } catch (err: any) {
      setUploading(false);
      console.error('Task creation error:', err);
      const message = err?.response?.data?.error || err?.message || 'Failed to create task';
      if (message.includes('top up') || message.includes('Insufficient balance')) {
        setErrors({ submit: 'Insufficient balance. Please top up your wallet.' });
      } else {
        setErrors({ submit: message });
      }
    }
  };

  const isSocialEngagement = formData.type === 'SOCIAL_ENGAGEMENT';

  return (
    <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      <div className="mb-8">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-4">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-body-md text-body-md">Back to Tasks</span>
        </Link>
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">Post a Task</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Create custom tasks to engage users and grow your audience
        </p>
      </div>

      <div className="bg-surface-alt rounded-xl p-6 border border-outline-variant/30 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#B8860B]">account_balance_wallet</span>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Available Balance</p>
              <p className="font-h2 text-h2 text-primary">{coinBalance.toLocaleString()} Coins</p>
            </div>
          </div>
          <Link
            href="/wallet"
            className="bg-primary text-on-primary font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-on-primary-fixed transition-colors"
          >
            Top Up
          </Link>
        </div>
      </div>

      {!authChecked ? (
        <div className="text-center py-10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin mb-4">progress_activity</span>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-error-alert/10 border border-error-alert/30 rounded-xl p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-error-alert mb-4">lock</span>
          <h3 className="font-h3 text-h3 text-on-surface mb-2">Sign In Required</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            You need to sign in to create tasks and upload files.
          </p>
          <button
            onClick={() => router.push('/login?redirect=/tasks/post')}
            className="bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors"
          >
            Sign In
          </button>
        </div>
      ) : (
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 space-y-6">
        {/* Auto-generated Title & Description Preview */}
        <div className="bg-surface rounded-xl p-6 border border-outline-variant/20">
          <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B8860B]">auto_awesome</span>
            Task Preview
          </h3>
          <div className="space-y-4">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Generated Title</p>
              <p className="font-body-md text-body-md text-on-surface p-3 bg-surface-alt rounded-lg border border-outline-variant/20">
                {generateTitleAndDescription(formData).title}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Generated Description</p>
              <p className="font-body-md text-body-md text-on-surface p-3 bg-surface-alt rounded-lg border border-outline-variant/20">
                {generateTitleAndDescription(formData).description}
              </p>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
            ℹ️ Title and description are automatically generated based on your task type and settings
          </p>
        </div>

        <div>
          <label className="block font-body-md text-body-md text-on-surface mb-2">Task Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TASK_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleInputChange('type', type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === type.value
                    ? 'border-[#B8860B] bg-[#B8860B]/10'
                    : 'border-outline-variant/30 hover:border-outline-variant/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-2 block">
                  {type.icon}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface block">{type.label}</span>
                <span className="font-data-xs text-data-xs text-on-surface-variant block mt-1">
                  Min {type.minBudget.toLocaleString()} coins
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Task-Specific Requirements */}
        {formData.type === 'READ_ARTICLE' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">article</span>
              Article Reading Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Article URL *</label>
                <input
                  type="url"
                  value={formData.articleUrl}
                  onChange={(e) => handleInputChange('articleUrl', e.target.value)}
                  placeholder="https://yourblog.com/article-title"
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to the article participants must read
                </p>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Read Time (minutes)</label>
                <input
                  type="number"
                  value={formData.minReadTime}
                  onChange={(e) => handleInputChange('minReadTime', Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={60}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Estimated time to read the article
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.type === 'WATCH_VIDEO' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">play_circle</span>
              Video Watching Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Video URL *</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  YouTube, Vimeo, or other video platform URL
                </p>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Watch Time (seconds)</label>
                <input
                  type="number"
                  value={formData.minWatchTime}
                  onChange={(e) => handleInputChange('minWatchTime', Math.max(10, parseInt(e.target.value) || 10))}
                  min={10}
                  max={3600}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Minimum seconds participants must watch
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.type === 'APP_DOWNLOAD' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">download</span>
              App Download Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">App Store URL *</label>
                <input
                  type="url"
                  value={formData.appStoreUrl}
                  onChange={(e) => handleInputChange('appStoreUrl', e.target.value)}
                  placeholder="https://apps.apple.com/... or https://play.google.com/..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to your app on App Store or Google Play
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requiresReview"
                  checked={formData.requiresReview}
                  onChange={(e) => handleInputChange('requiresReview', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="requiresReview" className="font-body-md text-body-md text-on-surface">
                  Require app review
                </label>
              </div>
              {formData.requiresReview && (
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Rating (stars)</label>
                  <input
                    type="number"
                    value={formData.minRating}
                    onChange={(e) => handleInputChange('minRating', Math.max(1, Math.min(5, parseInt(e.target.value) || 5)))}
                    min={1}
                    max={5}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Minimum star rating required (1-5)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {formData.type === 'COMPLETE_SURVEY' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">poll</span>
              Survey Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Survey URL *</label>
                <input
                  type="url"
                  value={formData.surveyUrl}
                  onChange={(e) => handleInputChange('surveyUrl', e.target.value)}
                  placeholder="https://forms.google.com/... or https://typeform.com/..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to your survey (Google Forms, Typeform, SurveyMonkey, etc.)
                </p>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Questions</label>
                <input
                  type="number"
                  value={formData.minQuestions}
                  onChange={(e) => handleInputChange('minQuestions', Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={100}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Number of questions in the survey
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.type === 'SHARE_SOCIAL' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">share</span>
              Social Share Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Share Platform *</label>
                <select
                  value={formData.sharePlatform}
                  onChange={(e) => handleInputChange('sharePlatform', e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>{platform.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Suggested Share Message</label>
                <textarea
                  value={formData.shareMessage}
                  onChange={(e) => handleInputChange('shareMessage', e.target.value)}
                  placeholder="Check out this amazing content..."
                  rows={3}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] resize-none"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Optional message participants can use when sharing
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requiresHashtag"
                  checked={formData.requiresHashtag}
                  onChange={(e) => handleInputChange('requiresHashtag', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="requiresHashtag" className="font-body-md text-body-md text-on-surface">
                  Require specific hashtag
                </label>
              </div>
              {formData.requiresHashtag && (
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Required Hashtag</label>
                  <input
                    type="text"
                    value={formData.hashtag}
                    onChange={(e) => handleInputChange('hashtag', e.target.value.replace(/\s/g, ''))}
                    placeholder="#YourCampaign"
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {formData.type === 'STREAM_MUSIC' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">music_note</span>
              Music Upload & Streaming Settings
            </h3>
            <div className="space-y-4">
              {/* Audio File Upload */}
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Audio File (MP3) *</label>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 bg-surface-alt">
                  {formData.audioFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploading && uploadProgress.audio < 100 ? (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        ) : audioUploaded ? (
                          <span className="material-symbols-outlined text-success-verified">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        )}
                        <div>
                          <p className="font-body-md text-body-md text-on-surface">{formData.audioFile.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                            {uploading && uploadProgress.audio < 100 ? (
                              <span className="ml-2 text-[#B8860B]">
                                - Uploading {uploadProgress.audio}%
                              </span>
                            ) : audioUploaded ? (
                              <span className="ml-2 text-success-verified">
                                - Upload Complete
                              </span>
                            ) : (
                              <span className="ml-2 text-[#B8860B]">- Uploading...</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, audioFile: null, audioUrl: '' }));
                          setAudioUploaded(false);
                          setUploadProgress(prev => ({ ...prev, audio: 0 }));
                        }}
                        className="text-error-alert hover:underline font-body-sm text-body-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">cloud_upload</span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-2">
                        Drop your audio file here or click to browse
                      </p>
                      <input
                        type="file"
                        accept=".mp3,audio/mpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAudioFileSelected(file);
                        }}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label
                        htmlFor="audio-upload"
                        className="inline-flex items-center gap-2 bg-[#B8860B] text-primary font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-[#8B6914] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        Choose File
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                        MP3 format, max 50MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.audioUrl && <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.audioUrl}</p>}
                {uploadProgress.audio > 0 && uploadProgress.audio < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div
                        className="bg-[#B8860B] h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress.audio}%` }}
                      />
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Uploading audio... {uploadProgress.audio}%</p>
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Album Art</label>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 bg-surface-alt">
                  {formData.coverImageFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploading && uploadProgress.cover < 100 ? (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        ) : coverUploaded ? (
                          <span className="material-symbols-outlined text-success-verified">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        )}
                        <img
                          src={URL.createObjectURL(formData.coverImageFile)}
                          alt="Cover preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-body-md text-body-md text-on-surface">{formData.coverImageFile.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {(formData.coverImageFile.size / (1024 * 1024)).toFixed(2)} MB
                            {uploading && uploadProgress.cover < 100 ? (
                              <span className="ml-2 text-[#B8860B]">
                                - Uploading {uploadProgress.cover}%
                              </span>
                            ) : coverUploaded ? (
                              <span className="ml-2 text-success-verified">
                                - Upload Complete
                              </span>
                            ) : (
                              <span className="ml-2 text-[#B8860B]">- Uploading...</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, coverImageFile: null, coverImageUrl: '' }));
                          setCoverUploaded(false);
                          setUploadProgress(prev => ({ ...prev, cover: 0 }));
                        }}
                        className="text-error-alert hover:underline font-body-sm text-body-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">image</span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-2">
                        Drop your cover art here or click to browse
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCoverFileSelected(file);
                        }}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-surface-container-high/80 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        Choose File
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                        JPG/PNG, max 10MB (recommended: 1000x1000px)
                      </p>
                    </div>
                  )}
                </div>
                {uploadProgress.cover > 0 && uploadProgress.cover < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div
                        className="bg-[#B8860B] h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress.cover}%` }}
                      />
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Uploading cover... {uploadProgress.cover}%</p>
                  </div>
                )}
              </div>

              {/* Genre and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  >
                    <option value="">Select Genre</option>
                    <option value="Afrobeats">Afrobeats</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="R&B">R&B</option>
                    <option value="Pop">Pop</option>
                    <option value="Gospel">Gospel</option>
                    <option value="Highlife">Highlife</option>
                    <option value="Fuji">Fuji</option>
                    <option value="Amapiano">Amapiano</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Rock">Rock</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.durationSeconds}
                    onChange={(e) => handleInputChange('durationSeconds', Math.max(30, parseInt(e.target.value) || 30))}
                    min={30}
                    max={7200}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Length of the track
                  </p>
                </div>
              </div>

              {/* Download Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDownloadEnabled"
                  checked={formData.isDownloadEnabled}
                  onChange={(e) => handleInputChange('isDownloadEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="isDownloadEnabled" className="font-body-md text-body-md text-on-surface">
                  Allow users to download this track
                </label>
              </div>

              {/* Info Box */}
              <div className="bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-lg p-4">
                <p className="font-body-sm text-body-sm text-[#B8860B]">
                  <strong>Note:</strong> Your track will appear in the Music section. Users will earn coins by streaming. 
                  Each stream pays the coin reward you set above from your budget.
                </p>
              </div>
            </div>
          </div>
        )}

        {isSocialEngagement && (
          <div className="bg-surface rounded-xl p-6 border border-[#B8860B]/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">thumb_up</span>
              Social Engagement Requirements
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Platform *</label>
                <div className="grid grid-cols-3 gap-3">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => setSelectedPlatform(platform.value)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPlatform === platform.value
                          ? 'border-[#B8860B] bg-[#B8860B]/10'
                          : 'border-outline-variant/30 hover:border-outline-variant/50'
                      }`}
                    >
                      <img
                        src={platform.logo}
                        alt={platform.label}
                        className="w-8 h-8 object-contain"
                        style={{ filter: selectedPlatform === platform.value ? 'none' : 'grayscale(100%)' }}
                      />
                      <span className="font-body-xs text-body-xs text-on-surface text-center">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Required Actions * (Select multiple)</label>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_ACTIONS.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => toggleAction(action.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        selectedActions.includes(action.value)
                          ? 'border-[#B8860B] bg-[#B8860B]/10'
                          : 'border-outline-variant/30 hover:border-outline-variant/50'
                      }`}
                    >
                      <span className={`material-symbols-outlined ${selectedActions.includes(action.value) ? 'text-[#B8860B]' : 'text-on-surface-variant'}`}>
                        {selectedActions.includes(action.value) ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface">{action.label}</span>
                    </button>
                  ))}
                </div>
                {errors.actions && <p className="text-error-alert font-body-sm text-body-sm mt-2">{errors.actions}</p>}
              </div>

              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Target URL *</label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                  placeholder="https://twitter.com/yourprofile/status/..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                {errors.targetUrl && <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.targetUrl}</p>}
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to the post/profile participants need to engage with
                </p>
              </div>

              {selectedActions.includes('COMMENT') && (
                <div className="bg-surface-container-high rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block font-body-md text-body-md text-on-surface mb-2">Suggested Comment Text (Optional)</label>
                    <textarea
                      value={formData.commentText}
                      onChange={(e) => handleInputChange('commentText', e.target.value)}
                      placeholder="Enter a suggested comment participants can use..."
                      rows={3}
                      className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] resize-none"
                    />
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Participants can use this or write their own
                    </p>
                  </div>
                  <div>
                    <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Comment Length</label>
                    <input
                      type="number"
                      value={formData.minCommentLength}
                      onChange={(e) => handleInputChange('minCommentLength', Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={500}
                      className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                    />
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Minimum characters required for a valid comment
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="screenshot"
                  checked={formData.requiresScreenshot}
                  onChange={(e) => handleInputChange('requiresScreenshot', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="screenshot" className="font-body-md text-body-md text-on-surface">
                  Require screenshot as proof
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-body-md text-body-md text-on-surface mb-2">
              Participants Target *
            </label>
            <input
              type="number"
              value={formData.participantThreshold}
              onChange={(e) => handleInputChange('participantThreshold', Math.max(10, parseInt(e.target.value) || 0))}
              min={10}
              max={10000}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Min: 10, Max: 10,000
            </p>
          </div>

          <div>
            <label className="block font-body-md text-body-md text-on-surface mb-2">
              Total Budget (Coins) *
            </label>
            <input
              type="number"
              value={formData.totalBudget}
              onChange={(e) => handleInputChange('totalBudget', Math.max(1000, parseInt(e.target.value) || 0))}
              min={1000}
              max={1000000}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Min: 1,000 coins
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-outline-variant/20">
          <h3 className="font-h3 text-h3 text-on-surface mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Creation Fee</span>
              <span className="font-data-md text-data-md text-primary">{CREATION_FEE.toLocaleString()} 🪙</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Participant Budget</span>
              <span className="font-data-md text-data-md text-primary">{formData.totalBudget.toLocaleString()} 🪙</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
              <span className="font-body-md text-body-md font-semibold text-on-surface">Total Cost</span>
              <span className="font-h3 text-h3 text-[#B8860B]">{totalCost.toLocaleString()} 🪙</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
              <span className="font-body-md text-body-md text-on-surface-variant">Coin per Participant</span>
              <span className="font-data-lg text-data-lg text-secondary">{coinPerParticipant.toLocaleString()} 🪙</span>
            </div>
          </div>
          {errors.budget && (
            <p className="text-error-alert font-body-sm text-body-sm mt-3">{errors.budget}</p>
          )}
          {errors.balance && (
            <div className="mt-4 p-4 bg-error-alert/10 border border-error-alert/30 rounded-lg">
              <p className="text-error-alert font-body-md text-body-md">{errors.balance}</p>
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 mt-2 text-error-alert hover:underline font-body-sm text-body-sm"
              >
                <span className="material-symbols-outlined text-sm">add_card</span>
                Top up your wallet
              </Link>
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="p-4 bg-error-alert/10 border border-error-alert/30 rounded-lg">
            <p className="text-error-alert font-body-md text-body-md">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!isValid || postTask.isPending || uploading}
            className="flex-1 bg-[#B8860B] text-primary font-body-md text-body-md py-4 rounded-lg hover:bg-[#8B6914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Uploading... {uploadProgress.audio > 0 && uploadProgress.audio < 100 ? `Audio ${uploadProgress.audio}%` : ''}{uploadProgress.cover > 0 && uploadProgress.cover < 100 ? ` Cover ${uploadProgress.cover}%` : ''}
              </span>
            ) : postTask.isPending ? (
              'Creating...'
            ) : (
              'Preview & Post'
            )}
          </button>
        </div>
      </div>
      )}

      {/* Preview Modal */}
      {showPreview && !showSuccess && isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-h2 text-h2 text-on-surface mb-4">Preview Task</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Title</p>
                <p className="font-body-md text-body-md text-on-surface">{generateTitleAndDescription(formData).title}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Description</p>
                <p className="font-body-md text-body-md text-on-surface">{generateTitleAndDescription(formData).description}</p>
              </div>
              
              {/* Task-Specific Requirements Preview */}
              <div className="bg-surface rounded-lg p-4 space-y-3">
                <p className="font-label-caps text-label-caps text-[#B8860B] uppercase">Task Requirements</p>
                
                {formData.type === 'READ_ARTICLE' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Article URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.articleUrl}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Min Read Time</p>
                      <p className="font-body-md text-body-md text-on-surface">{formData.minReadTime} minutes</p>
                    </div>
                  </>
                )}
                
                {formData.type === 'WATCH_VIDEO' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Video URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.videoUrl}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Min Watch Time</p>
                      <p className="font-body-md text-body-md text-on-surface">{formData.minWatchTime} seconds</p>
                    </div>
                  </>
                )}
                
                {formData.type === 'APP_DOWNLOAD' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">App Store URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.appStoreUrl}</p>
                    </div>
                    {formData.requiresReview && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Requires Review</p>
                        <p className="font-body-md text-body-md text-on-surface">Yes, min {formData.minRating} stars</p>
                      </div>
                    )}
                  </>
                )}
                
                {formData.type === 'COMPLETE_SURVEY' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Survey URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.surveyUrl}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Min Questions</p>
                      <p className="font-body-md text-body-md text-on-surface">{formData.minQuestions} questions</p>
                    </div>
                  </>
                )}
                
                {formData.type === 'SHARE_SOCIAL' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Platform</p>
                      <p className="font-body-md text-body-md text-on-surface">{SOCIAL_PLATFORMS.find(p => p.value === formData.sharePlatform)?.label}</p>
                    </div>
                    {formData.shareMessage && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Share Message</p>
                        <p className="font-body-sm text-body-sm text-on-surface line-clamp-2">{formData.shareMessage}</p>
                      </div>
                    )}
                    {formData.requiresHashtag && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Required Hashtag</p>
                        <p className="font-body-md text-body-md text-on-surface">{formData.hashtag}</p>
                      </div>
                    )}
                  </>
                )}
                
                {formData.type === 'STREAM_MUSIC' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Audio File</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">
                        {formData.audioFile?.name || formData.audioUrl || 'No audio file'}
                      </p>
                    </div>
                    {(formData.coverImageFile || formData.coverImageUrl) && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Cover Art</p>
                        <p className="font-body-sm text-body-sm text-on-surface truncate">
                          {formData.coverImageFile?.name || formData.coverImageUrl}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Genre</p>
                        <p className="font-body-md text-body-md text-on-surface">{formData.genre}</p>
                      </div>
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Duration</p>
                        <p className="font-body-md text-body-md text-on-surface">
                          {Math.floor(formData.durationSeconds / 60)}:{(formData.durationSeconds % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                    {formData.isDownloadEnabled && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Download</p>
                        <p className="font-body-md text-body-md text-success-verified">Enabled</p>
                      </div>
                    )}
                    <div className="bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-lg p-3">
                      <p className="font-body-sm text-body-sm text-[#B8860B]">
                        This track will appear in the Music section. Users earn {coinPerParticipant} coins per stream.
                      </p>
                    </div>
                  </>
                )}
                
                {isSocialEngagement && (
                  <>
                    <div className="flex items-center gap-2">
                      <img
                        src={SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.logo || ''}
                        alt={selectedPlatform}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="font-body-md text-body-md text-on-surface">
                        {SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.label}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Actions</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedActions.map(action => (
                          <span key={action} className="bg-[#B8860B]/10 text-[#B8860B] font-body-sm text-body-sm px-2 py-1 rounded">
                            {SOCIAL_ACTIONS.find(a => a.value === action)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    {formData.targetUrl && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Target URL</p>
                        <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.targetUrl}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Type</p>
                  <p className="font-body-md text-body-md text-on-surface">
                    {TASK_TYPES.find(t => t.value === formData.type)?.label}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Participants</p>
                  <p className="font-body-md text-body-md text-on-surface">{formData.participantThreshold}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Budget</p>
                  <p className="font-body-md text-body-md text-on-surface">{formData.totalBudget.toLocaleString()} 🪙</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Per Participant</p>
                  <p className="font-body-md text-body-md text-secondary">{coinPerParticipant.toLocaleString()} 🪙</p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Total Cost</p>
                <p className="font-h2 text-h2 text-[#B8860B]">{totalCost.toLocaleString()} 🪙</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-surface-container-high text-on-surface font-body-md text-body-md py-3 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={postTask.isPending}
                className="flex-1 bg-[#B8860B] text-primary font-body-md text-body-md py-3 rounded-lg hover:bg-[#8B6914] transition-colors disabled:opacity-50"
              >
                {postTask.isPending ? 'Posting...' : 'Confirm & Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-success-verified/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-success-verified">
                  check_circle
                </span>
              </div>
              <h2 className="font-h2 text-h2 text-on-surface mb-2">Task Posted Successfully!</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your task has been created and is now live.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Task Type:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {TASK_TYPES.find(t => t.value === formData.type)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Participants:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {formData.participantThreshold.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Budget:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {formData.totalBudget.toLocaleString()} 🪙
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-outline-variant/20">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Coin per Participant:</span>
                  <span className="font-body-sm text-body-sm text-secondary font-bold">
                    {coinPerParticipant.toLocaleString()} 🪙
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push('/tasks');
                }}
                className="w-full bg-[#B8860B] text-primary font-body-md text-body-md py-3 rounded-lg hover:bg-[#8B6914] transition-colors"
              >
                View All Tasks
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  // Reset form to create another task
                  setFormData({
                    type: 'READ_ARTICLE',
                    participantThreshold: 100,
                    totalBudget: 5000,
                    targetUrl: '',
                    commentText: '',
                    minCommentLength: 10,
                    requiresScreenshot: false,
                    articleUrl: '',
                    minReadTime: 2,
                    videoUrl: '',
                    minWatchTime: 30,
                    appStoreUrl: '',
                    requiresReview: false,
                    minRating: 4,
                    surveyUrl: '',
                    minQuestions: 5,
                    sharePlatform: 'TWITTER',
                    shareMessage: '',
                    requiresHashtag: false,
                    hashtag: '',
                    audioFile: null,
                    audioUrl: '',
                    coverImageFile: null,
                    coverImageUrl: '',
                    genre: '',
                    durationSeconds: 180,
                    isDownloadEnabled: false,
                  });
                  setSelectedPlatform('TWITTER');
                  setSelectedActions(['LIKE']);
                  setErrors({});
                }}
                className="w-full bg-surface-container-high text-on-surface font-body-md text-body-md py-3 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                Create Another Task
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}