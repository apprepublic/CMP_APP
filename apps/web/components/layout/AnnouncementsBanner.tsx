'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  coin_reward: number;
}

export default function AnnouncementsBanner() {
  const [latestTask, setLatestTask] = useState<Task | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLatestTask = async () => {
      // Get the latest active global task created within the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, coin_reward')
        .eq('is_active', true)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle() as any;

      if (!error && data) {
        const dismissedId = localStorage.getItem('dismissedTaskBannerId');
        if (dismissedId !== data.id) {
          setLatestTask(data);
          setIsVisible(true);
        }
      }
    };

    fetchLatestTask();
  }, []);

  if (!isVisible || !latestTask) return null;

  const handleDismiss = () => {
    localStorage.setItem('dismissedTaskBannerId', latestTask.id);
    setIsVisible(false);
  };

  return (
    <div className="bg-secondary-container/90 backdrop-blur-sm border-b border-outline-variant/30 text-on-secondary-container px-4 py-3 flex items-center justify-between shadow-sm relative z-40 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
        </div>
        <p className="font-body-sm text-sm">
          <strong>New Task!</strong> Earn <span className="font-bold text-primary">{latestTask.coin_reward} coins</span> by completing: 
          <Link href={`/tasks`} className="ml-1 underline hover:text-primary font-medium transition-colors">
            {latestTask.title}
          </Link>
        </p>
      </div>
      <button 
        onClick={handleDismiss}
        className="p-1.5 hover:bg-on-secondary-container/10 rounded-full transition-colors flex items-center justify-center text-on-surface-variant hover:text-on-surface"
        aria-label="Dismiss announcement"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
