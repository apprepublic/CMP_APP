'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTasks, useDailyTasks, useCompleteTask, usePostedTasks, useCompletePostedTask } from '@/lib/hooks';

interface ProofModalState {
  isOpen: boolean;
  task: any | null;
}

function ProofSubmissionModal({ task, onClose, onSubmit }: { task: any; onClose: () => void; onSubmit: (proofData: any) => void }) {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requirements = task.social_requirements || {};
  const platform = requirements.platform || '';
  const actions = requirements.actions || [];
  const targetUrl = requirements.targetUrl || '';
  const requiresScreenshot = requirements.requiresScreenshot || false;
  const needsActionUrl = platform || targetUrl || actions.length > 0;

  const handleSubmit = () => {
    setIsSubmitting(true);
    const proofData: any = {};
    if (screenshotUrl.trim()) proofData.screenshot = screenshotUrl.trim();
    if (actionUrl.trim()) proofData.actionUrl = actionUrl.trim();
    if (comment.trim()) proofData.comment = comment.trim();
    proofData.platform = platform || task.type;
    proofData.submittedAt = new Date().toISOString();
    onSubmit(proofData);
  };

  const platformLabel: Record<string, string> = {
    twitter: 'Twitter/X',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };

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

          {requiresScreenshot && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-1 block">
                Screenshot URL * {needsActionUrl ? '' : '(Required)'}
              </label>
              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="https://... (upload image and paste link)"
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Upload a screenshot of your completed action and paste the URL here
              </p>
            </div>
          )}

          {!needsActionUrl && !requiresScreenshot && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-1 block">
                Any additional comments (optional)
              </label>
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
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-body-md text-body-md bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-lg font-body-md text-body-md bg-[#B8860B] text-primary hover:bg-[#8B6914] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
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

export default function EarnMarketplacePage() {
  const { data: resp, isLoading: systemTasksLoading } = useTasks();
  const { data: dailyResp } = useDailyTasks();
  const { data: postedResp, isLoading: postedTasksLoading } = usePostedTasks();
  const completeTask = useCompleteTask();
  const completePostedTask = useCompletePostedTask();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [proofModal, setProofModal] = useState<ProofModalState>({ isOpen: false, task: null });

  const allSystemTasks = resp?.tasks ?? [];
  const allPostedTasks = postedResp?.tasks?.map((t: any) => ({
    ...t,
    isPostedTask: true,
    coinReward: t.coin_per_participant || t.coinPerParticipant,
    category: t.category || 'USER_CREATED',
    current_participants: t.currentParticipants || t.current_participants,
    participant_threshold: t.participantThreshold || t.participant_threshold,
  })) ?? [];
  
  const allTasks = [...allSystemTasks, ...allPostedTasks];
  const dailyTasks = dailyResp?.tasks ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach((t: any) => t.category && set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [allTasks]);

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return allTasks;
    return allTasks.filter((t: any) => t.category === activeCategory);
  }, [allTasks, activeCategory]);

  const dailyStatusMap = useMemo(() => {
    const map = new Map<string, any>();
    dailyTasks.forEach((t: any) => map.set(t.id, t));
    return map;
  }, [dailyTasks]);

  const handleStartTask = async (task: any) => {
    // Handle user-posted tasks - open proof modal
    if (task.isPostedTask) {
      if (task.status === 'PENDING') {
        alert('This task is pending activation by its creator');
        return;
      }
      setProofModal({ isOpen: true, task });
      return;
    }

    // Handle system tasks
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
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      <div className="mb-10 mt-6 lg:mt-0 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Task Marketplace</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Complete verified tasks to earn premium rewards and build your creative capital. Watch out for Ad-Gated premium tasks for higher payouts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/tasks/post"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B8860B] text-primary hover:bg-[#8B6914] rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add_task</span>
            Post a Task
          </Link>
          <Link 
            href="/tasks/posted"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-alt text-on-surface hover:bg-surface-dim rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm border border-outline-variant/30 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">list_alt</span>
            My Tasks
          </Link>
          <Link 
            href="/tasks/streak"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            Daily Streak & Rewards
          </Link>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-8 gap-4 hide-scrollbar border-b border-outline-variant/30">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-body-md text-body-md whitespace-nowrap transition-colors border ${
              activeCategory === category
                ? 'bg-primary text-on-primary shadow-sm border-transparent'
                : 'bg-surface-alt text-on-surface-variant hover:bg-surface-dim border-outline-variant/50'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
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
              ? (task.current_participants >= task.participant_threshold) || isPending
              : (dailyInfo?.isLocked ?? false);
            const completedToday = dailyInfo?.completedToday ?? 0;
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
                  <div className="absolute top-0 right-0 bg-[#B8860B] text-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">
                    PREMIUM
                  </div>
                )}
                
                {isLocked && (
                  <div className="absolute top-0 right-0 bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">
                    DONE
                  </div>
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
                      <span>{isPending ? 'Pending' : isUserTask ? 'Full' : 'Completed'}</span>
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

      {proofModal.isOpen && proofModal.task && (
        <ProofSubmissionModal
          task={proofModal.task}
          onClose={() => setProofModal({ isOpen: false, task: null })}
          onSubmit={handleSubmitProof}
        />
      )}
    </main>
  );
}
