'use client';

import Link from 'next/link';
import { useFeaturedSongs, useStores, useTasks } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

export default function DashboardPage() {
  const { data: songs = [], isLoading: songsLoading } = useFeaturedSongs();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { wallet, loading: walletLoading } = useWallet();
  const { user } = useUserStore();

  const displayName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  const coinBalance = wallet?.coin_balance ?? 0;
  const avatarUrl = user?.user_metadata?.avatar_url || null;

  return (
    <div className="flex-1 w-full pb-24 md:pb-0 min-h-screen relative z-0">
      {/* Desktop Header Area (Hero background) */}
      <div className="hidden lg:block h-64 bg-primary-container w-full relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-10">
          <div className="flex items-center gap-2 bg-surface-container-low/10 border-[1.5px] border-[#B8860B] rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-[#B8860B] text-lg">{coinBalance.toLocaleString()} Coins</span>
          </div>
          <button className="text-on-primary hover:text-[#B8860B] transition-colors relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="w-10 h-10 rounded-full border-2 border-outline overflow-hidden hover:border-[#B8860B] transition-colors bg-surface-dim">
            {avatarUrl ? (
              <img alt="User Profile" className="w-full h-full object-cover" src={avatarUrl} />
            ) : (
              <span className="material-symbols-outlined text-on-surface w-full h-full flex items-center justify-center">person</span>
            )}
          </button>
        </div>
        <div className="absolute bottom-12 left-10 z-10">
          <h2 className="font-h1 text-h1 text-on-primary mb-2">Welcome Back, {displayName}.</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container">Let's grow your creative enterprise today.</p>
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop py-8 lg:-mt-16 relative z-20 max-w-container-max mx-auto space-y-12">
        {/* Mobile Welcome */}
        <div className="lg:hidden mb-6 mt-4">
          <h2 className="font-h1-mobile text-h1-mobile text-on-surface">Hi, {displayName}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Here is your daily summary.</p>
        </div>

        {/* Power Row (Quick Stats) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/5 rounded-full blur-xl group-hover:bg-[#B8860B]/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Total Balance</span>
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            {walletLoading ? (
               <div className="h-10 w-32 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{coinBalance.toLocaleString()}</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Coins</span>
              </div>
            )}
            <div className="mt-4 flex items-center gap-1 text-success-verified font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+450 this week</span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Current Streak</span>
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-data-lg text-data-lg text-h2 text-on-background">12</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Days</span>
            </div>
            <div className="mt-4 w-full bg-surface-variant rounded-full h-2">
              <div className="bg-[#B8860B] h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-xs">2 days to next milestone</p>
          </div>

          {/* Tasks Remaining */}
          <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Tasks Remaining</span>
              <span className="material-symbols-outlined text-on-primary-fixed-variant">checklist</span>
            </div>
            {tasksLoading ? (
              <div className="h-10 w-24 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{tasks.length}</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tasks</span>
              </div>
            )}
            <Link className="mt-4 inline-flex items-center gap-1 font-body-sm text-body-sm text-primary hover:text-[#B8860B] font-medium transition-colors" href="/tasks">
              Complete now <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Featured & Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Top Artists of the Week */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-h3 text-on-background">Top Artists of the Week</h3>
                <Link className="font-body-sm text-body-sm text-[#B8860B] hover:underline" href="/music">View All</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {songsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[160px] bg-surface-container-lowest rounded-xl p-4 flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-surface-dim animate-pulse" />
                      <div className="w-24 h-4 bg-surface-dim animate-pulse rounded" />
                    </div>
                  ))
                ) : songs.length === 0 ? (
                  <div className="w-full text-center py-8 text-on-surface-variant">No top artists yet.</div>
                ) : (
                  songs.slice(0, 4).map((song: any, i: number) => (
                    <Link href={`/music/artist/${song.artist?.id || i}`} key={song.id || i} className="min-w-[160px] bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-xl p-4 flex flex-col items-center gap-3 snap-start hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-outline-variant">
                      <div className="w-20 h-20 rounded-full border-2 border-surface-container-highest overflow-hidden flex items-center justify-center bg-surface-dim">
                        <span className="material-symbols-outlined text-[32px] text-on-surface-variant">music_note</span>
                      </div>
                      <div className="text-center">
                        <h4 className="font-body-md text-body-md font-semibold text-on-background">{song.artist?.stage_name || 'Unknown Artist'}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">{song.genre || 'Music'}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* Featured Stores */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-h3 text-on-background">Featured Stores</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storesLoading ? (
                  <>
                    <div className="sm:col-span-2 h-48 rounded-xl bg-surface-dim animate-pulse" />
                    <div className="h-32 rounded-xl bg-surface-dim animate-pulse" />
                    <div className="h-32 rounded-xl bg-surface-dim animate-pulse" />
                  </>
                ) : stores.length === 0 ? (
                  <div className="sm:col-span-2 text-center py-8 text-on-surface-variant">No featured stores yet.</div>
                ) : (
                  <>
                    {stores.slice(0, 1).map((store: any) => (
                      <Link href={`/marketplace/store/${store.slug}`} key={store.id} className="sm:col-span-2 h-48 rounded-xl overflow-hidden relative group cursor-pointer bg-surface-alt">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6 z-10">
                          <span className="bg-[#B8860B] text-primary font-label-caps text-label-caps text-[10px] px-2 py-1 rounded w-fit mb-2">HOT DEAL</span>
                          <h4 className="font-h3 text-h3 text-on-primary">{store.name}</h4>
                          <p className="font-body-sm text-body-sm text-surface-dim mt-1">{store.description || 'Explore our featured store.'}</p>
                        </div>
                      </Link>
                    ))}
                    {stores.slice(1, 3).map((store: any) => (
                      <Link href={`/marketplace/store/${store.slug}`} key={store.id} className="h-32 rounded-xl overflow-hidden relative group cursor-pointer bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 hover:border-[#B8860B] transition-colors">
                        <div className="p-4 flex flex-col h-full justify-between">
                          <span className="material-symbols-outlined text-primary">storefront</span>
                          <div>
                            <h4 className="font-body-md text-body-md font-semibold text-on-background">{store.name}</h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs line-clamp-1">{store.description || 'Store'}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Daily Tasks */}
          <div className="lg:col-span-1">
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 sticky top-24 shadow-[0_4px_20px_rgba(0,0,0,0.02)]" id="daily-tasks">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                <h3 className="font-h3 text-h3 text-on-background text-lg">Daily Quick Earn</h3>
              </div>
              <div className="space-y-4">
                {tasksLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-surface-dim animate-pulse rounded-lg" />
                  ))
                ) : tasks.length === 0 ? (
                  <div className="text-center py-4 text-on-surface-variant">
                    <p>No tasks available right now.</p>
                  </div>
                ) : (
                  tasks.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-alt transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-sm">
                            {task.category === 'CONTENT' ? 'article' : task.category === 'ENGAGEMENT' ? 'play_circle' : 'share'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-body-md text-body-md font-medium text-on-background">{task.title}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">+{task.coin_reward} Coins</p>
                        </div>
                      </div>
                      <Link href="/tasks" className="bg-[#B8860B] hover:bg-[#8B6914] text-primary font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors">
                        Start
                      </Link>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Completing all tasks grants a bonus multiplier.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}