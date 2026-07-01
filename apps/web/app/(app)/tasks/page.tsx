'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTasks, useDailyTasks, useCompleteTask, usePostedTasks, useCompletePostedTask } from '@/lib/hooks';
import { api } from '@/lib/api';
import { usePlayer } from '@/components/music/PlayerProvider';

interface ProofModalState {
  isOpen: boolean;
  task: any | null;
}

function ProofSubmissionModal({ task, onClose, onSubmit }: { task: any; onClose: () => void; onSubmit: (proofData: any) => void }) {
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requirements = task.social_requirements || task.socialRequirements || {};
  const platform = requirements.platform || '';
  const actions = requirements.actions || [];
  const targetUrl = requirements.targetUrl || '';
  const requiresScreenshot = requirements.requiresScreenshot || false;
  const needsActionUrl = task.type === 'SHARE_SOCIAL';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Max 10MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files allowed.');
      return;
    }

    setUploadError('');
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview('');
    setScreenshotUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const proofData: any = {};
      proofData.platform = platform || task.type;
      proofData.submittedAt = new Date().toISOString();

      if (requiresScreenshot && screenshotFile) {
        setIsUploading(true);
        const uploadedUrl = await api.uploadProofScreenshot(screenshotFile);
        proofData.screenshot = uploadedUrl;
        setIsUploading(false);
      } else if (screenshotUrl.trim()) {
        proofData.screenshot = screenshotUrl.trim();
      }

      if (actionUrl.trim()) proofData.actionUrl = actionUrl.trim();
      if (comment.trim()) proofData.comment = comment.trim();

      await onSubmit(proofData);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Try pasting a URL instead.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const platformLabel: Record<string, string> = {
    twitter: 'Twitter/X',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };

  const canSubmit = !isSubmitting && !isUploading && (
    !requiresScreenshot || screenshotPreview || screenshotUrl.trim()
  ) && (
    !needsActionUrl || actionUrl.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-h3 text-h3 text-on-surface">Submit Proof</h2>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="bg-surface-container rounded-xl p-4 mb-6">
            <h3 className="font-body-md text-body-md font-semibold text-on-surface mb-1">{task.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{task.description}</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B] text-sm">generating_tokens</span>
              <span className="font-data-md text-data-md text-primary">{task.coinReward || task.coin_per_participant} coins</span>
            </div>
          </div>

          {targetUrl && (
            <div className="mb-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Target URL</label>
              <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="font-body-md text-body-md text-secondary hover:underline flex items-center gap-1 break-all">
                {targetUrl}
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          )}

          {actions.length > 0 && (
            <div className="mb-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Required Actions</label>
              <div className="flex flex-wrap gap-2">
                {actions.map((action: string) => (
                  <span key={action} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-caps text-label-caps">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}

          {platform && (
            <div className="mb-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Platform</label>
              <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-label-caps text-label-caps">
                {platformLabel[platform] || platform}
              </span>
            </div>
          )}

          {needsActionUrl && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-1 block">
                Link to your {platformLabel[platform] || 'action'} *
              </label>
              <input
                type="url"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder={platform === 'twitter' ? 'https://x.com/username/status/...' : 'https://...'}
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Provide the direct link to your {actions.includes('like') ? 'like' : actions.includes('comment') ? 'comment' : actions.includes('share') ? 'share/post' : 'action'}
              </p>
            </div>
          )}

          {(requiresScreenshot || !needsActionUrl) && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-2 block">
                Screenshot Proof {requiresScreenshot ? '*' : '(optional)'}
              </label>

              {screenshotPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-outline-variant/30 mb-2">
                  <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-48 object-cover" />
                  <button onClick={removeScreenshot} className="absolute top-2 right-2 bg-surface-container-high/80 rounded-full p-1 text-on-surface-variant hover:text-error-alert">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-outline-variant rounded-lg p-8 text-center cursor-pointer hover:border-secondary hover:bg-secondary-container/5 transition-colors">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">cloud_upload</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Click to upload screenshot</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              <div className="flex items-center gap-4 mt-3">
                <div className="flex-1 border-t border-outline-variant/30" />
                <span className="font-label-caps text-label-caps text-on-surface-variant">OR</span>
                <div className="flex-1 border-t border-outline-variant/30" />
              </div>

              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => { setScreenshotUrl(e.target.value); if (e.target.value.trim()) { setScreenshotFile(null); setScreenshotPreview(''); } }}
                placeholder="Paste image URL instead..."
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none mt-3"
              />

              {uploadError && <p className="font-body-sm text-body-sm text-error-alert mt-1">{uploadError}</p>}
              {isUploading && <p className="font-body-sm text-body-sm text-secondary mt-1 animate-pulse">Uploading screenshot...</p>}
            </div>
          )}

          {!needsActionUrl && !requiresScreenshot && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-1 block">Any additional comments (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any notes about completing this task..."
                rows={3}
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none resize-none"
              />
            </div>
          )}

          <div className="bg-tertiary-container/20 rounded-xl p-3 mb-6 flex items-start gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container text-sm mt-0.5">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Coins will be credited after the task creator approves your submission. Auto-approved after 24 hours if no action is taken.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-lg font-body-md text-body-md bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit} className="flex-1 py-3 rounded-lg font-body-md text-body-md bg-[#B8860B] text-primary hover:bg-[#8B6914] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isUploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : isSubmitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  <span>Submit Proof</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TASK_TYPES_MAP: Record<string, string> = {
  'WATCH_VIDEO': 'Watch Video',
  'SHARE_SOCIAL': 'Share on Social',
  'SOCIAL_ENGAGEMENT': 'Social Engagement',
  'COMPLETE_SURVEY': 'Complete Survey',
  'APP_DOWNLOAD': 'App Download',
  'VOTE': 'Vote/Poll',
  'STREAM_MUSIC': 'Stream Music',
};

const formatTaskType = (typeOrCategory: string) => {
  if (!typeOrCategory) return 'Other';
  if (TASK_TYPES_MAP[typeOrCategory]) return TASK_TYPES_MAP[typeOrCategory];
  if (typeOrCategory === 'USER_CREATED') return 'Other';
  return typeOrCategory.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

function MobileTasksPage(props: {
  allTasks: any[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  handleStartTask: (task: any) => void;
  dailyStatusMap: Map<string, any>;
  systemTasksLoading: boolean;
  postedTasksLoading: boolean;
}) {
  const { allTasks, categories, activeCategory, setActiveCategory, handleStartTask, dailyStatusMap, systemTasksLoading, postedTasksLoading } = props;

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return allTasks;
    return allTasks.filter((t: any) => t.displayCategory === activeCategory);
  }, [allTasks, activeCategory]);

  return (
    <div className="lg:hidden min-h-screen bg-surface pb-24">
      <main className="pt-2 flex flex-col w-full relative overflow-x-hidden">
        {/* Action Header */}
        <section className="bg-primary-container px-4 py-4 flex justify-between items-center gap-4 shadow-md rounded-b-xl">
          <Link href="/tasks/posted" className="flex-1 bg-surface-container-lowest text-primary font-body-lg text-body-lg font-bold py-3 rounded-lg shadow-sm hover:bg-surface-container-low transition-colors active:scale-95 text-center">
            My Tasks
          </Link>
          <Link href="/tasks/post" className="flex-1 bg-[#B8860B] text-primary font-body-lg text-body-lg font-bold py-3 rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] hover:brightness-110 transition-all active:scale-95 text-center">
            Post a Task
          </Link>
        </section>

        {/* Category Pills */}
        <section className="px-4 py-4 border-b border-surface-variant/50 sticky top-[4rem] z-40 bg-surface/90 backdrop-blur-md">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps transition-colors active:scale-95 shadow-sm border ${
                  activeCategory === category
                    ? 'bg-primary-container text-[#B8860B] border-transparent'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Task List */}
        <section className="px-4 py-4 flex flex-col gap-4 pb-8">
          {(systemTasksLoading || postedTasksLoading) ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 h-[200px] animate-pulse shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)]" />
            ))
          ) : filteredTasks.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant">No tasks available in this category.</div>
          ) : (
            filteredTasks.map((task: any) => {
              const isPremium = task.coinReward >= 100;
              const isPostedTask = task.isPostedTask;
              const dailyInfo = dailyStatusMap.get(task.id);
              const isLocked = isPostedTask
                ? (task.completedToday > 0) || (task.current_participants >= task.participant_threshold) || task.status === 'PENDING'
                : (dailyInfo?.isLocked ?? false);
              const hasLinkedArticle = task.linkedArticle || dailyInfo?.linkedArticle;
              const coins = task.coinReward || task.coin_per_participant || 0;
              const slotsLeft = isPostedTask ? (task.participant_threshold - task.current_participants) : 0;
              const totalSlots = isPostedTask ? task.participant_threshold : 0;
              const progressPct = totalSlots > 0 ? Math.round(((totalSlots - slotsLeft) / totalSlots) * 100) : 0;

              const taskIcon = (type: string) => {
                if (!type) return 'quickreply';
                const t = type.toUpperCase();
                if (t === 'WATCH_VIDEO' || t === 'STREAM_MUSIC') return 'play_circle';
                if (t === 'SHARE_SOCIAL' || t === 'SOCIAL_ENGAGEMENT') return 'thumb_up';
                if (t === 'COMPLETE_SURVEY') return 'assignment';
                if (t === 'CONTENT') return 'article';
                if (t === 'VOTE') return 'how_to_vote';
                if (t === 'USER_CREATED') return 'person_add';
                return 'quickreply';
              };

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)] ${
                    isPremium && !isLocked ? 'border-t border-[#B8860B]/50' : ''
                  }`}
                >
                  {isPremium && !isLocked && (
                    <div className="absolute top-0 right-0 bg-[#B8860B] text-primary font-label-caps text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                      PREMIUM
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container shrink-0">
                      <span className="material-symbols-outlined text-3xl">{taskIcon(task.type)}</span>
                    </div>
                    <div className="flex-grow min-w-0 pr-12">
                      <h3 className="font-body-lg text-body-lg text-on-surface truncate">{task.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-muted mt-0.5 line-clamp-2">
                        {task.description || 'Complete this task to earn coins.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-1 ${isPremium ? 'bg-[#B8860B]/5 border border-[#B8860B]/20' : 'bg-surface-container'} px-2 py-1 rounded-full w-fit`}>
                        <span className="material-symbols-outlined text-[#B8860B] text-sm">monetization_on</span>
                        <span className="font-data-md text-data-md text-primary-container">{coins}</span>
                      </div>
                      {isPostedTask ? (
                        <span className="font-label-caps text-[10px] text-on-surface-variant">
                          {slotsLeft}/{totalSlots} slots left
                        </span>
                      ) : !isLocked ? (
                        <span className="font-label-caps text-[10px] text-on-surface-variant">
                          {task.completedToday}/{task.dailyLimit || 1} today
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => handleStartTask(task)}
                      disabled={isLocked}
                      className={`font-body-md text-body-md font-bold px-6 py-2 rounded-lg transition-all active:scale-95 ${
                        isLocked
                          ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                          : isPremium
                            ? 'bg-[#B8860B] text-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] hover:brightness-110'
                            : 'bg-primary-container text-on-primary hover:opacity-90'
                      }`}
                    >
                      {isLocked ? (task.status === 'PENDING' ? 'Pending' : 'Done') : hasLinkedArticle ? 'Read Article' : 'Start Task'}
                    </button>
                  </div>

                  {/* Progress bar for premium/user-posted */}
                  {(isPremium || isPostedTask) && !isLocked && (
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full" style={{ width: `${Math.min(100, isPostedTask ? progressPct : 50)}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default function EarnMarketplacePage() {
  const router = useRouter();
  const { play } = usePlayer();
  const { data: resp, isLoading: systemTasksLoading } = useTasks();
  const { data: dailyResp } = useDailyTasks();
  const { data: postedResp, isLoading: postedTasksLoading } = usePostedTasks();
  const completeTask = useCompleteTask();
  const completePostedTask = useCompletePostedTask();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [proofModal, setProofModal] = useState<ProofModalState>({ isOpen: false, task: null });

  const allTasks = useMemo(() => {
    const sysTasks = resp?.tasks?.map((t: any) => ({
      ...t,
      displayCategory: formatTaskType(t.type || t.category),
    })) ?? [];

    const pTasks = postedResp?.tasks?.map((t: any) => ({
      ...t,
      isPostedTask: true,
      coinReward: t.coin_per_participant || t.coinPerParticipant,
      displayCategory: formatTaskType(t.type),
      current_participants: t.currentParticipants || t.current_participants,
      participant_threshold: t.participantThreshold || t.participant_threshold,
    })) ?? [];

    const uniqueMap = new Map();
    sysTasks.forEach((t: any) => uniqueMap.set(t.id, t));
    pTasks.forEach((t: any) => uniqueMap.set(t.id, t));

    return Array.from(uniqueMap.values());
  }, [resp, postedResp]);

  const dailyTasks = dailyResp?.tasks ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach((t: any) => t.displayCategory && set.add(t.displayCategory));
    return ['All', ...Array.from(set)];
  }, [allTasks]);

  const dailyStatusMap = useMemo(() => {
    const map = new Map<string, any>();
    dailyTasks.forEach((t: any) => map.set(t.id, t));
    return map;
  }, [dailyTasks]);

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return allTasks;
    return allTasks.filter((t: any) => t.displayCategory === activeCategory);
  }, [allTasks, activeCategory]);

  const handleStartTask = async (task: any) => {
    const isMusicTask = task.type === 'STREAM_MUSIC' ||
                        task.category === 'STREAM_MUSIC' ||
                        task.category?.toLowerCase() === 'music' ||
                        task.title?.toLowerCase().includes('stream music') ||
                        task.title?.toLowerCase().includes('play song');

    if (isMusicTask) {
      if (task.isPostedTask && task.status === 'PENDING') {
        alert('This task is pending activation by its creator');
        return;
      }

      const songId = task.songId || task.song_id || '';
      const audioUrl = task.audioUrl || task.audio_url || '';
      const coverUrl = task.coverImageUrl || task.cover_image_url || '';
      const coinReward = task.coinReward || task.coin_per_participant || 0;
      const isDownloadEnabled = task.isDownloadEnabled || task.is_download_enabled || false;

      play({
        id: songId || 'temp-task-song',
        artist_id: 'task-creator',
        title: task.title || 'Stream Task Track',
        slug: 'task-track',
        description: 'Stream to earn coins',
        audio_url: audioUrl,
        cover_url: coverUrl || null,
        duration_seconds: task.duration_seconds || 180,
        genre: null,
        coin_reward: coinReward,
        play_count: 0,
        is_featured: false,
        is_download_enabled: isDownloadEnabled,
        artist: {
          id: 'creator',
          stage_name: 'Task Artist',
          slug: 'task-artist',
          avatar_url: null,
          is_verified: false
        }
      }, [], {
        id: task.id,
        isPosted: task.isPostedTask,
        coinReward: coinReward
      });

      router.push('/music');
      return;
    }

    if (task.isPostedTask) {
      if (task.status === 'PENDING') {
        alert('This task is pending activation by its creator');
        return;
      }
      setProofModal({ isOpen: true, task });
      return;
    }

    const dailyInfo = dailyStatusMap.get(task.id);
    if (dailyInfo?.linkedArticle?.slug) {
      window.location.href = `/tasks/article/${dailyInfo.linkedArticle.slug}`;
      return;
    }
    if (task.linkedArticle?.slug) {
      window.location.href = `/tasks/article/${task.linkedArticle.slug}`;
      return;
    }
    if (!dailyInfo?.isLocked && !dailyInfo?.canComplete === false) {
      try {
        await completeTask.mutateAsync({ taskId: task.id, adWatched: task.requiresAdGate });
      } catch {}
    }
  };

  const handleSubmitProof = useCallback(async (proofData: any) => {
    if (!proofModal.task) return;
    try {
      const result = await completePostedTask.mutateAsync({ id: proofModal.task.id, proofData });
      setProofModal({ isOpen: false, task: null });
      alert(result.message || 'Proof submitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit proof');
    }
  }, [proofModal.task, completePostedTask]);

  return (
    <>
      {/* Mobile Layout */}
      <MobileTasksPage
        allTasks={allTasks}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        handleStartTask={handleStartTask}
        dailyStatusMap={dailyStatusMap}
        systemTasksLoading={systemTasksLoading}
        postedTasksLoading={postedTasksLoading}
      />

      {/* Desktop Layout */}
      <main className="hidden lg:block max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full overflow-x-hidden">
        <div className="mb-10 mt-6 lg:mt-0 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tasks/post" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B8860B] text-primary hover:bg-[#8B6914] rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm whitespace-nowrap">
              <span className="material-symbols-outlined">add_task</span>
              Post a Task
            </Link>
            <Link href="/tasks/posted" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-alt text-on-surface hover:bg-surface-dim rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm border border-outline-variant/30 whitespace-nowrap">
              <span className="material-symbols-outlined">list_alt</span>
              My Tasks
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap pb-4 mb-8 gap-4 border-b border-outline-variant/30 w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-body-md text-body-md transition-colors border ${
                activeCategory === category
                  ? 'bg-primary text-on-primary shadow-sm border-transparent'
                  : 'bg-surface-alt text-on-surface-variant hover:bg-surface-dim border-outline-variant/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {(systemTasksLoading || postedTasksLoading) ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="bg-surface-alt rounded-xl p-6 h-[280px] animate-pulse border border-outline-variant/20" />
             ))
          ) : filteredTasks.length === 0 ? (
             <div className="col-span-full py-12 text-center text-on-surface-variant">
               No tasks available in this category.
             </div>
          ) : (
            filteredTasks.map((task: any) => {
              const isPostedTask = task.isPostedTask;
              const isPremium = task.coinReward >= 100;
              const dailyInfo = dailyStatusMap.get(task.id);
              const isPending = isPostedTask && task.status === 'PENDING';
              const isLocked = isPostedTask
                ? (task.completedToday > 0) || (task.current_participants >= task.participant_threshold) || isPending
                : (dailyInfo?.isLocked ?? false);
              const completedToday = isPostedTask ? (task.completedToday ?? 0) : (dailyInfo?.completedToday ?? 0);
              const dailyLimit = task.dailyLimit ?? dailyInfo?.dailyLimit ?? 1;
              const isCompleting = (isPostedTask ? completePostedTask : completeTask).isPending;
              const hasLinkedArticle = task.linkedArticle || dailyInfo?.linkedArticle;
              const isUserTask = isPostedTask;

              return (
                <div
                  key={task.id}
                  className={`bg-surface-alt rounded-xl p-6 flex flex-col h-full relative overflow-hidden group transition-colors ${
                    isLocked
                      ? 'opacity-60 border border-outline-variant/10'
                      : isPremium
                        ? 'border-2 border-[#B8860B]'
                        : 'border border-outline-variant/20 hover:border-outline-variant/50'
                  }`}
                >
                  {isPremium && !isLocked && (
                    <div className="absolute top-0 right-0 bg-[#B8860B] text-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">PREMIUM</div>
                  )}
                  {isLocked && (
                    <div className="absolute top-0 right-0 bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">DONE</div>
                  )}

                  <div className={`flex items-start justify-between mb-4 ${isPremium && !isLocked && !isUserTask ? 'mt-2' : ''}`}>
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
                        {isUserTask ? 'person_add' : (task.category === 'COMPLETE_SURVEY' ? 'poll' : task.category === 'SHARE_SOCIAL' ? 'share' : task.category === 'CONTENT' ? 'article' : 'quickreply')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
                      <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
                      <span className="font-data-md text-data-md text-primary">{task.coinReward}</span>
                    </div>
                  </div>

                  <h3 className="font-h3 text-h3 text-primary mb-2">{task.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-2">
                    {task.description || 'Complete this task to earn coins and boost your creative capital.'}
                  </p>

                  {isUserTask ? (
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">
                      {task.current_participants}/{task.participant_threshold} participants • {task.participant_threshold - task.current_participants} slots left
                      {isPending && ' • Pending Activation'}
                    </p>
                  ) : !isLocked ? (
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">
                      {task.requiresAdGate && 'Ad-gated • '}{completedToday}/{dailyLimit} today
                    </p>
                  ) : null}

                  <button
                    onClick={() => handleStartTask(task)}
                    disabled={isLocked || isCompleting}
                    className={`w-full py-3 rounded-lg font-body-md text-body-md transition-colors flex items-center justify-center gap-2 ${
                      isLocked
                        ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                        : isCompleting
                          ? 'bg-surface-container-high text-on-surface-variant animate-pulse'
                          : isUserTask
                            ? 'bg-secondary text-on-secondary hover:bg-secondary-container'
                            : isPremium
                              ? 'bg-primary text-on-primary hover:bg-on-surface-variant'
                              : 'bg-[#B8860B] text-primary hover:bg-[#8B6914]'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <span>{isPending ? 'Pending' : completedToday > 0 ? 'Claimed' : isUserTask ? 'Full' : 'Completed'}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{isPending ? 'pending' : 'check_circle'}</span>
                      </>
                    ) : isUserTask ? (
                      <>
                        <span>Earn {task.coinReward} Coins</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                      </>
                    ) : hasLinkedArticle ? (
                      <>
                        <span>Read Article</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                      </>
                    ) : isCompleting ? (
                      <span>Completing...</span>
                    ) : (
                      <>
                        <span>{isPremium ? 'Start Premium Task' : 'Start Task'}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          {isPremium ? 'lock_open' : 'arrow_forward'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      {proofModal.isOpen && proofModal.task && (
        <ProofSubmissionModal
          task={proofModal.task}
          onClose={() => setProofModal({ isOpen: false, task: null })}
          onSubmit={handleSubmitProof}
        />
      )}
    </>
  );
}
