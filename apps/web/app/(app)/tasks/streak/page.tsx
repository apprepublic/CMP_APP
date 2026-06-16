'use client';

import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Flame, CalendarDays, CalendarRange, CheckCircle, Circle, Snowflake, Coins } from 'lucide-react';

const weekDays = [
  { day: 'Mon', completed: true, reward: null },
  { day: 'Tue', completed: true, reward: null },
  { day: 'Wed', completed: true, reward: null },
  { day: 'Thu', completed: true, reward: null },
  { day: 'Fri', completed: false, current: true, reward: 50 },
  { day: 'Sat', completed: false, reward: null },
  { day: 'Sun', completed: false, milestone: true, reward: null },
];

const dailyTasks = [
  { id: 1, title: 'Listen to 3 new tracks', completed: true, reward: 10, icon: 'check_circle' },
  { id: 2, title: 'Share a playlist', completed: false, pending: true, reward: 25, icon: 'radio_button_unchecked' },
  { id: 3, title: 'Purchase a digital collectible', completed: false, pending: true, reward: 50, icon: 'radio_button_unchecked' },
];

const milestones = [
  { days: 7, reward: 2000, daysLeft: 2, title: '7 Day Streak', icon: CalendarDays },
  { days: 30, reward: 10000, daysLeft: 18, title: '30 Day Streak', icon: CalendarRange, locked: true },
];

