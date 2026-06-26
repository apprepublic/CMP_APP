'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Song } from '@/lib/queries';
import { logSongPlay } from '@/lib/queries';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';

interface PlayerState {
  current: Song | null;
  queue: Song[];
  index: number;
  isPlaying: boolean;
  progress: number; // seconds
  duration: number; // seconds
  volume: number; // 0..1
  play: (song: Song, queue?: Song[], taskInfo?: { id: string; isPosted: boolean; coinReward: number }) => void;
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
  const queryClient = useQueryClient();

  const [current, setCurrent] = useState<Song | null>(null);
  const [activeTask, setActiveTask] = useState<{ id: string; isPosted: boolean; coinReward: number } | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const currentRef = useRef<Song | null>(null);
  const activeTaskRef = useRef<{ id: string; isPosted: boolean; coinReward: number } | null>(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    activeTaskRef.current = activeTask;
  }, [activeTask]);

  const isAuthenticated = useUserStore((state: any) => state.isAuthenticated);

  // Stop music and reset player state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      setCurrent(null);
      setQueue([]);
      setIndex(0);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      setActiveTask(null);
      loggedRef.current = false;
    }
  }, [isAuthenticated]);

  // Create the audio element once (client only).
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTime = () => {
      setProgress(audio.currentTime);
      const curSong = currentRef.current;
      const actTask = activeTaskRef.current;
      // Stream-to-earn: log a qualifying play once we cross 30s.
      if (!loggedRef.current && audio.currentTime >= 30 && curSong) {
        loggedRef.current = true;
        logSongPlay(curSong.id, audio.currentTime).catch(() => {});

        // Complete the task!
        if (actTask) {
          const completePromise = actTask.isPosted
            ? api.completePostedTask(actTask.id, {
                platform: 'STREAM_MUSIC',
                submittedAt: new Date().toISOString(),
                comment: 'Automated stream completion'
              })
            : api.completeTask(actTask.id, false);

          completePromise
            .then(async () => {
              toast({
                title: 'Task Completed!',
                description: `Successfully streamed and earned ${actTask.coinReward} coins.`,
                variant: 'success',
              });
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.id) {
                  await api.updateTaskCompletionStreak(session.user.id);
                }
              } catch (e) {
                console.warn('[PlayerProvider] Failed to update streak:', e);
              }
              // Refresh wallet and streak everywhere in the app immediately
              queryClient.invalidateQueries({ queryKey: ['wallet'] });
              queryClient.invalidateQueries({ queryKey: ['streak'] });
            })
            .catch((err: any) => {
              console.error('Failed to complete streaming task:', err);
              toast({
                title: 'Task Completion Failed',
                description: err.message || 'Failed to complete streaming task.',
                variant: 'destructive',
              });
            });

          setActiveTask(null); // prevent duplicate submissions
        }
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
  }, []);

  const play = useCallback(
    (song: Song, q?: Song[], taskInfo?: { id: string; isPosted: boolean; coinReward: number }) => {
      const list = q && q.length ? q : [song];
      const i = Math.max(0, list.findIndex((s) => s.id === song.id));
      setQueue(list);
      playIndex(list, i === -1 ? 0 : i);
      setActiveTask(taskInfo || null);
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