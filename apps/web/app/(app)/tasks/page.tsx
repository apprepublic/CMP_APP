'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTasks, useDailyTasks, useCompleteTask } from '@/lib/hooks';

export default function EarnMarketplacePage() {
  const { data: resp, isLoading } = useTasks();
  const { data: dailyResp } = useDailyTasks();
  const completeTask = useCompleteTask();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const allTasks = resp?.tasks ?? [];
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

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      <div className="mb-10 mt-6 lg:mt-0 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Task Marketplace</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Complete verified tasks to earn premium rewards and build your creative capital. Watch out for Ad-Gated premium tasks for higher payouts.
          </p>
        </div>
        <Link 
          href="/tasks/streak"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm whitespace-nowrap self-start md:self-auto w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          Daily Streak & Rewards
        </Link>
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
        {isLoading ? (
           Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-surface-alt rounded-xl p-6 h-[280px] animate-pulse border border-outline-variant/20" />
           ))
        ) : filteredTasks.length === 0 ? (
           <div className="col-span-full py-12 text-center text-on-surface-variant">
             No tasks available in this category.
           </div>
        ) : (
          filteredTasks.map((task: any) => {
            const isPremium = task.coinReward >= 100;
            const dailyInfo = dailyStatusMap.get(task.id);
            const isLocked = dailyInfo?.isLocked ?? false;
            const completedToday = dailyInfo?.completedToday ?? 0;
            const dailyLimit = task.dailyLimit ?? dailyInfo?.dailyLimit ?? 1;
            const isCompleting = completeTask.isPending && completeTask.variables?.taskId === task.id;
            const hasLinkedArticle = task.linkedArticle || dailyInfo?.linkedArticle;
            
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
                
                <div className={`flex items-start justify-between mb-4 ${isPremium && !isLocked ? 'mt-2' : ''}`}>
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
                      {task.category === 'COMPLETE_SURVEY' ? 'poll' : task.category === 'SHARE_SOCIAL' ? 'share' : task.category === 'READ_ARTICLE' ? 'article' : task.category === 'CONTENT' ? 'article' : 'quickreply'}
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

                {!isLocked && (
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">
                    {task.requiresAdGate && 'Ad-gated • '}{completedToday}/{dailyLimit} today
                  </p>
                )}
                
                <button 
                  onClick={() => handleStartTask(task)}
                  disabled={isLocked || isCompleting}
                  className={`w-full py-3 rounded-lg font-body-md text-body-md transition-colors flex items-center justify-center gap-2 ${
                    isLocked
                      ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                      : isCompleting
                        ? 'bg-surface-container-high text-on-surface-variant animate-pulse'
                        : isPremium
                          ? 'bg-primary text-on-primary hover:bg-on-surface-variant'
                          : 'bg-[#B8860B] text-primary hover:bg-[#8B6914]'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <span>Completed</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
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
  );
}
