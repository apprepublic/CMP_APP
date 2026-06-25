'use client';

import { usePlayer } from './PlayerProvider';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { Shuffle, Repeat } from 'lucide-react';

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerBar() {
  const { current, isPlaying, progress, duration, volume, toggle, next, prev, seek, setVolume } = usePlayer();
  const { isCollapsed } = useSidebarStore();
  const isAuthenticated = useUserStore((state: any) => state.isAuthenticated);

  if (!isAuthenticated || !current) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-16 lg:bottom-0 z-30 bg-primary-container text-on-primary border-t border-outline/20 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ${
        isCollapsed
          ? 'w-full lg:w-[calc(100%-72px)] lg:left-[72px]'
          : 'w-full lg:w-[calc(100%-16rem)] lg:left-64'
      }`}
    >
      {/* Progress Bar — scoped to its own container, does NOT span the full bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant/20">
        <div className="h-full bg-secondary-container relative" style={{ width: `${pct}%` }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary-fixed rounded-full shadow-md pointer-events-none"></div>
        </div>
        {/* Seek input overlaid only on the 1px progress track */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
      </div>

      <div className="h-[72px] px-4 md:px-6 flex items-center justify-between">
        {/* Now Playing Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
          <div className="w-12 h-12 rounded bg-surface-variant overflow-hidden shrink-0 shadow-sm border border-outline/10">
            {current.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="w-full h-full object-cover" src={current.cover_url} alt={current.title} />
            )}
          </div>
          <div className="truncate hidden sm:block">
            <h5 className="font-body-md text-body-md font-semibold text-on-primary truncate">{current.title}</h5>
            <p className="font-body-sm text-body-sm text-on-primary-container truncate">{current.artist?.stage_name ?? 'Unknown artist'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 w-1/3">
          <button className="text-on-primary-container hover:text-secondary transition-colors hidden md:block" aria-label="Shuffle">
            <Shuffle className="w-5 h-5" />
          </button>
          <button onClick={prev} className="text-on-primary hover:text-secondary transition-colors" aria-label="Previous">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>skip_previous</span>
          </button>
          <button 
            onClick={toggle}
            className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary transition-colors hover:scale-105 shadow-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            )}
          </button>
          <button onClick={next} className="text-on-primary hover:text-secondary transition-colors" aria-label="Next">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>skip_next</span>
          </button>
          <button className="text-on-primary-container hover:text-secondary transition-colors hidden md:block" aria-label="Repeat">
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-end gap-4 w-1/3 text-on-primary-container hidden md:flex">
          <span className="font-data-md text-data-md tabular-nums">{fmt(progress)} / {fmt(duration)}</span>
          <button className="hover:text-secondary transition-colors" aria-label="Queue">
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
          </button>
          {/* Download button — only enabled when song permits download */}
          {current?.is_download_enabled ? (
            <a
              href={current.audio_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
              aria-label="Download song"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </a>
          ) : (
            <button
              disabled
              className="opacity-30 cursor-not-allowed"
              title="Download not available for this track"
              aria-label="Download unavailable"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
          )}
          <div className="flex items-center gap-2 w-24 relative">
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-1 bg-surface-variant/30 rounded-full w-full pointer-events-none">
              <div className="h-full bg-secondary-container rounded-full" style={{ width: `${volume * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}