export default function StreakPage() {
  return (
    <PageTransition className="space-y-gutter">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white w-full px-margin-mobile md:px-gutter py-12 lg:py-16 relative overflow-hidden shadow-neu-raised">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-label-caps text-label-caps text-neo-secondary mb-2 tracking-widest uppercase">Your Progress</p>
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-white mb-2">Daily Streak</h1>
              <p className="font-body-lg text-body-lg text-white/80 max-w-xl">Keep the momentum going. Complete daily tasks to build your streak and unlock exclusive rewards.</p>
            </div>
            <NeuCard padding="md" className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-neu-raised-sm">
              <div className="flex items-center gap-4">
                <NeuIconBadge size="lg" active className="bg-neo-secondary shadow-none">
                  <Flame className="w-6 h-6 text-neo-primary" />
                </NeuIconBadge>
                <div>
                  <p className="font-label-caps text-label-caps text-white/80 uppercase">Current Streak</p>
                  <p className="font-h2 text-h2 text-neo-secondary">12 Days</p>
                </div>
              </div>
            </NeuCard>
          </div>
        </div>
      </section>

      <div className="px-margin-mobile md:px-gutter py-8 max-w-container-max mx-auto space-y-8">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* The 7-Day Progress Track */}
          <div className="lg:col-span-2">
            <NeuCard padding="lg" className="shadow-neu-flat">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-h3 text-neo-text-primary">This Week</h3>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Day 5 of 7</span>
              </div>
              <div className="flex justify-between items-center relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-neu-bg shadow-neu-inset -z-10 -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-1/2 left-0 w-[57%] h-1 bg-neo-secondary -z-10 -translate-y-1/2 rounded-full shadow-neu-raised-sm"></div>

                {weekDays.map((day, index) => (
                  <div key={day.day} className="flex flex-col items-center gap-2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 400 }}
                      className={`rounded-full flex items-center justify-center border-2 border-white shadow-neu-raised-sm ${
                        day.completed
                          ? 'w-10 h-10 bg-neo-secondary'
                          : day.current
                          ? 'w-12 h-12 bg-neu-bg border-neo-secondary'
                          : day.milestone
                          ? 'w-10 h-10 bg-neu-bg border-dashed border-neo-secondary/50'
                          : 'w-10 h-10 bg-neu-bg'
                      }`}
                    >
                      {day.completed ? (
                        <span className="material-symbols-outlined text-neo-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : day.current ? (
                        <>
                          <NeuIconBadge size="sm" active className="bg-neo-secondary shadow-none p-0">
                            <Flame className="w-4 h-4 text-neo-primary" />
                          </NeuIconBadge>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neo-error rounded-full border-2 border-white"></div>
                        </>
                      ) : day.milestone ? (
                        <Coins className="w-4 h-4 text-neo-secondary/50" />
                      ) : (
                        <span className="font-data-md text-data-md text-neo-text-secondary text-xs">{day.reward}</span>
                      )}
                    </motion.div>
                    <span className={`font-label-caps text-label-caps ${
                      day.current ? 'text-neo-text-primary font-bold' : day.completed ? 'text-neo-text-secondary' : 'text-neo-text-muted'
                    }`}>{day.day}</span>
                  </div>
                ))}
              </div>
            </NeuCard>
          </div>

          {/* Milestone Rewards */}
          <div>
            <NeuCard padding="lg" className="shadow-neu-flat h-full">
              <h3 className="font-h3 text-h3 text-neo-text-primary mb-6">Milestones</h3>
              <div className="space-y-4">
                {milestones.map((milestone) => {
                  const Icon = milestone.icon;
                  return (
                    <NeuCard key={milestone.days} padding="md" interactive className={`flex items-center ${milestone.locked ? 'opacity-70' : ''}`}>
                      <NeuIconBadge size="md" active={milestone.locked} className={`mr-4 ${milestone.locked ? 'bg-neu-bg' : 'bg-neo-secondary/20'}`}>
                        <Icon className={`w-5 h-5 ${milestone.locked ? 'text-neo-text-secondary' : 'text-neo-secondary'}`} />
                      </NeuIconBadge>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md font-semibold text-neo-text-primary">{milestone.days} Day Streak</p>
                        <p className={`font-data-md text-data-md mt-1 ${milestone.locked ? 'text-neo-text-secondary' : 'text-neo-secondary'}`}>
                          🪙 {milestone.reward.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-label-caps text-label-caps text-neo-text-muted">{milestone.daysLeft} Days left</p>
                      </div>
                    </NeuCard>
                  );
                })}
              </div>
            </NeuCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Tasks */}
          <div className="lg:col-span-2">
            <NeuCard padding="lg" className="shadow-neu-flat">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-h3 text-neo-text-primary">Today's Tasks</h3>
                <NeuCard padding="none" className="bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-2 py-1 rounded shadow-neu-raised-sm font-semibold">
                  1/3 Completed
                </NeuCard>
              </div>
              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <NeuCard key={task.id} padding="md" interactive className={`flex items-center border-l-4 ${
                    task.completed
                      ? 'border-l-neo-success shadow-neu-flat'
                      : 'border-l-neu-bg shadow-neu-flat'
                  }`}>
                    <NeuIconBadge size="sm" active={task.completed} className="mr-4">
                      {task.completed ? (
                        <span className="material-symbols-outlined text-neo-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      ) : (
                        <Circle className="w-4 h-4 text-neo-text-muted" />
                      )}
                    </NeuIconBadge>
                    <div className="flex-1">
                      <p className={`font-body-md text-body-md font-semibold text-neo-text-primary ${
                        task.completed ? 'line-through text-neo-text-muted' : ''
                      }`}>{task.title}</p>
                    </div>
                    <span className={`font-data-md text-data-md ${task.completed ? 'text-neo-text-muted' : 'text-neo-secondary'}`}>
                      🪙 {task.reward}
                    </span>
                  </NeuCard>
                ))}
              </div>
            </NeuCard>
          </div>

          {/* Streak Freeze */}
          <div>
            <NeuCard padding="lg" className="bg-gradient-to-br from-neo-primary to-neo-primary/90 text-white relative overflow-hidden shadow-neu-raised h-full">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-h3 text-h3 text-white">Streak Freeze</h3>
                  <NeuIconBadge size="md" active className="bg-white/20 shadow-none">
                    <Snowflake className="w-5 h-5 text-neo-secondary" />
                  </NeuIconBadge>
                </div>
                <p className="font-body-sm text-body-sm text-white/80">Missed a day? Use a freeze to protect your hard-earned streak.</p>
              </div>
              <NeuCard padding="md" className="relative z-10 mt-auto bg-white/10 backdrop-blur-sm border border-white/20 shadow-neu-inset">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-caps text-label-caps text-white/80 uppercase">Inventory</span>
                  <span className="font-h3 text-h3 font-bold text-white">0</span>
                </div>
                <Button variant="outline" size="lg" className="w-full gap-2 bg-white text-neo-primary hover:bg-white/90">
                  <span>Buy for</span>
                  <span className="font-data-md text-data-md">🪙 500</span>
                </Button>
              </NeuCard>
            </NeuCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}