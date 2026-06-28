'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLatestAnnouncement } from '@/lib/hooks';

export default function AnnouncementsBanner() {
  const [isClient, setIsClient] = useState(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setDismissedId(localStorage.getItem('dismissedTaskBannerId'));
  }, []);

  // Only run the query if we are on the client.
  // We can't really skip the query purely based on dismissedId because a NEW announcement might have a DIFFERENT id.
  // But by using React Query, this fetch is cached for 1 hour, so we don't spam Supabase on every route change!
  const { data: latestTask } = useLatestAnnouncement(isClient);

  if (!isClient || !latestTask) return null;
  if (dismissedId === latestTask.id) return null;

  const handleDismiss = () => {
    localStorage.setItem('dismissedTaskBannerId', latestTask.id);
    setDismissedId(latestTask.id);
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
