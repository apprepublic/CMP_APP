'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSongs, useArtists } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import type { Song } from '@/lib/queries';

/** Isolated component so useSearchParams is inside a Suspense boundary */
function TaskAutoPlay() {
  const searchParams = useSearchParams();
  const { play, current, isPlaying } = usePlayer();

  useEffect(() => {
    const shouldPlay = searchParams?.get('play') === 'true';
    const audioUrl = searchParams?.get('audioUrl');
    if (shouldPlay && audioUrl) {
      if (current?.audio_url === audioUrl && isPlaying) return;

      const songId = searchParams?.get('songId') || 'temp-task-song';
      const taskId = searchParams?.get('taskId') || '';
      const title = searchParams?.get('title') || 'Stream Task Track';
      const coverUrl = searchParams?.get('coverUrl') || null;
      const coinReward = Number(searchParams?.get('coinReward') || 0);
      const isPosted = searchParams?.get('isPosted') === 'true';
      const isDownloadEnabled = searchParams?.get('isDownloadEnabled') === 'true';

      const songToPlay: Song = {
        id: songId,
        artist_id: 'task-creator',
        title,
        slug: 'task-track',
        description: 'Stream to earn coins',
        audio_url: audioUrl,
        cover_url: coverUrl,
        duration_seconds: 180,
        genre: null,
        coin_reward: coinReward,
        play_count: 0,
        is_featured: false,
        is_download_enabled: isDownloadEnabled,
        artist: { id: 'creator', stage_name: 'Task Artist', slug: 'task-artist', avatar_url: null, is_verified: false },
      };

      play(songToPlay, [], { id: taskId, isPosted, coinReward });
    }
  }, [searchParams, play, current, isPlaying]);

  return null;
}

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { play, current, isPlaying } = usePlayer();

  // Always fetch all songs (no filter) so genre pills are always fully populated
  const { data: allSongs = [] } = useSongs({});

  // Filtered songs — genre and search are SEPARATE params, not mixed together
  const { data: songs = [], isLoading: songsLoading, isError: songsError } = useSongs({
    genre: selectedGenre ?? undefined,
    search: searchQuery || undefined,
  });

  const { data: artists = [] } = useArtists();

  // Genre pills derived from unfiltered songs so they never disappear during a search
  const genres = useMemo(() => {
    const set = new Set<string>();
    allSongs.forEach((s) => s.genre && set.add(s.genre));
    return Array.from(set).slice(0, 10);
  }, [allSongs]);

  const playSong = (song: Song, list: Song[]) => {
    if ((song as any).taskId) {
      play(song, list, { id: (song as any).taskId, isPosted: true, coinReward: song.coin_reward });
    } else {
      play(song, list);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre(null);
  };

  const hasActiveFilters = !!(searchQuery || selectedGenre);

  return (
    <main className="flex-1 flex flex-col relative pb-[160px] lg:pb-[100px]">
      <Suspense fallback={null}>
        <TaskAutoPlay />
      </Suspense>

      <div className="p-margin-mobile lg:p-margin-desktop space-y-12 max-w-[1400px] mx-auto w-full">

        {/* Hero Search Section */}
        <section className="relative bg-primary-container rounded-2xl p-8 lg:p-12 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-h1-mobile lg:font-h1 text-h1-mobile lg:text-h1 text-on-primary">
              Discover the Sound of the Creative Economy
            </h2>
            <div className="w-full relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[28px] group-focus-within:text-secondary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find artists, songs, podcasts..."
                className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-primary placeholder-on-primary-container/70 rounded-xl pl-14 pr-12 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-primary-container/70 hover:text-on-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Genre Pills */}
        {genres.length > 0 && (
          <section>
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 shadow-sm transition-all ${
                  !selectedGenre
                    ? 'bg-secondary text-on-secondary border-secondary'
                    : 'bg-secondary-container text-on-secondary-container border-transparent hover:border-secondary/30'
                }`}
              >
                All Genres
              </button>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                  className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 transition-all ${
                    selectedGenre === g
                      ? 'bg-secondary text-on-secondary border-secondary shadow-md'
                      : 'bg-surface-alt text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high hover:border-secondary/40'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {/* Active filter indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {songsLoading ? 'Filtering…' : `${songs.length} result${songs.length !== 1 ? 's' : ''}`}
                  {selectedGenre && ` in ${selectedGenre}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
                <button
                  onClick={clearFilters}
                  className="font-body-sm text-body-sm text-secondary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Songs Section */}
        <section className="space-y-6">
          <h3 className="font-h3 text-h3 text-on-background">
            {selectedGenre ? `${selectedGenre} Music` : searchQuery ? 'Search Results' : 'Trending Now'}
          </h3>

          {songsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-surface-variant animate-pulse" />
              ))}
            </div>
          ) : songsError ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-error-alert mb-2 block">wifi_off</span>
              <p className="font-body-md text-on-surface-variant">Could not load songs. Please refresh the page.</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-4xl text-on-primary-container">
                  {hasActiveFilters ? 'search_off' : 'library_music'}
                </span>
              </div>
              <h4 className="font-h3 text-h3 text-on-background">
                {hasActiveFilters ? 'No matches found' : 'No songs yet'}
              </h4>
              <p className="font-body-md text-on-surface-variant max-w-sm">
                {hasActiveFilters
                  ? 'Try a different search term or select another genre.'
                  : 'The music catalogue is being built. Artists post tracks as Stream Music tasks — complete them to earn coins!'}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-body-md px-6 py-3 rounded-xl hover:bg-surface-container-highest transition-colors mt-2"
                >
                  <span className="material-symbols-outlined">close</span>
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-body-md px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors mt-2"
                >
                  <span className="material-symbols-outlined">task_alt</span>
                  Browse Stream Tasks
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
              {songs.map((song) => {
                const active = current?.id === song.id && isPlaying;
                return (
                  <div key={song.id} className="group cursor-pointer" onClick={() => playSong(song, songs)}>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-surface-variant shadow-sm group-hover:shadow-md transition-all">
                      {song.cover_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {active ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                      </div>
                      {/* Animated equalizer for currently playing song */}
                      {active && (
                        <div className="absolute bottom-2 left-2 flex items-end gap-0.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-1 bg-secondary rounded-full animate-bounce"
                              style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <h4 className={`font-body-md text-body-md font-semibold truncate ${active ? 'text-secondary' : 'text-on-background'}`}>
                      {song.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {song.artist?.stage_name || 'Unknown Artist'}
                    </p>
                    {song.genre && (
                      <span className="font-label-caps text-label-caps text-on-surface-variant/60 truncate block">{song.genre}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Emerging Talents */}
        {artists.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-h3 text-h3 text-on-background">Emerging Talents</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists[0] && (
                <Link href={`/music/${artists[0].slug}`} className="col-span-1 md:col-span-2 relative rounded-2xl overflow-hidden group h-64 md:h-80 shadow-sm cursor-pointer block">
                  {artists[0].avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artists[0].avatar_url} alt={artists[0].stage_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                    <div>
                      <span className="inline-block px-3 py-1 bg-secondary-container/90 backdrop-blur text-on-secondary-container font-label-caps text-label-caps rounded-full mb-3 shadow-sm border border-secondary/50">Spotlight</span>
                      <h4 className="font-h2 text-h2 text-on-primary mb-1">{artists[0].stage_name}</h4>
                      <p className="font-body-md text-on-primary/80">Check out their latest tracks</p>
                    </div>
                    <button className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg hover:bg-secondary-fixed transition-colors">
                      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                    </button>
                  </div>
                </Link>
              )}
              {artists.slice(1, 3).map((artist) => (
                <Link key={artist.id} href={`/music/${artist.slug}`} className="relative rounded-2xl overflow-hidden group h-64 md:h-80 bg-surface-alt shadow-sm border border-outline-variant/30 flex flex-col cursor-pointer hover:border-secondary transition-colors">
                  <div className="h-1/2 w-full relative overflow-hidden">
                    {artist.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={artist.avatar_url} alt={artist.stage_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between bg-surface-container-lowest">
                    <div>
                      <h4 className="font-h3 text-h3 text-on-background mb-1 group-hover:text-secondary transition-colors">{artist.stage_name}</h4>
                      <p className="font-body-sm text-on-surface-variant line-clamp-2">{artist.bio || 'Rising talent on CMPapp.'}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="font-label-caps text-label-caps text-secondary font-bold">View Profile</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}