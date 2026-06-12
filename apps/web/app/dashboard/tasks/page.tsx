'use client';

import { useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { QuickReply, Share, Poll, Article, OndemandVideo, StarRate, LockOpen, ArrowForward } from 'lucide-react';

const filterTabs = ['All', 'News', 'Social', 'Surveys', 'Voting'];

const tasks = [
  {
    id: 1,
    title: 'Review New Audio Interface',
    description: 'Test and provide feedback on the upcoming CMPapp creator tools. Ad-Gated task.',
    reward: 250,
    icon: QuickReply,
    isPremium: true,
  },
  {
    id: 2,
    title: 'Share Latest Drop',
    description: 'Amplify the new Afrobeat collection on your social channels to earn instant rewards.',
    reward: 50,
    icon: Share,
    isPremium: false,
  },
  {
    id: 3,
    title: 'Creator Economy Survey',
    description: '5-minute survey about your monthly creative expenses and tool preferences.',
    reward: 100,
    icon: Poll,
    isPremium: false,
  },
  {
    id: 4,
    title: 'Read Daily News',
    description: 'Stay updated with the latest trends in the Nigerian digital art scene.',
    reward: 25,
    icon: Article,
    isPremium: false,
  },
  {
    id: 5,
    title: 'Watch Brand Promo',
    description: 'Watch a 30-second promotional video from our partner brand.',
    reward: 75,
    icon: OndemandVideo,
    isPremium: false,
  },
  {
    id: 6,
    title: 'App Store Review',
    description: 'Leave a review for CMPapp on the App Store and earn bonus coins.',
    reward: 200,
    icon: StarRate,
    isPremium: true,
  },
];

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <PageTransition className="space-y-gutter">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary mb-4">Task Marketplace</h1>
        <p className="font-body-lg text-body-lg text-neo-text-secondary max-w-2xl">
          Complete verified tasks to earn premium rewards and build your creative capital. Watch out for Ad-Gated premium tasks for higher payouts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-4 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2 rounded-full font-body-md text-body-md whitespace-nowrap transition-all shadow-neu-flat hover:shadow-neu-raised-sm active:scale-95 ${
              tab === activeFilter
                ? 'bg-neo-primary text-white shadow-neu-raised-sm'
                : 'bg-neu-bg text-neo-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <StaggerContainer stagger={0.08}>
          {tasks.map((task) => {
            const Icon = task.icon;
            return (
              <StaggerItem key={task.id}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  <NeuCard padding="lg" interactive className="relative overflow-hidden h-full flex flex-col">
                    {task.isPremium && (
                      <div className="absolute top-0 right-0 bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg font-semibold shadow-neu-raised-sm">
                        PREMIUM
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4 mt-2">
                      <NeuIconBadge size="lg" className="shadow-neu-raised-sm">
                        <Icon className="w-6 h-6 text-neo-primary" />
                      </NeuIconBadge>
                      <NeuCard padding="none" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neu-bg shadow-neu-inset">
                        <span className="material-symbols-outlined text-neo-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                        <span className="font-data-md text-data-md text-neo-text-primary">{task.reward}</span>
                      </NeuCard>
                    </div>

                    <h3 className="font-h3 text-h3 text-neo-primary mb-2">{task.title}</h3>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary flex-1 mb-6">{task.description}</p>

                    <Button
                      size="lg"
                      className={`w-full gap-2 ${
                        task.isPremium
                          ? 'bg-neo-primary text-white hover:bg-neo-primary/90'
                          : 'bg-gradient-to-r from-neo-secondary to-neo-secondary/90 text-neo-primary hover:from-neo-secondary/90 hover:to-neo-secondary'
                      }`}
                    >
                      <span>Start Task</span>
                      {task.isPremium ? (
                        <LockOpen className="w-5 h-5" />
                      ) : (
                        <ArrowForward className="w-5 h-5" />
                      )}
                    </Button>
                  </NeuCard>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}