'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostTask, useWallet } from '@/lib/hooks';
import { useWallet as useWalletStore } from '@/stores/userStore';

const TASK_TYPES = [
  { value: 'READ_ARTICLE', label: 'Read Article', icon: 'article', minBudget: 1000 },
  { value: 'WATCH_VIDEO', label: 'Watch Video', icon: 'play_circle', minBudget: 2000 },
  { value: 'SHARE_SOCIAL', label: 'Share on Social', icon: 'share', minBudget: 3000 },
  { value: 'SOCIAL_ENGAGEMENT', label: 'Social Engagement', icon: 'thumb_up', minBudget: 2000 },
  { value: 'COMPLETE_SURVEY', label: 'Complete Survey', icon: 'poll', minBudget: 5000 },
  { value: 'APP_DOWNLOAD', label: 'App Download', icon: 'download', minBudget: 10000 },
  { value: 'VOTE', label: 'Vote/Poll', icon: 'how_to_vote', minBudget: 1000 },
];

const SOCIAL_PLATFORMS = [
  { value: 'TWITTER', label: 'Twitter/X', icon: 'tag' },
  { value: 'INSTAGRAM', label: 'Instagram', icon: 'photo_camera' },
  { value: 'TIKTOK', label: 'TikTok', icon: 'music_note' },
  { value: 'YOUTUBE', label: 'YouTube', icon: 'play_circle' },
  { value: 'FACEBOOK', label: 'Facebook', icon: 'facebook' },
  { value: 'LINKEDIN', label: 'LinkedIn', icon: 'work' },
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'READ_ARTICLE',
    participantThreshold: 100,
    totalBudget: 5000,
    targetUrl: '',
    commentText: '',
    minCommentLength: 10,
    requiresScreenshot: false,
  });

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
      formData.title.length >= 5 &&
      formData.description.length >= 20 &&
      coinPerParticipant >= MIN_COIN_PER_PARTICIPANT &&
      totalCost <= coinBalance
    );

    if (formData.type === 'SOCIAL_ENGAGEMENT') {
      return baseValid && formData.targetUrl.length > 0 && selectedActions.length > 0;
    }

    return baseValid;
  }, [formData, coinPerParticipant, totalCost, coinBalance, selectedActions]);

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

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (coinPerParticipant < MIN_COIN_PER_PARTICIPANT) {
      newErrors.budget = `Coin per participant must be at least ${MIN_COIN_PER_PARTICIPANT}`;
    }
    if (totalCost > coinBalance) {
      newErrors.balance = 'Insufficient balance';
    }
    if (formData.type === 'SOCIAL_ENGAGEMENT' && !formData.targetUrl) {
      newErrors.targetUrl = 'Target URL is required for social engagement tasks';
    }
    if (formData.type === 'SOCIAL_ENGAGEMENT' && selectedActions.length === 0) {
      newErrors.actions = 'Select at least one action';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await postTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        participantThreshold: formData.participantThreshold,
        totalBudget: formData.totalBudget,
        socialRequirements: formData.type === 'SOCIAL_ENGAGEMENT' ? {
          platform: selectedPlatform,
          actions: selectedActions,
          targetUrl: formData.targetUrl,
          commentText: formData.commentText || undefined,
          minCommentLength: formData.minCommentLength,
          requiresScreenshot: formData.requiresScreenshot,
        } : undefined,
      });
      router.push('/tasks/posted?success=created');
    } catch (err: any) {
      if (err.message?.includes('top up')) {
        router.push('/wallet?topup=required');
      } else {
        setErrors({ submit: err.message || 'Failed to create task' });
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

      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 space-y-6">
        <div>
          <label className="block font-body-md text-body-md text-on-surface mb-2">Task Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Engage with our latest content"
            className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
          />
          {errors.title && <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.title}</p>}
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {formData.title.length}/50 min characters
          </p>
        </div>

        <div>
          <label className="block font-body-md text-body-md text-on-surface mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what participants need to do..."
            rows={4}
            className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] resize-none"
          />
          {errors.description && <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.description}</p>}
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {formData.description.length}/100 min characters
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
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPlatform === platform.value
                          ? 'border-[#B8860B] bg-[#B8860B]/10'
                          : 'border-outline-variant/30 hover:border-outline-variant/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl mb-1 block">{platform.icon}</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{platform.label}</span>
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
            disabled={!isValid || postTask.isPending}
            className="flex-1 bg-[#B8860B] text-primary font-body-md text-body-md py-4 rounded-lg hover:bg-[#8B6914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {postTask.isPending ? 'Creating...' : 'Preview & Post'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-h2 text-h2 text-on-surface mb-4">Preview Task</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Title</p>
                <p className="font-body-md text-body-md text-on-surface">{formData.title}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Description</p>
                <p className="font-body-md text-body-md text-on-surface">{formData.description}</p>
              </div>
              {isSocialEngagement && (
                <div className="bg-surface rounded-lg p-4 space-y-3">
                  <p className="font-label-caps text-label-caps text-[#B8860B] uppercase">Social Requirements</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      {SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.icon}
                    </span>
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
                </div>
              )}
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
    </main>
  );
}