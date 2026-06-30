'use client';

import Link from 'next/link';
import { useStreak, useDailyTasks, useBuyStreakFreeze } from '@/lib/hooks';

function buildWeekDays(dailyHistory: { date: string; completed: boolean }[]) {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const jsDay = today.getDay();
  const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;

  return dayLabels.map((label, index) => {
    const isMilestoneDay = index === 6;
    const isToday = index === mondayBasedToday;
    const isCompleted = dailyHistory[index]?.completed ?? false;

    return {
      day: label,
      completed: isCompleted && !isToday,
      current: isToday,
      milestone: isMilestoneDay && !isCompleted && !isToday,
      reward: isMilestoneDay ? null : 50,
    };
  });
}

const MILESTONES = [
  { days: 7, reward: 2000, label: '7 Day Streak', icon: 'calendar_view_week' },
  { days: 30, reward: 10000, label: '30 Day Streak', icon: 'calendar_month', page: '/tasks/milestone/30' },
  { days: 60, reward: 25000, label: '60 Day Titan', icon: 'military_tech', page: '/tasks/milestone/60' },
];

export default function StreakPage() {
  const { data: streakResp, isLoading: streakLoading } = useStreak();
  const { data: dailyResp, isLoading: tasksLoading } = useDailyTasks();
  const buyFreeze = useBuyStreakFreeze();

  const streak = streakResp?.streak;
  const dailyTasks = dailyResp?.tasks ?? [];

  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const freezesOwned = streak?.freezesOwned ?? 0;
  const tasksCompletedToday = streak?.tasksCompletedToday ?? 0;

  const weekDays = buildWeekDays(streak?.dailyHistory ?? []);
  const daysCompletedThisWeek = weekDays.filter(d => d.completed).length;
  const jsDay = new Date().getDay();
  const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;
  const dayOfWeek = mondayBasedToday + 1;

  const progressPercent = Math.round((daysCompletedThisWeek / 7) * 100);

  function getMilestoneStatus(milestoneDays: number) {
    if (currentStreak >= milestoneDays) return 'completed';
    return 'locked';
  }

  function getMilestoneDaysLeft(milestoneDays: number) {
    const left = milestoneDays - currentStreak;
    return left > 0 ? left : 0;
  }

  const dailyTasksForDisplay = dailyTasks;
  const completedCount = dailyTasksForDisplay.filter((t: any) => t.completedToday > 0).length;

  const handleBuyFreeze = async () => {
    try {
      await buyFreeze.mutateAsync();
    } catch {}
  };

  return (
    <div className="flex-1 w-full pb-24 lg:pb-8 min-h-screen">
      <section className="bg-primary-container text-on-primary w-full px-margin-mobile md:px-margin-desktop py-12 lg:py-16 relative overflow-hidden mb-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-label-caps text-label-caps text-secondary-fixed mb-2 tracking-widest uppercase">Your Progress</p>
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary mb-2">Daily Streak</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">Keep the momentum going. Complete daily tasks to build your streak and unlock exclusive rewards.</p>
            </div>
            <div className="flex items-center bg-surface-tint/30 backdrop-blur-sm rounded-xl p-4 border border-outline/20">
              <span className="material-symbols-outlined text-secondary-fixed text-4xl mr-4" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <div>
                <p className="font-label-caps text-label-caps text-on-primary-container uppercase">Current Streak</p>
                {streakLoading ? (
                  <div className="h-8 w-20 bg-on-primary-fixed-variant/20 animate-pulse rounded mt-1" />
                ) : (
                  <p className="font-h2 text-h2 text-secondary-fixed">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto space-y-8 px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-6 border border-outline-variant/30 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">This Week</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Day {dayOfWeek} of 7</span>
            </div>
            <div className="flex justify-between items-center relative overflow-x-auto pb-4">
              <div className="absolute top-1/2 left-0 w-full min-w-[300px] h-1 bg-surface-container-high -z-10 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-[#B8860B] -z-10 -translate-y-1/2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              
              {weekDays.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-2 z-10 px-2">
                  {day.completed ? (
                    <div className="w-10 h-10 rounded-full bg-[#B8860B] flex items-center justify-center border-2 border-surface-alt shadow-sm">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                  ) : day.current ? (
                    <div className="w-12 h-12 rounded-full bg-surface-alt border-2 border-[#B8860B] flex items-center justify-center shadow-md relative">
                      <span className="material-symbols-outlined text-[#B8860B] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-alert rounded-full border border-surface-alt"></div>
                    </div>
                  ) : day.milestone ? (
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-alt flex items-center justify-center border-dashed border-[#B8860B]/50">
                      <img src="/coin.png" alt="Coin" className="w-4 h-4 object-contain opacity-50" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-surface-alt">
                      <span className="font-data-md text-data-md text-on-surface-variant text-xs">{day.reward}</span>
                    </div>
                  )}
                  <span className={`font-label-caps text-label-caps ${day.current ? 'text-on-surface font-bold' : day.completed ? 'text-on-surface-variant' : 'text-outline'}`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-alt rounded-xl p-6 border border-outline-variant/30 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="font-h3 text-h3 text-on-surface mb-6">Milestones</h3>
            <div className="space-y-4 flex-1">
              {MILESTONES.map((milestone) => {
                const status = getMilestoneStatus(milestone.days);
                const daysLeft = getMilestoneDaysLeft(milestone.days);
                const isCompleted = status === 'completed';

                const content = (
                  <div className={`flex items-center p-3 bg-surface rounded-lg border border-outline/10 transition-colors ${isCompleted ? 'hover:bg-surface-container-lowest' : 'opacity-70'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-secondary-container/20' : 'bg-surface-container-high'}`}>
                      <span className={`material-symbols-outlined ${isCompleted ? 'text-[#B8860B]' : 'text-on-surface-variant'}`} style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : undefined}>{milestone.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-md text-body-md font-semibold text-on-surface">{milestone.label}</p>
                      <p className={`font-data-md text-data-md mt-1 ${isCompleted ? 'text-secondary' : 'text-on-surface-variant'}`}>🪙 {milestone.reward.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      {isCompleted ? (
                        <span className="font-label-caps text-label-caps text-success-verified flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Done
                        </span>
                      ) : (
                        <p className="font-label-caps text-label-caps text-outline">{daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} left</p>
                      )}
                    </div>
                  </div>
                );

                return isCompleted && milestone.page ? (
                  <Link key={milestone.days} href={milestone.page}>{content}</Link>
                ) : (
                  <div key={milestone.days}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Today's Tasks</h3>
              <span className="bg-[#B8860B] text-primary font-label-caps text-label-caps px-2 py-1 rounded">
                {completedCount}/{dailyTasksForDisplay.length} Completed
              </span>
            </div>
            <div className="max-h-[220px] overflow-y-auto space-y-3">
              {tasksLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-surface animate-pulse rounded-lg" />
                ))
              ) : dailyTasksForDisplay.length === 0 ? (
                <div className="py-8 text-center text-on-surface-variant">No tasks available today.</div>
              ) : (
                dailyTasksForDisplay.map((task: any) => {
                  const isArticle = task.linkedArticle?.slug;
                  const completed = task.completedToday > 0;
                  const content = (
                    <div className={`flex items-center p-4 bg-surface rounded-lg border-l-4 ${completed ? 'border-secondary' : 'border-outline/20'}`}>
                      <div className="mr-4">
                        <span className={`material-symbols-outlined ${completed ? 'text-secondary' : 'text-outline'}`}
                          style={completed ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          {completed ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md font-semibold text-on-surface">{task.title}</p>
                      </div>
                      <span className="font-data-md text-data-md text-[#B8860B]">🪙 {task.coinReward}</span>
                    </div>
                  );
                  if (completed) return <div key={task.id}>{content}</div>;
                  if (isArticle) return <Link key={task.id} href={`/articles/${isArticle}`}>{content}</Link>;
                  return <Link key={task.id} href="/tasks">{content}</Link>;
                })
              )}
            </div>
          </div>

          <div className="bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-h3 text-h3 text-on-primary">Streak Freeze</h3>
                <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container">Missed a day? Use a freeze to protect your hard-earned streak.</p>
            </div>
            <div className="relative z-10 mt-auto bg-surface-tint/20 rounded-lg p-4 border border-outline/20">
              <div className="flex justify-between items-center mb-4">
                <span className="font-label-caps text-label-caps text-on-primary-container uppercase">Inventory</span>
                <span className="font-h3 text-h3 font-bold text-on-primary">{freezesOwned}</span>
              </div>
              <button
                onClick={handleBuyFreeze}
                disabled={buyFreeze.isPending}
                className="w-full bg-surface text-primary font-body-md text-body-md font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyFreeze.isPending ? (
                  <span>Buying...</span>
                ) : (
                  <>
                    <span>Buy for</span>
                    <span className="font-data-md text-data-md">🪙 500</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Current</p>
            <p className="font-h2 text-h2 text-primary">{currentStreak}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">days</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Best</p>
            <p className="font-h2 text-h2 text-[#B8860B]">{longestStreak}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">days</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Next Milestone</p>
            <p className="font-h2 text-h2 text-primary-container">
              {currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 60 ? 60 : '✓'}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {currentStreak >= 60 ? 'All done!' : 'days'}
            </p>
          </div>
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Progress</p>
            <p className="font-h2 text-h2 text-success-verified">
              {currentStreak >= 60 ? 100 : Math.round((currentStreak / 60) * 100)}%
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">to Titan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
