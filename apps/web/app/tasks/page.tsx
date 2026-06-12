'use client';

import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { PlayCircle, Newspaper, Share, Assignment, HowToVote } from 'lucide-react';

const tasks = [
  {
    id: 'featured',
    title: 'Watch Premium Trailer',
    description: "View the new 60s teaser for upcoming content to claim your massive reward.",
    reward: 500,
    icon: PlayCircle,
    featured: true,
  },
  {
    id: '1',
    title: 'Read Daily Article',
    description: 'Stay updated with the latest fintech news.',
    reward: 50,
    icon: Newspaper,
  },
  {
    id: '2',
    title: 'Social Repost',
    description: 'Share our latest update on your feed.',
    reward: 100,
    icon: Share,
  },
  {
    id: '3',
    title: 'User Feedback',
    description: 'Complete a 2-minute survey about the app.',
    reward: 250,
    icon: Assignment,
  },
  {
    id: '4',
    title: 'Feature Vote',
    description: 'Help us decide what to build next.',
    reward: 75,
    icon: HowToVote,
  },
];

const filters = ['All', 'News', 'Social', 'Surveys', 'Voting'];

export default function TasksPage() {
  const triggerAdGate = () => {
    const modal = document.getElementById('adGateModal');
    if (modal) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 3000);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-neu-bg pb-24 md:pb-8">
      {/* TopAppBar - Mobile */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat md:hidden">
        <div className="flex items-center gap-2">
          <NeuIconBadge size="sm" active className="bg-neo-primary shadow-none">
            <span className="text-sm font-bold text-white">U</span>
          </NeuIconBadge>
          <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
        </div>
        <button className="text-neo-text-secondary hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Desktop Navigation Cluster */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-40 bg-neu-bg shadow-neu-flat px-gutter py-4 justify-between items-center max-w-container-max mx-auto left-1/2 -translate-x-1/2">
        <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
        <div className="flex gap-8">
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary transition-colors flex items-center gap-2" href="/">
            <span className="material-symbols-outlined">home</span> Home
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-primary font-bold flex items-center gap-2" href="/tasks">
            <span className="material-symbols-outlined">payments</span> Earn
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary transition-colors flex items-center gap-2" href="/music">
            <span className="material-symbols-outlined">music_note</span> Music
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary transition-colors flex items-center gap-2" href="/marketplace">
            <span className="material-symbols-outlined">storefront</span> Market
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary transition-colors flex items-center gap-2" href="/wallet">
            <span className="material-symbols-outlined">account_balance_wallet</span> Wallet
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-neo-text-secondary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <NeuIconBadge size="md" active>
            <span className="text-sm font-bold text-white">U</span>
          </NeuIconBadge>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-[80px] md:pt-[120px] md:pb-stack-lg">
        {/* Header & Balance */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-h2 text-h2 text-neo-primary mb-2">Task Marketplace</h1>
            <p className="font-body-md text-body-md text-neo-text-secondary">Complete missions to earn rewards.</p>
          </div>
          <NeuCard padding="sm" className="flex items-center gap-4 shadow-neu-raised-sm">
            <span className="font-body-sm text-body-sm text-neo-text-secondary">Available</span>
            <NeuIconBadge size="md" active className="bg-neo-secondary">
              <span className="material-symbols-outlined text-neo-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </NeuIconBadge>
            <span className="font-data-lg text-data-lg text-neo-text-primary">1,250</span>
          </NeuCard>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`shrink-0 px-4 py-2 rounded-full font-label-caps text-label-caps transition-all active:scale-95 ${
                  index === 0
                    ? 'bg-neo-primary text-white shadow-neu-raised-sm'
                    : 'bg-neu-bg text-neo-text-secondary shadow-neu-flat hover:shadow-neu-raised-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid Tasks */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StaggerContainer stagger={0.06}>
            {tasks.map((task) => {
              const Icon = task.icon;
              return (
                <StaggerItem key={task.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <NeuCard
                      padding={task.featured ? 'lg' : 'md'}
                      interactive
                      className={`cursor-pointer group relative overflow-hidden ${
                        task.featured
                          ? 'col-span-1 md:col-span-2 bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white shadow-neu-raised'
                          : 'bg-neu-bg shadow-neu-flat'
                      }`}
                      onClick={triggerAdGate}
                    >
                      {task.featured && (
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Icon className="w-[120px] h-[120px] text-white" />
                        </div>
                      )}
                      <div className={`relative z-10 flex flex-col ${task.featured ? 'h-full justify-between gap-6' : ''}`}>
                        <div className="flex justify-between items-start">
                          {task.featured && (
                            <span className="bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-2 py-1 rounded-sm font-semibold">FEATURED</span>
                          )}
                          <NeuCard padding="none" className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${task.featured ? 'bg-white/10' : 'bg-neu-bg shadow-neu-inset'}`}>
                            <span className="material-symbols-outlined text-[14px] text-neo-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                            <span className={`font-data-md text-data-md ${task.featured ? 'text-white' : 'text-neo-text-primary'}`}>{task.reward}</span>
                          </NeuCard>
                        </div>
                        <div>
                          <NeuIconBadge
                            size="lg"
                            className={`mb-4 ${task.featured ? 'bg-white/20 text-white' : 'bg-neu-bg shadow-neu-raised-sm'}`}
                          >
                            <Icon className={`w-6 h-6 ${task.featured ? 'text-white' : 'text-neo-primary'}`} />
                          </NeuIconBadge>
                          <h2 className={`font-h3 text-h3 mb-2 ${task.featured ? 'text-white' : 'text-neo-text-primary'}`}>
                            {task.title}
                          </h2>
                          <p className={`font-body-sm text-body-sm ${task.featured ? 'text-white/80' : 'text-neo-text-secondary'}`}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </NeuCard>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised">
        <Link href="/" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-neo-primary text-white rounded-xl px-3 py-1 scale-90 transition-all shadow-neu-raised-sm">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
        </button>
        <Link href="/music" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">music_note</span>
          <span className="font-label-caps text-label-caps mt-1">Music</span>
        </Link>
        <Link href="/marketplace" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>

      {/* Ad-Gate Overlay Modal */}
      <div className="fixed inset-0 z-[100] hidden items-center justify-center bg-neo-primary/90 backdrop-blur-md transition-opacity opacity-0" id="adGateModal">
        <NeuCard padding="lg" className="max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-neu-raised relative" id="adGateContent">
          <div className="w-16 h-16 rounded-full border-4 border-neu-bg border-t-neo-secondary animate-spin mb-6"></div>
          <h2 className="font-h3 text-h3 text-neo-primary mb-2">Simulating Ad</h2>
          <p className="font-body-md text-body-md text-neo-text-secondary mb-8">Please wait while we verify your activity. Do not close this window.</p>
          <Button variant="outline" size="lg" className="w-full" onClick={() => document.getElementById('adGateModal')?.classList.add('hidden')}>
            Cancel
          </Button>
        </NeuCard>
      </div>
    </PageTransition>
  );
}