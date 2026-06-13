'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { Song } from '@/lib/queries';
import { logSongPlay } from '@/lib/queries';

interface PlayerState {
  current: Song | null;
  queue: Song[];
  index: number;
  isPlaying: boolean;
  progress: number; // seconds
  duration: number; // seconds
  volume: number; // 0..1
  play: (song: Song, queue?: Song[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider>');
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loggedRef = useRef(false); // ensures one reward log per track play

  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  // Create the audio element once (client only).
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTime = () => {
      setProgress(audio.currentTime);
      // Stream-to-earn: log a qualifying play once we cross 30s.
      if (!loggedRef.current && audio.currentTime >= 30 && current) {
        loggedRef.current = true;
        logSongPlay(current.id, audio.currentTime).catch(() => {});
      }
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => nextRef.current();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playIndex = useCallback((q: Song[], i: number) => {
    const audio = audioRef.current;
    const song = q[i];
    if (!audio || !song) return;
    loggedRef.current = false;
    audio.src = song.audio_url;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    setCurrent(song);
    setIndex(i);
    setProgress(0);
  }, [playIndex]);

  const play = useCallback(
    (song: Song, q?: Song[]) => {
      const list = q && q.length ? q : [song];
      const i = Math.max(0, list.findIndex((s) => s.id === song.id));
      setQueue(list);
      playIndex(list, i === -1 ? 0 : i);
    },
    [playIndex]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [current]);

  const next = useCallback(() => {
    if (!queue.length) return;
    playIndex(queue, (index + 1) % queue.length);
  }, [queue, index, playIndex]);

  const prev = useCallback(() => {
    if (!queue.length) return;
    playIndex(queue, (index - 1 + queue.length) % queue.length);
  }, [queue, index, playIndex]);

  // keep a stable ref to next() for the 'ended' listener
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    const clamped = Math.min(1, Math.max(0, v));
    if (audio) audio.volume = clamped;
    setVolumeState(clamped);
  }, []);

  return (
    <PlayerContext.Provider
      value={{ current, queue, index, isPlaying, progress, duration, volume, play, toggle, next, prev, seek, setVolume }}
    >
      {children}
    </PlayerContext.Provider>
  );
}