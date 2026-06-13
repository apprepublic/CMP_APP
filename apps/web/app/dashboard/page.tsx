'use client';

import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Button } from '@/components/ui/button';
import { Wallet, Flame, ClipboardList, ArrowRight, Bell } from 'lucide-react';
import { useFeaturedSongs, useStores, useTasks } from '@/lib/hooks';
import { useUserStore } from '@/stores/userStore';

export default function DashboardPage() {
  const { data: songs = [], isLoading: songsLoading } = useFeaturedSongs();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { user } = useUserStore();

  // Placeholder until auth is fully wired
  const displayName = user?.displayName || '—';
  const coinBalance = user?.wallet?.coinBalance ?? null;
  const avatarUrl = user?.avatarUrl;

  return (
    <PageTransition className="space-y-12">
      {/* Desktop Header Area */}
      <NeuCard padding="none" className="hidden md:block h-64 w-full relative overflow-hidden flex-shrink-0 shadow-neu-raised">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neo-secondary via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-10">
          <NeuIconBadge size="md" className="flex items-center gap-2 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-neo-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-neo-secondary">
              {coinBalance !== null ? `${coinBalance.toLocaleString()} Coins` : '—'}
            </span>
          </NeuIconBadge>
          <NeuIconBadge size="md" active className="cursor-pointer relative">
            <Bell className="w-5 h-5 text-neo-text-primary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-neo-error rounded-full"></span>
          </NeuIconBadge>
          <NeuIconBadge size="md" className="cursor-pointer overflow-hidden p-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="User Profile" className="w-full h-full object-cover rounded-xl" src={avatarUrl} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neo-primary to-neo-secondary">
                <span className="font-h2 text-h2 text-white font-bold">{displayName?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            )}
          </NeuIconBadge>
        </div>
        <div className="absolute bottom-12 left-10 z-10">
          <h2 className="font-h1 text-h1 text-neo-text-primary mb-2">Welcome Back, {displayName}.</h2>
          <p className="font-body-lg text-body-lg text-neo-text-secondary">Let's grow your creative enterprise today.</p>
        </div>
      </NeuCard>

      {/* Mobile Welcome */}
      <div className="md:hidden mb-6 mt-4">
        <h2 className="font-h1-mobile text-h1-mobile text-neo-text-primary">Hi, {displayName}</h2>
        <p className="font-body-md text-body-md text-neo-text-secondary">Here is your daily summary.</p>
      </div>

      {/* Power Row (Quick Stats) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            <NeuCard padding="md" interactive>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-neo-text-secondary">Total Balance</span>
                <NeuIconBadge size="md">
                  <Wallet className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
              </div>
              {coinBalance !== null ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-data-lg text-data-lg text-h2 text-neo-text-primary">{coinBalance.toLocaleString()}</h3>
                    <span className="font-body-sm text-body-sm text-neo-text-secondary">Coins</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-neo-success font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+450 this week</span>
                  </div>
                </>
              ) : (
                <div className="h-8 w-32 neo-skeleton rounded" />
              )}
            </NeuCard>
          </StaggerItem>

          <StaggerItem>
            <NeuCard padding="md" interactive>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-neo-text-secondary">Current Streak</span>
                <NeuIconBadge size="md" active>
                  <Flame className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-neo-text-primary">—</h3>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Days</span>
              </div>
              <div className="mt-4">
                <NeuProgress value={0} showLabel size="sm" />
              </div>
              <p className="font-body-sm text-body-sm text-neo-text-secondary mt-2 text-xs">Start completing tasks to build your streak</p>
            </NeuCard>
          </StaggerItem>

          <StaggerItem>
            <NeuCard padding="md" interactive>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-neo-text-secondary">Tasks Remaining</span>
                <NeuIconBadge size="md">
                  <ClipboardList className="w-5 h-5 text-neo-primary" />
                </NeuIconBadge>
              </div>
              {tasksLoading ? (
                <div className="h-6 w-20 neo-skeleton rounded" />
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-data-lg text-data-lg text-h2 text-neo-text-primary">{tasks.length}</h3>
                    <span className="font-body-sm text-body-sm text-neo-text-secondary">Tasks</span>
                  </div>
                  <Link className="mt-4 inline-flex items-center gap-1 font-body-sm text-body-sm text-neo-primary hover:text-neo-secondary font-medium transition-colors" href="/dashboard/tasks">
                    Complete now <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </NeuCard>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Top Artists (from featured songs) */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-neo-text-primary">Featured Artists</h3>
              <Link className="font-body-sm text-body-sm text-neo-primary hover:underline" href="/dashboard/music">View All</Link>
            </div>
            {songsLoading ? (
              <div className="flex gap-4 overflow-x-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-none w-32 h-32 rounded-full neo-skeleton" />
                ))}
              </div>
            ) : songs.length === 0 ? (
              <NeuCard padding="md" className="text-center py-8 text-neo-text-secondary">
                No featured artists yet.
              </NeuCard>
            ) : (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
                {songs.slice(0, 4).map((song, i) => (
                  <NeuCard key={song.id || i} padding="md" interactive className="min-w-[160px] flex flex-col items-center gap-3 snap-start">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px] text-neo-text-muted">music_note</span>
                    </div>
                    <div className="text-center">
                      <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary">{song.artist?.stage_name || 'Unknown Artist'}</h4>
                      <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">{song.genre || 'Music'}</p>
                    </div>
                  </NeuCard>
                ))}
              </div>
            )}
          </section>

          {/* Featured Stores */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-neo-text-primary">Featured Stores</h3>
            </div>
            {storesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl neo-skeleton" />
                ))}
              </div>
            ) : stores.length === 0 ? (
              <NeuCard padding="md" className="text-center py-8 text-neo-text-secondary">
                No featured stores yet.
              </NeuCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stores.slice(0, 3).map((store, i) => (
                  <NeuCard
                    key={store.id}
                    padding="none"
                    interactive
                    className={`overflow-hidden relative ${i === 0 ? 'sm:col-span-2 h-48' : 'h-32'}`}
                  >
                    <Link href={`/dashboard/marketplace/store/${store.slug}`} className="absolute inset-0 z-10" />
                    {i === 0 ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <span className="neo-badge-secondary px-2 py-1 rounded w-fit mb-2 font-label-caps text-label-caps text-[10px]">FEATURED</span>
                          <h4 className="font-h3 text-h3 text-neo-text-primary">{store.name}</h4>
                          <p className="font-body-sm text-body-sm text-neo-text-secondary mt-1">{store.description || 'Explore our featured store'}</p>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 flex flex-col h-full justify-between">
                        <NeuIconBadge size="sm">
                          <span className="material-symbols-outlined text-neo-secondary">storefront</span>
                        </NeuIconBadge>
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary">{store.name}</h4>
                          <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">{store.description || 'Store'}</p>
                        </div>
                      </div>
                    )}
                  </NeuCard>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Daily Tasks */}
        <div className="lg:col-span-1">
          <NeuCard padding="md" className="sticky top-6" id="daily-tasks">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neo-bg-dark">
              <NeuIconBadge size="sm" active>
                <span className="material-symbols-outlined text-neo-secondary text-sm">task_alt</span>
              </NeuIconBadge>
              <h3 className="font-h3 text-h3 text-neo-text-primary text-lg">Daily Quick Earn</h3>
            </div>
            {tasksLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 neo-skeleton rounded" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-neo-text-secondary">
                <span className="material-symbols-outlined text-[32px] mb-2">task_alt</span>
                <p>No tasks available yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 3).map((task) => (
                  <NeuCard key={task.id} padding="sm" interactive className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <NeuIconBadge size="md" active>
                        <span className="material-symbols-outlined text-neo-primary text-sm">
                          {task.category === 'CONTENT' ? 'newspaper' : task.category === 'ENGAGEMENT' ? 'play_circle' : 'task'}
                        </span>
                      </NeuIconBadge>
                      <div>
                        <h4 className="font-body-md text-body-md font-medium text-neo-text-primary">{task.title}</h4>
                        <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">+{task.coin_reward} Coins</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href="/dashboard/tasks">Start</Link>
                    </Button>
                  </NeuCard>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-neo-bg-dark text-center">
              <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">Completing all tasks grants a bonus multiplier.</p>
            </div>
          </NeuCard>
        </div>
      </div>
    </PageTransition>
  );
}