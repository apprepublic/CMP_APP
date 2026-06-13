'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { motion } from 'framer-motion';
import { PlayCircle, Newspaper, Share, ClipboardList, Vote, Users, UserCheck, CheckCircle2 } from 'lucide-react';
import { useTasks } from '@/lib/hooks';
import type { Task } from '@/lib/queries';

// Map task category -> icon. New categories fall back to ClipboardList.
const CATEGORY_ICON: Record<string, typeof PlayCircle> = {
  CONTENT: Newspaper,
  ENGAGEMENT: PlayCircle,
  SOCIAL: Share,
  ONBOARDING: UserCheck,
  REFERRAL: Users,
  VOTING: Vote,
};

const FILTERS = ['All', 'CONTENT', 'ENGAGEMENT', 'SOCIAL', 'ONBOARDING', 'REFERRAL'];

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const [filter, setFilter] = useState('All');

  const visible = useMemo(
    () => (filter === 'All' ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter]
  );

  // The highest-reward task is featured.
  const featuredId = useMemo(
    () => tasks.slice().sort((a, b) => b.coin_reward - a.coin_reward)[0]?.id,
    [tasks]
  );

  return (
    <PageTransition className="min-h-screen bg-neu-bg pb-24 md:pb-8">
      {/* TopAppBar - Mobile */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat md:hidden">
        <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
        <button className="text-neo-text-secondary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-40 bg-neu-bg shadow-neu-flat px-gutter py-4 justify-between items-center">
        <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
        <div className="flex gap-8">
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary flex items-center gap-2" href="/">
            <span className="material-symbols-outlined">home</span> Home
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-primary font-bold flex items-center gap-2" href="/tasks">
            <span className="material-symbols-outlined">payments</span> Earn
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary flex items-center gap-2" href="/music">
            <span className="material-symbols-outlined">music_note</span> Music
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary flex items-center gap-2" href="/marketplace">
            <span className="material-symbols-outlined">storefront</span> Market
          </Link>
          <Link className="font-label-caps text-label-caps text-neo-text-secondary hover:text-neo-secondary flex items-center gap-2" href="/wallet">
            <span className="material-symbols-outlined">account_balance_wallet</span> Wallet
          </Link>
        </div>
        <button className="text-neo-text-secondary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </nav>

      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-[80px] md:pt-[120px]">
        <section className="mb-8">
          <h1 className="font-h2 text-h2 text-neo-primary mb-2">Task Marketplace</h1>
          <p className="font-body-md text-body-md text-neo-text-secondary">Complete missions to earn coins.</p>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-4 py-2 rounded-full font-label-caps text-label-caps transition-all active:scale-95 ${
                  filter === f
                    ? 'bg-neo-primary text-white shadow-neu-raised-sm'
                    : 'bg-neu-bg text-neo-text-secondary shadow-neu-flat hover:shadow-neu-raised-sm'
                }`}
              >
                {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Tasks */}
        {isLoading ? (
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 rounded-neo neo-skeleton" />
            ))}
          </section>
        ) : visible.length === 0 ? (
          <NeuCard className="text-center py-12 text-neo-text-secondary">No tasks in this category yet.</NeuCard>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StaggerContainer stagger={0.06}>
              {visible.map((task: Task) => {
                const Icon = CATEGORY_ICON[task.category] ?? ClipboardList;
                const featured = task.id === featuredId;
                // Content tasks deep-link to the article reader; others open in place.
                const href = task.category === 'CONTENT' ? '/tasks/article/beginners-guide-earning-coins-online' : undefined;
                const CardInner = (
                  <NeuCard
                    padding={featured ? 'lg' : 'md'}
                    interactive
                    className={`cursor-pointer group relative overflow-hidden h-full ${
                      featured
                        ? 'col-span-1 md:col-span-2 bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white shadow-neu-raised'
                        : 'bg-neu-bg shadow-neu-flat'
                    }`}
                  >
                    {featured && (
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icon className="w-[120px] h-[120px] text-white" />
                      </div>
                    )}
                    <div className={`relative z-10 flex flex-col ${featured ? 'h-full justify-between gap-6' : ''}`}>
                      <div className="flex justify-between items-start">
                        {featured && (
                          <span className="bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-2 py-1 rounded-sm font-semibold">
                            FEATURED
                          </span>
                        )}
                        <NeuCard padding="none" className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${featured ? 'bg-white/10' : 'bg-neu-bg shadow-neu-inset'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-neo-secondary" />
                          <span className={`font-data-md text-data-md ${featured ? 'text-white' : 'text-neo-text-primary'}`}>{task.coin_reward}</span>
                        </NeuCard>
                      </div>
                      <div>
                        <NeuIconBadge size="lg" className={`mb-4 ${featured ? 'bg-white/20 text-white' : 'bg-neu-bg shadow-neu-raised-sm'}`}>
                          <Icon className={`w-6 h-6 ${featured ? 'text-white' : 'text-neo-primary'}`} />
                        </NeuIconBadge>
                        <h2 className={`font-h3 text-h3 mb-2 ${featured ? 'text-white' : 'text-neo-text-primary'}`}>{task.title}</h2>
                        <p className={`font-body-sm text-body-sm ${featured ? 'text-white/80' : 'text-neo-text-secondary'}`}>{task.description}</p>
                      </div>
                    </div>
                  </NeuCard>
                );

                return (
                  <StaggerItem key={task.id}>
                    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="h-full">
                      {href ? <Link href={href} className="block h-full">{CardInner}</Link> : CardInner}
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        )}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised safe-area-bottom">
        <Link href="/" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <button className="flex flex-col items-center bg-neo-primary text-white rounded-xl px-3 py-1 shadow-neu-raised-sm">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
        </button>
        <Link href="/music" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined">music_note</span>
          <span className="font-label-caps text-label-caps mt-1">Music</span>
        </Link>
        <Link href="/marketplace" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>
    </PageTransition>
  );
}