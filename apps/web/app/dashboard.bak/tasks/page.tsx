'use client';

import { useState } from 'react';

const filterTabs = ['All', 'News', 'Social', 'Surveys', 'Voting'];

const tasks = [
  {
    id: 1,
    title: 'Review New Audio Interface',
    description: 'Test and provide feedback on the upcoming CMPapp creator tools. Ad-Gated task.',
    reward: 250,
    icon: 'quickreply',
    isPremium: true,
  },
  {
    id: 2,
    title: 'Share Latest Drop',
    description: 'Amplify the new Afrobeat collection on your social channels to earn instant rewards.',
    reward: 50,
    icon: 'share',
    isPremium: false,
  },
  {
    id: 3,
    title: 'Creator Economy Survey',
    description: '5-minute survey about your monthly creative expenses and tool preferences.',
    reward: 100,
    icon: 'poll',
    isPremium: false,
  },
  {
    id: 4,
    title: 'Read Daily News',
    description: 'Stay updated with the latest trends in the Nigerian digital art scene.',
    reward: 25,
    icon: 'article',
    isPremium: false,
  },
  {
    id: 5,
    title: 'Watch Brand Promo',
    description: 'Watch a 30-second promotional video from our partner brand.',
    reward: 75,
    icon: 'ondemand_video',
    isPremium: false,
  },
  {
    id: 6,
    title: 'App Store Review',
    description: 'Leave a review for CMPapp on the App Store and earn bonus coins.',
    reward: 200,
    icon: 'star_rate',
    isPremium: true,
  },
];

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="space-y-gutter">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Task Marketplace</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Complete verified tasks to earn premium rewards and build your creative capital. Watch out for Ad-Gated premium tasks for higher payouts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-4 no-scrollbar border-b border-outline-variant/30">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2 rounded-full font-body-md text-body-md whitespace-nowrap transition-colors shadow-sm ${
              tab === activeFilter
                ? 'bg-primary text-on-primary'
                : 'bg-surface-alt text-on-surface-variant hover:bg-surface-dim border border-outline-variant/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-surface-alt rounded-xl p-6 flex flex-col h-full relative overflow-hidden group ${
              task.isPremium
                ? 'border-2 border-secondary'
                : 'border border-outline-variant/20 hover:border-outline-variant/50 transition-colors'
            }`}
          >
            {task.isPremium && (
              <div className="absolute top-0 right-0 bg-secondary text-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">
                PREMIUM
              </div>
            )}

            <div className="flex items-start justify-between mb-4 mt-2">
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>{task.icon}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-secondary bg-surface-lowest">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '16px' }}>monetization_on</span>
                <span className="font-data-md text-data-md text-primary">{task.reward}</span>
              </div>
            </div>

            <h3 className="font-h3 text-h3 text-primary mb-2">{task.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-6">{task.description}</p>

            <button
              className={`w-full font-body-md text-body-md py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                task.isPremium
                  ? 'bg-primary text-on-primary hover:bg-on-surface-variant group'
                  : 'bg-secondary hover:bg-secondary-fixed text-primary'
              }`}
            >
              <span>Start Task</span>
              {task.isPremium ? (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_open</span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}