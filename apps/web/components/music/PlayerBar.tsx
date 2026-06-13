'use client';

import { usePlayer } from './PlayerProvider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerBar() {
  const { current, isPlaying, progress, duration, volume, toggle, next, prev, seek, setVolume } = usePlayer();

  // Nothing playing yet — render nothing so other pages aren't affected.
  if (!current) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[72px] md:bottom-0 left-0 w-full z-40 bg-neu-bg shadow-neu-raised border-t border-neu-bg-dark">
      {/* Seek bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Seek"
        className="absolute -top-1 left-0 w-full h-1 appearance-none bg-transparent cursor-pointer accent-neo-secondary"
        style={{ background: `linear-gradient(to right, var(--neo-secondary) ${pct}%, transparent ${pct}%)` }}
      />
      <div className="max-w-container-max mx-auto w-full px-4 md:px-gutter h-20 flex items-center justify-between gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-1/3 min-w-[140px]">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-neu-bg shadow-neu-raised-sm shrink-0">
            {current.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="w-full h-full object-cover" src={current.cover_url} alt={current.title} />
            )}
          </div>
          <div className="hidden sm:flex flex-col overflow-hidden">
            <span className="font-body-md text-body-md font-semibold text-neo-text-primary truncate">{current.title}</span>
            <span className="font-body-sm text-body-sm text-neo-text-secondary truncate">
              {current.artist?.stage_name ?? 'Unknown artist'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 md:gap-6 w-1/3">
          <button onClick={prev} aria-label="Previous" className="text-neo-text-primary hover:text-neo-secondary transition-colors p-2 active:scale-95">
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={toggle}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-neo-secondary shadow-neu-raised-sm text-neo-primary hover:scale-105 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button onClick={next} aria-label="Next" className="text-neo-text-primary hover:text-neo-secondary transition-colors p-2 active:scale-95">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Time + volume */}
        <div className="flex items-center justify-end gap-3 w-1/3 min-w-[120px]">
          <span className="hidden md:inline font-data-md text-data-md text-neo-text-secondary tabular-nums">
            {fmt(progress)} / {fmt(duration)}
          </span>
          <Volume2 className="w-5 h-5 text-neo-text-secondary shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-20 md:w-28 h-1 cursor-pointer accent-neo-secondary"
          />
        </div>
      </div>
    </div>
  );
}