'use client';

import Link from 'next/link';
import { useFeaturedSongs, useTasks, useStreak, useBuyStreakFreeze, useDailyTasks } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

function MobileDashboard() {
  const { data: songs = [], isLoading: songsLoading } = useFeaturedSongs();
  const { wallet, loading: walletLoading } = useWallet();
  const { user } = useUserStore();
  const { data: streakResp, isLoading: streakLoading } = useStreak();
  const { data: dailyResp } = useDailyTasks();

  const currentStreak = streakResp?.streak?.currentStreak ?? 0;
  const tasksCompletedToday = streakResp?.streak?.tasksCompletedToday ?? 0;
  const coinBalance = wallet?.balance ?? 0;
  const dailyTasks = dailyResp?.tasks ?? [];

  const [newTask, setNewTask] = useState<any>(null);
  const [newTaskCompleted, setNewTaskCompleted] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, description, coin_reward')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      if (!tasks || tasks.length === 0) { setNewTaskCompleted(true); return; }
      const latest = tasks[0];
      setNewTask(latest);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: completions } = await supabase
        .from('task_completions')
        .select('id')
        .eq('task_id', latest.id)
        .eq('user_id', user.id)
        .gte('last_completed_at', today.toISOString());
      setNewTaskCompleted((completions?.length ?? 0) > 0);
    })();
  }, [user?.id]);

  const { data: tasksResp, isLoading: tasksLoading } = useTasks();
  const totalTasks = tasksResp?.tasks?.length ?? 0;

  const weekDays = useMemo(() => {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const jsDay = today.getDay();
    const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;
    const history = streakResp?.streak?.dailyHistory ?? [];
    return dayLabels.map((label, index) => {
      const isToday = index === mondayBasedToday;
      const isCompleted = history[index]?.completed ?? false;
      return { day: label, completed: isCompleted && !isToday, current: isToday, index };
    });
  }, [streakResp?.streak?.dailyHistory]);

  const daysCompletedThisWeek = weekDays.filter(d => d.completed).length;
  const progressPercent = Math.round((daysCompletedThisWeek / 7) * 100);
  const daysToMilestone = 7 - daysCompletedThisWeek;

  const taskIcon = (type: string) => {
    if (!type) return 'quickreply';
    const t = type.toUpperCase();
    if (t === 'WATCH_VIDEO' || t === 'STREAM_MUSIC') return 'music_note';
    if (t === 'SHARE_SOCIAL' || t === 'SOCIAL_ENGAGEMENT') return 'share';
    if (t === 'COMPLETE_SURVEY') return 'poll';
    if (t === 'VOTE') return 'how_to_vote';
    if (t === 'CONTENT') return 'description';
    if (t === 'USER_CREATED') return 'person_add';
    return 'quickreply';
  };

  const tasksRemaining = Math.max(0, totalTasks - tasksCompletedToday);

  return (
    <div className="lg:hidden min-h-screen bg-surface pb-24">
      <main className="pt-2 px-4 flex flex-col gap-8 max-w-3xl mx-auto">
        {/* New Task Banner */}
        {newTask && !newTaskCompleted && (
          <section className="bg-surface-container-lowest rounded-lg p-4 flex items-start gap-3 relative overflow-hidden shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.12)] border-t border-[#B8860B]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#B8860B] opacity-10 rounded-bl-full"></div>
            <span className="material-symbols-outlined text-[#B8860B] mt-1">campaign</span>
            <div>
              <h2 className="font-body-lg text-body-lg text-on-background mb-1">New Task!</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Earn {newTask.coin_reward} coins by completing: {newTask.title}</p>
              <Link href="/tasks" className="mt-2 inline-block text-[#B8860B] font-label-caps text-label-caps hover:underline">View Details</Link>
            </div>
          </section>
        )}

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest rounded-lg p-4 flex flex-col justify-between shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)]">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <span className="font-label-caps text-label-caps">Total Balance</span>
            </div>
            {walletLoading ? (
              <div className="h-8 w-28 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="font-data-lg text-data-lg text-primary-container text-2xl">
                {coinBalance.toLocaleString()} <span className="text-sm text-on-surface-muted">CMP</span>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col justify-between shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)]">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-[#C62828]">local_fire_department</span>
              <span className="font-label-caps text-label-caps">Streak</span>
            </div>
            {streakLoading ? (
              <div className="h-8 w-16 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="font-data-lg text-data-lg text-primary-container text-xl">
                {currentStreak} <span className="text-sm text-on-surface-muted">Days</span>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col justify-between shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)]">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-[#2E7D32]">check_circle</span>
              <span className="font-label-caps text-label-caps">Tasks Left</span>
            </div>
            <div className="font-data-lg text-data-lg text-primary-container text-xl">
              {tasksRemaining}
            </div>
          </div>
        </section>

        {/* Daily Streak Progress */}
        <section className="bg-surface-container-lowest rounded-lg p-4 shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)]">
          <h3 className="font-h3 text-h3 text-primary-container mb-4">Daily Streak</h3>
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-surface-variant -z-10 -translate-y-1/2 rounded-full"></div>
            <div
              className="absolute top-1/2 left-4 h-1 bg-[#B8860B] -z-10 -translate-y-1/2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
            {weekDays.map((d) => (
              <div key={d.day + d.index} className="flex flex-col items-center gap-1">
                {d.completed ? (
                  <div className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                ) : d.current ? (
                  <div className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center shadow-md border-2 border-white ring-2 ring-[#B8860B]">
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  </div>
                ) : d.index === 6 ? (
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-[#B8860B] shadow-lg relative">
                    <span className="material-symbols-outlined text-[#B8860B] text-[20px]">redeem</span>
                    <div className="absolute -top-2 -right-2 bg-[#C62828] text-white text-[10px] font-bold px-1 rounded-full">1K</div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-outline-variant text-[16px]">lock</span>
                  </div>
                )}
                <span className="font-label-caps text-label-caps text-on-surface-variant">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-4">
            {daysToMilestone > 0
              ? `${daysToMilestone} more day${daysToMilestone > 1 ? 's' : ''} to unlock the 1,000 CMP bonus!`
              : 'Milestone reached! 🎉'}
          </p>
        </section>

        {/* Top Artists Horizontal Scroll */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-h3 text-h3 text-primary-container">Top Artists</h3>
            <Link href="/music" className="font-label-caps text-label-caps text-[#B8860B] hover:underline">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 pt-1 px-1 hide-scrollbar">
            {songsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-16 h-16 rounded-full bg-surface-dim animate-pulse" />
                    <div className="w-16 h-4 bg-surface-dim animate-pulse rounded" />
                  </div>
                ))
              : songs.slice(0, 5).map((song: any) => (
                  <Link key={song.id} href={`/music/artist/${song.artist?.slug || song.artist?.id || '#'}`} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#B8860B] to-[#f7bd48]">
                      {song.artist?.avatar_url ? (
                        <img src={song.artist.avatar_url} alt={song.artist.stage_name} className="w-full h-full object-cover rounded-full border-2 border-surface" />
                      ) : (
                        <div className="w-full h-full rounded-full border-2 border-surface bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">music_note</span>
                        </div>
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-center truncate w-full">{song.artist?.stage_name || 'Artist'}</span>
                  </Link>
                ))}
          </div>
        </section>

        {/* Daily Quick Tasks */}
        <section className="pb-8">
          <h3 className="font-h3 text-h3 text-primary-container mb-4">Quick Tasks</h3>
          <div className="flex flex-col gap-2">
            {dailyTasks.length === 0 ? (
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant py-4">No tasks available.</p>
            ) : (
              dailyTasks.slice(0, 5).map((task: any) => (
                <div key={task.id} className="bg-surface-container-lowest rounded-lg p-4 flex items-center justify-between shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${task.isLocked ? 'bg-surface-container' : 'bg-primary-fixed'} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${task.isLocked ? 'text-on-surface-variant' : 'text-primary-container'}`}>
                        {task.isLocked ? 'check_circle' : taskIcon(task.type)}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-body-md text-body-md text-on-surface font-semibold ${task.isLocked ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">+{task.coinReward} CMP</p>
                    </div>
                  </div>
                  {task.isLocked ? (
                    <button className="bg-surface-variant text-on-surface-muted px-4 py-2 rounded-lg font-label-caps text-label-caps cursor-not-allowed" disabled>Done</button>
                  ) : (
                    <Link href={task.linkedArticle?.slug ? `/tasks/article/${task.linkedArticle.slug}` : '/tasks'} className="bg-[#B8860B] text-primary px-4 py-2 rounded-lg font-label-caps text-label-caps transition-all shadow-[-2px_-2px_5px_rgba(255,255,255,0.4),2px_2px_5px_rgba(13,27,53,0.15)] border border-[#f7bd48] hover:brightness-110 active:scale-[0.98]">
                      Start
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { data: songs = [], isLoading: songsLoading } = useFeaturedSongs();
  const { data: tasksResp, isLoading: tasksLoading } = useTasks();
  const tasks = tasksResp?.tasks ?? [];
  const { wallet, loading: walletLoading } = useWallet();
  const { user } = useUserStore();

  const { data: streakResp, isLoading: streakLoading } = useStreak();
  const currentStreak = streakResp?.streak?.currentStreak ?? 0;
  const coinBalance = wallet?.balance ?? 0;

  const buyFreeze = useBuyStreakFreeze();
  const longestStreak = streakResp?.streak?.longestStreak ?? 0;
  const freezesOwned = streakResp?.streak?.freezesOwned ?? 0;
  const tasksCompletedToday = streakResp?.streak?.tasksCompletedToday ?? 0;

  const weekDays = useMemo(() => {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const jsDay = today.getDay();
    const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;
    const history = streakResp?.streak?.dailyHistory ?? [];
    return dayLabels.map((label, index) => {
      const isMilestoneDay = index === 6;
      const isToday = index === mondayBasedToday;
      const isCompleted = history[index]?.completed ?? false;
      return {
        day: label,
        completed: isCompleted && !isToday,
        current: isToday,
        milestone: isMilestoneDay && !isCompleted && !isToday,
      };
    });
  }, [streakResp?.streak?.dailyHistory]);

  const daysCompletedThisWeek = weekDays.filter(d => d.completed).length;
  const progressPercent = Math.round((daysCompletedThisWeek / 7) * 100);
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 60 ? 60 : null;
  const daysToMilestone = nextMilestone ? nextMilestone - currentStreak : 0;

  const [firstName, setFirstName] = useState(
    user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const authUser = data.user;
      if (authUser) {
        const meta = authUser.user_metadata;
        const name = meta?.full_name || meta?.displayName || authUser.email?.split('@')[0] || 'User';
        if (name && name !== 'User') {
          setFirstName(name.split(' ')[0]);
        }
      }
    });
  }, [user]);

  return (
    <>
      {/* Mobile Layout */}
      <MobileDashboard />

      {/* Desktop Layout */}
      <div className="hidden lg:block flex-1 w-full min-h-screen relative z-0">
        {/* Desktop Header Area */}
        <div className="h-64 bg-primary-container w-full relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-10 z-10">
            <h2 className="font-h1 text-h1 text-on-primary mb-2">Welcome Back, {firstName}.</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container">Let's grow your creative enterprise today.</p>
          </div>
        </div>

        <div className="px-margin-mobile md:px-margin-desktop py-8 lg:-mt-16 relative z-20 max-w-container-max mx-auto space-y-12">
          {/* Desktop Welcome (mobile fallback) */}
          <div className="lg:hidden mb-6 mt-4">
            <h2 className="font-h1-mobile text-h1-mobile text-on-surface">Hi, {firstName}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Here is your daily summary.</p>
          </div>

          {/* Power Row (Quick Stats) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span>Keep earning today</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Current Streak</span>
                <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              {streakLoading ? (
                <div className="h-10 w-24 bg-surface-dim animate-pulse rounded" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{currentStreak}</h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{currentStreak === 1 ? 'Day' : 'Days'}</span>
                </div>
              )}
              <div className="mt-4 w-full bg-surface-variant rounded-full h-2">
                <div className="bg-[#B8860B] h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}></div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-xs">
                {7 - (currentStreak % 7)} days to next milestone
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Tasks Remaining</span>
                <span className="material-symbols-outlined text-on-primary-fixed-variant">checklist</span>
              </div>
              {tasksLoading ? (
                <div className="h-10 w-24 bg-surface-dim animate-pulse rounded" />
              ) : (
                <div className="flex items-baseline gap-2">
<h3 className="font-data-lg text-data-lg text-h2 text-on-background">{Math.max(0, tasks.length - (streakResp?.streak?.tasksCompletedToday ?? 0))}</h3>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining</span>
                </div>
              )}
              <Link className="mt-4 inline-flex items-center gap-1 font-body-sm text-body-sm text-primary hover:text-[#B8860B] font-medium transition-colors" href="/tasks">
                Complete now <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Daily Streak & Rewards */}
          <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <h3 className="font-h3 text-h3 text-on-background">Daily Streak & Rewards</h3>
              </div>
              <Link href="/tasks/streak" className="text-sm text-secondary hover:underline font-body-md">View Details</Link>
            </div>

            {streakLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-surface-dim rounded-lg" />
                <div className="h-6 bg-surface-dim rounded-lg w-1/3" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-4 py-2 bg-[#B8860B]/10 rounded-lg border border-[#B8860B]/20">
                      <span className="material-symbols-outlined text-[#B8860B] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      <span>
                        <span className="font-h2 text-h2 text-[#B8860B]">{currentStreak}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">{currentStreak === 1 ? 'Day' : 'Days'}</span>
                      </span>
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      <span className="font-body-sm">Best: {longestStreak} days</span>
                      {freezesOwned > 0 && <span className="ml-3">❄️ {freezesOwned} freeze{freezesOwned > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{tasksCompletedToday} today</span>
                </div>

                <div className="flex justify-between items-center relative mb-6">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-high -z-10 -translate-y-1/2 rounded-full" />
                  <div className="absolute top-1/2 left-0 h-1 bg-[#B8860B] -z-10 -translate-y-1/2 rounded-full" style={{ width: `${progressPercent}%` }} />
                  {weekDays.map((day) => (
                    <div key={day.day} className="flex flex-col items-center gap-2 z-10">
                      {day.completed ? (
                        <div className="w-10 h-10 rounded-full bg-[#B8860B] flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      ) : day.current ? (
                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-[#B8860B] flex items-center justify-center shadow-md relative">
                          <span className="material-symbols-outlined text-[#B8860B] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-alert rounded-full border border-surface-container-lowest" />
                        </div>
                      ) : day.milestone ? (
                        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center border-dashed border-[#B8860B]/50">
                          <img src="/coin.png" alt="Coin" className="w-4 h-4 object-contain opacity-50" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-surface-container-lowest">
                          <span className="font-data-md text-data-md text-on-surface-variant text-xs">50</span>
                        </div>
                      )}
                      <span className={`font-label-caps text-label-caps ${day.current ? 'text-on-surface font-bold' : day.completed ? 'text-on-surface-variant' : 'text-outline'}`}>{day.day}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
                  <div className="text-sm text-on-surface-variant">
                    {nextMilestone ? (
                      <span><strong className="text-on-surface">{daysToMilestone} day{daysToMilestone > 1 ? 's' : ''}</strong> to {nextMilestone}-day milestone 🪙</span>
                    ) : (
                      <span className="text-success-verified">All milestones completed! 🎉</span>
                    )}
                  </div>
                  <button
                    onClick={() => { try { buyFreeze.mutateAsync(); } catch {} }}
                    disabled={buyFreeze.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">ac_unit</span>
                    Buy Freeze 🪙 500
                  </button>
                </div>
              </>
            )}
          </section>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Top Artists */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-h3 text-h3 text-on-background">Top Artists of the Week</h3>
                  <Link className="font-body-sm text-body-sm text-[#B8860B] hover:underline" href="/music">View All</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {songsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="min-w-[160px] bg-surface-container-lowest rounded-xl p-4 flex flex-col items-center gap-3 border border-outline-variant/30">
                        <div className="w-20 h-20 rounded-full bg-surface-dim animate-pulse" />
                        <div className="w-24 h-4 bg-surface-dim animate-pulse rounded" />
                      </div>
                    ))
                  ) : songs.length === 0 ? (
                    <div className="w-full text-center py-8 text-on-surface-variant">No top artists yet.</div>
                  ) : (
                    songs.slice(0, 4).map((song: any, i: number) => (
                      <Link href={`/music/artist/${song.artist?.slug || song.artist?.id || i}`} key={song.id || i} className="min-w-[160px] bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-xl p-4 flex flex-col items-center gap-3 snap-start hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-outline-variant">
                        <div className="w-20 h-20 rounded-full border-2 border-surface-container-highest overflow-hidden flex items-center justify-center bg-surface-dim">
                          {song.artist?.avatar_url ? (
                             <img src={song.artist.avatar_url} alt={song.artist.stage_name} className="w-full h-full object-cover" />
                          ) : (
                             <span className="material-symbols-outlined text-[32px] text-on-surface-variant">music_note</span>
                          )}
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
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 sticky top-24 shadow-[0_4px_20px_rgba(0,0,0,0.02)]" id="daily-tasks">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  <h3 className="font-h3 text-h3 text-on-background text-lg">Daily Quick Tasks</h3>
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
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-alt transition-colors group border border-transparent hover:border-outline-variant/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">
                              {task.type === 'WATCH_VIDEO' ? 'play_circle' : task.type === 'COMPLETE_SURVEY' ? 'poll' : task.type === 'SHARE_SOCIAL' ? 'share' : 'quickreply'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-medium text-on-background line-clamp-1">{task.title}</h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">+{task.coinReward} Coins</p>
                          </div>
                        </div>
                        <Link href="/tasks" className="bg-[#B8860B] hover:bg-[#8B6914] text-primary font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors shadow-sm ml-2 shrink-0">
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
    </>
  );
}
