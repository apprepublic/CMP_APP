'use client';

import Link from 'next/link';

const weekDays = [
  { day: 'Mon', completed: true, reward: null },
  { day: 'Tue', completed: true, reward: null },
  { day: 'Wed', completed: true, reward: null },
  { day: 'Thu', completed: true, reward: null },
  { day: 'Fri', completed: false, current: true, reward: 50 },
  { day: 'Sat', completed: false, reward: 50 },
  { day: 'Sun', completed: false, milestone: true, reward: null },
];

export default function StreakPage() {
  return (
    <div className="flex-1 w-full pb-24 lg:pb-8 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-container text-on-primary w-full px-margin-mobile md:px-margin-desktop py-12 lg:py-16 relative overflow-hidden -mx-margin-mobile lg:-mx-gutter lg:-mt-16 mb-8 w-[calc(100%+32px)] lg:w-[calc(100%+48px)]">
        {/* Background Texture */}
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
                <p className="font-h2 text-h2 text-secondary-fixed">12 Days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto space-y-8">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* The 7-Day Progress Track (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-6 border border-outline-variant/30 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">This Week</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Day 5 of 7</span>
            </div>
            <div className="flex justify-between items-center relative overflow-x-auto pb-4">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full min-w-[300px] h-1 bg-surface-container-high -z-10 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-[57%] h-1 bg-[#B8860B] -z-10 -translate-y-1/2 rounded-full"></div>
              
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
                      <span className="material-symbols-outlined text-[#B8860B]/50 text-sm">monetization_on</span>
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

          {/* Milestone Rewards */}
          <div className="bg-surface-alt rounded-xl p-6 border border-outline-variant/30 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="font-h3 text-h3 text-on-surface mb-6">Milestones</h3>
            <div className="space-y-4 flex-1">
              {/* 7 Day Milestone */}
              <div className="flex items-center p-3 bg-surface rounded-lg border border-outline/10">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_view_week</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md font-semibold text-on-surface">7 Day Streak</p>
                  <p className="font-data-md text-data-md text-secondary mt-1">🪙 2,000</p>
                </div>
                <div className="text-right">
                  <p className="font-label-caps text-label-caps text-outline">2 Days left</p>
                </div>
              </div>
              {/* 30 Day Milestone */}
              <div className="flex items-center p-3 bg-surface rounded-lg border border-outline/10 opacity-70">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mr-4">
                  <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md font-semibold text-on-surface">30 Day Streak</p>
                  <p className="font-data-md text-data-md text-on-surface-variant mt-1">🪙 10,000</p>
                </div>
                <div className="text-right">
                  <p className="font-label-caps text-label-caps text-outline">18 Days left</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Tasks */}
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Today's Tasks</h3>
              <span className="bg-[#B8860B] text-primary font-label-caps text-label-caps px-2 py-1 rounded">1/3 Completed</span>
            </div>
            <div className="space-y-3">
              {/* Task 1 (Completed) */}
              <div className="flex items-center p-4 bg-surface rounded-lg border-l-4 border-success-verified">
                <div className="mr-4">
                  <span className="material-symbols-outlined text-success-verified" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md font-semibold text-on-surface line-through text-outline">Listen to 3 new tracks</p>
                </div>
                <span className="font-data-md text-data-md text-outline">🪙 10</span>
              </div>
              {/* Task 2 (Pending) */}
              <div className="flex items-center p-4 bg-surface rounded-lg border-l-4 border-outline/20">
                <div className="mr-4">
                  <span className="material-symbols-outlined text-outline">radio_button_unchecked</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Share a playlist</p>
                </div>
                <span className="font-data-md text-data-md text-[#B8860B]">🪙 25</span>
              </div>
              {/* Task 3 (Pending) */}
              <div className="flex items-center p-4 bg-surface rounded-lg border-l-4 border-outline/20">
                <div className="mr-4">
                  <span className="material-symbols-outlined text-outline">radio_button_unchecked</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Purchase a digital collectible</p>
                </div>
                <span className="font-data-md text-data-md text-[#B8860B]">🪙 50</span>
              </div>
            </div>
          </div>

          {/* Streak Freeze */}
          <div className="bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            {/* Subtle pattern background */}
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
                <span className="font-h3 text-h3 font-bold text-on-primary">0</span>
              </div>
              <button className="w-full bg-surface text-primary font-body-md text-body-md font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
                <span>Buy for</span>
                <span className="font-data-md text-data-md">🪙 500</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}