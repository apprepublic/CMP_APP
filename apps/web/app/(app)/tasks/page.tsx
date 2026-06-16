'use client';

import { useState, useMemo } from 'react';
import { useTasks } from '@/lib/hooks';

export default function EarnMarketplacePage() {
  const { data: tasks = [], isLoading } = useTasks();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.category && set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return tasks;
    return tasks.filter((t) => t.category === activeCategory);
  }, [tasks, activeCategory]);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      {/* Header Section */}
      <div className="mb-10 mt-6 lg:mt-0">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Task Marketplace</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Complete verified tasks to earn premium rewards and build your creative capital. Watch out for Ad-Gated premium tasks for higher payouts.
        </p>
      </div>

      {/* Filter Tabs */}
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

      {/* Task Grid */}
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
          filteredTasks.map((task) => {
            const isPremium = task.coin_reward >= 100; // Arbitrary rule for 'premium' UI
            
            return (
              <div 
                key={task.id} 
                className={`bg-surface-alt rounded-xl p-6 flex flex-col h-full relative overflow-hidden group transition-colors ${
                  isPremium 
                    ? 'border-2 border-[#B8860B]' 
                    : 'border border-outline-variant/20 hover:border-outline-variant/50'
                }`}
              >
                {isPremium && (
                  <div className="absolute top-0 right-0 bg-[#B8860B] text-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">
                    PREMIUM
                  </div>
                )}
                
                <div className={`flex items-start justify-between mb-4 ${isPremium ? 'mt-2' : ''}`}>
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
                      {task.category === 'SURVEY' ? 'poll' : task.category === 'SOCIAL' ? 'share' : task.category === 'CONTENT' ? 'article' : 'quickreply'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
                    <span className="font-data-md text-data-md text-primary">{task.coin_reward}</span>
                  </div>
                </div>
                
                <h3 className="font-h3 text-h3 text-primary mb-2">{task.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-6">
                  {task.description || 'Complete this task to earn coins and boost your creative capital.'}
                </p>
                
                <button 
                  className={`w-full py-3 rounded-lg font-body-md text-body-md transition-colors flex items-center justify-center gap-2 ${
                    isPremium 
                      ? 'bg-primary text-on-primary hover:bg-on-surface-variant group'
                      : 'bg-[#B8860B] text-primary hover:bg-[#8B6914]'
                  }`}
                >
                  <span>Start Task</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {isPremium ? 'lock_open' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}