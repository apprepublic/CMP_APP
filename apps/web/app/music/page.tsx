'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, Play, Music as MusicIcon } from 'lucide-react';
import { useSongs, useFeaturedSongs, useArtists } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import type { Song } from '@/lib/queries';

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { play, current, isPlaying, progress, duration, toggle, next, prev } = usePlayer();

  const { data: songs = [], isLoading: songsLoading } = useSongs(
    searchQuery ? { search: searchQuery } : {}
  );
  const { data: featured = [] } = useFeaturedSongs();
  const { data: artists = [] } = useArtists();

  const hero = featured[0];
  const trending = useMemo(() => songs.slice(0, 12), [songs]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    songs.forEach((s) => s.genre && set.add(s.genre));
    return Array.from(set).slice(0, 6);
  }, [songs]);

  const playSong = (song: Song, list: Song[]) => play(song, list);

  return (
    <PageTransition className="min-h-screen bg-neu-bg pb-40 md:pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full shadow-neu-flat transition-colors text-neo-text-secondary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-[60px] max-w-container-max mx-auto md:px-gutter px-margin-mobile">
        {/* Search */}
        <section className="mb-6 mt-2">
          <div className="relative w-full max-w-2xl mx-auto">
            <Input
              placeholder="Find artists, songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5 text-neo-text-muted" />}
              className="pl-12"
            />
          </div>
        </section>

        {/* Featured hero */}
        {hero && (
          <section className="mb-8">
            <NeuCard
              padding="none"
              interactive
              onClick={() => playSong(hero, featured)}
              className="rounded-xl overflow-hidden bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white relative h-56 md:h-72 shadow-neu-raised cursor-pointer"
            >
              {hero.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" src={hero.cover_url} alt={hero.title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neo-primary via-neo-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                <div>
                  <span className="inline-block bg-neo-secondary/20 border border-neo-secondary rounded-full px-3 py-1 mb-3 font-label-caps text-label-caps text-neo-secondary tracking-wider">
                    Featured
                  </span>
                  <h2 className="font-h2 text-h2 text-white mb-1">{hero.title}</h2>
                  <p className="font-body-lg text-body-lg text-white/80">{hero.artist?.stage_name}</p>
                </div>
                <span className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-neo-secondary shadow-neu-raised-sm">
                  <Play className="w-6 h-6 text-neo-primary ml-0.5" />
                </span>
              </div>
            </NeuCard>
          </section>
        )}

        {/* Trending */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-h3 text-h3 text-neo-text-primary">Trending Now</h2>
          </div>

          {songsLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-none w-36 md:w-48 h-56 rounded-lg neo-skeleton" />
              ))}
            </div>
          ) : trending.length === 0 ? (
            <NeuCard className="text-center py-10 text-neo-text-secondary">No songs found.</NeuCard>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
              <StaggerContainer stagger={0.06}>
                {trending.map((song) => {
                  const active = current?.id === song.id && isPlaying;
                  return (
                    <StaggerItem key={song.id}>
                      <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                        <NeuCard
                          padding="none"
                          interactive
                          onClick={() => playSong(song, trending)}
                          className="flex-none w-36 md:w-48 rounded-lg border border-neu-bg-dark shadow-neu-flat cursor-pointer overflow-hidden"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            {song.cover_url && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img className="w-full h-full object-cover" src={song.cover_url} alt={song.title} />
                            )}
                            <div className="absolute inset-0 bg-neo-primary/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-neo-secondary shadow-neu-raised-sm">
                                <Play className="w-5 h-5 text-neo-primary ml-0.5" />
                              </span>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className={`font-body-md text-body-md font-semibold truncate ${active ? 'text-neo-secondary' : 'text-neo-text-primary'}`}>
                              {song.title}
                            </h3>
                            <p className="font-body-sm text-body-sm text-neo-text-secondary truncate">{song.artist?.stage_name}</p>
                          </div>
                        </NeuCard>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          )}
        </section>

        {/* Genres (derived from catalog) */}
        {genres.length > 0 && (
          <section className="mb-8">
            <h2 className="font-h3 text-h3 text-neo-text-primary mb-4">Explore Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSearchQuery('')}
                  className="relative rounded-xl overflow-hidden shadow-neu-flat border border-neu-bg-dark h-28 flex items-center justify-center bg-neu-bg"
                >
                  <NeuIconBadge size="md" active className="absolute left-3 top-3 bg-neo-secondary/20">
                    <MusicIcon className="w-5 h-5 text-neo-secondary" />
                  </NeuIconBadge>
                  <h3 className="font-h3 text-h3 text-neo-text-primary">{g}</h3>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Top artists */}
        {artists.length > 0 && (
          <section className="mb-8">
            <h2 className="font-h3 text-h3 text-neo-text-primary mb-4">Top Artists</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 hide-scrollbar">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/music/${artist.slug}`}
                  className="flex-none w-24 md:w-28 flex flex-col items-center gap-2 group"
                >
                  <NeuIconBadge size="lg" active className="overflow-hidden shadow-neu-raised-sm group-hover:border-2 group-hover:border-neo-secondary">
                    {artist.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="w-full h-full object-cover" src={artist.avatar_url} alt={artist.stage_name} />
                    )}
                  </NeuIconBadge>
                  <p className="font-body-sm text-body-sm font-semibold text-neo-text-primary truncate w-full text-center">
                    {artist.stage_name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Playback bar is rendered globally by <PlayerBar/> in providers.tsx */}

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised safe-area-bottom">
        <Link href="/" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined text-[24px]">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
        </Link>
        <button className="flex flex-col items-center bg-neo-secondary text-neo-primary rounded-xl px-3 py-1 shadow-neu-raised-sm">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
          <span className="font-label-caps text-label-caps mt-1 font-bold">Music</span>
        </button>
        <Link href="/marketplace" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined text-[24px]">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center text-neo-text-secondary px-3 py-1">
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>
    </PageTransition>
  );
}