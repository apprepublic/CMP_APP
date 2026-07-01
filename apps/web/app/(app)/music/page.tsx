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

function MobileMusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { play, current, isPlaying } = usePlayer();

  const { data: allSongs = [] } = useSongs({});
  const { data: songs = [], isLoading: songsLoading } = useSongs({
    genre: selectedGenre ?? undefined,
    search: searchQuery || undefined,
  });
  const { data: artists = [] } = useArtists();

  const genres = useMemo(() => {
    const set = new Set<string>();
    allSongs.forEach((s) => s.genre && set.add(s.genre));
    return Array.from(set).slice(0, 10);
  }, [allSongs]);

  const playSong = (song: Song, list: Song[]) => {
    if (song.taskId) {
      play(song, list, { id: song.taskId, isPosted: true, coinReward: song.coin_reward });
    } else {
      play(song, list);
    }
  };

  return (
    <div className="lg:hidden min-h-screen bg-surface pb-[160px]">
      <main className="pt-20 px-4 pb-8 min-h-screen">
        {/* Search Hero */}
        <section className="mt-4 mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-outline">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-outline-variant rounded-xl shadow-[inset_2px_2px_8px_rgba(13,27,53,0.05)] focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body-md font-body-md placeholder-on-surface-variant/50 text-on-surface outline-none"
              placeholder="Find artists, songs, podcasts..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <button className="text-primary hover:text-[#B8860B] transition-colors">
                <span className="material-symbols-outlined">mic</span>
              </button>
            </div>
          </div>
        </section>

        {/* Genre Pills */}
        <section className="mb-8">
          <h2 className="font-h3 text-h3 text-primary mb-2 px-1">Discover</h2>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar px-1 snap-x">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`snap-start whitespace-nowrap px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider active:scale-95 transition-all ${
                !selectedGenre
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-primary shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)] border border-white/20'
              }`}
            >
              For You
            </button>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                className={`snap-start whitespace-nowrap px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider active:scale-95 transition-all ${
                  selectedGenre === g
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-primary shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)] border border-white/20'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        {/* Trending Now Bento Grid */}
        <section className="mb-8">
          <h2 className="font-h3 text-h3 text-primary mb-4 px-1 flex items-center justify-between">
            Trending Now
            <span className="material-symbols-outlined text-[#B8860B] text-lg">local_fire_department</span>
          </h2>

          {songsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 row-span-2 aspect-square bg-surface-variant animate-pulse rounded-lg" />
              <div className="aspect-square bg-surface-variant animate-pulse rounded-lg" />
              <div className="aspect-square bg-surface-variant animate-pulse rounded-lg" />
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant">No songs found.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Featured (first song, large) */}
              <div
                className="col-span-2 row-span-2 bg-white rounded-lg overflow-hidden relative group cursor-pointer aspect-square shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)]"
                onClick={() => playSong(songs[0], songs)}
              >
                {songs[0].cover_url && (
                  <img src={songs[0].cover_url} alt={songs[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-[#B8860B]/30 flex items-center gap-1 shadow-sm">
                    {songs[0].coin_reward ? (
                      <>
                        <span className="material-symbols-outlined text-[#B8860B] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                        <span className="font-data-md text-xs text-white">Earn</span>
                      </>
                    ) : null}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-body-lg text-body-lg text-white font-bold leading-tight line-clamp-1">{songs[0].title}</h3>
                      <p className="font-body-sm text-body-sm text-surface-container-highest opacity-90">{songs[0].artist?.stage_name || 'Unknown'}</p>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-[#B8860B] text-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform flex-shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid items */}
              {songs.slice(1, 5).map((song) => {
                const active = current?.id === song.id && isPlaying;
                return (
                  <div
                    key={song.id}
                    className="bg-white rounded-lg overflow-hidden relative group cursor-pointer aspect-square shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)]"
                    onClick={() => playSong(song, songs)}
                  >
                    {song.cover_url ? (
                      <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">music_note</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                      {active ? (
                        <div className="absolute bottom-2 left-3 right-3 flex items-end gap-0.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-1 bg-[#B8860B] rounded-full animate-bounce" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      ) : null}
                      <h3 className="font-body-sm text-body-sm text-white font-bold truncate">{song.title}</h3>
                      <p className="font-label-caps text-[10px] text-surface-container-highest truncate">{song.artist?.stage_name || 'Unknown'}</p>
                      {song.coin_reward ? (
                        <div className="absolute top-2 right-2 flex items-center">
                          <span className="material-symbols-outlined text-[#B8860B] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Emerging Talents */}
        {artists.length > 0 && (
          <section>
            <h2 className="font-h3 text-h3 text-primary mb-4 px-1 flex items-center gap-2">
              Emerging Talents
              <span className="material-symbols-outlined text-primary text-lg">star</span>
            </h2>
            <div className="flex flex-col gap-4">
              {artists.slice(0, 4).map((artist) => (
                <Link
                  key={artist.id}
                  href={`/music/${artist.slug}`}
                  className="bg-white rounded-lg p-3 flex items-center gap-4 active:scale-[0.98] transition-transform shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_20px_rgba(13,27,53,0.08)] border-t-2 border-t-transparent hover:border-t-[#B8860B]/30"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    {artist.avatar_url ? (
                      <img src={artist.avatar_url} alt={artist.stage_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">person</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-body-lg text-body-lg text-primary font-semibold truncate">{artist.stage_name}</h4>
                      <span className="bg-primary-fixed-dim text-primary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">New</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-muted truncate">{artist.bio || 'Rising talent on CMPapp.'}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { play, current, isPlaying } = usePlayer();

  const { data: allSongs = [] } = useSongs({});
  const { data: songs = [], isLoading: songsLoading, isError: songsError } = useSongs({
    genre: selectedGenre ?? undefined,
    search: searchQuery || undefined,
  });
  const { data: artists = [] } = useArtists();

  const genres = useMemo(() => {
    const set = new Set<string>();
    allSongs.forEach((s) => s.genre && set.add(s.genre));
    return Array.from(set).slice(0, 10);
  }, [allSongs]);

  const playSong = (song: Song, list: Song[]) => {
    if (song.taskId) {
      play(song, list, { id: song.taskId, isPosted: true, coinReward: song.coin_reward });
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
    <>
      <Suspense fallback={null}>
        <TaskAutoPlay />
      </Suspense>

      {/* Mobile Layout */}
      <MobileMusicPage />

      {/* Desktop Layout */}
      <main className="hidden lg:block flex-1 flex flex-col relative pb-[100px]">
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
                  className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-surface placeholder-on-primary-container/70 rounded-xl pl-14 pr-12 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner outline-none"
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
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {songsLoading ? 'Filtering…' : `${songs.length} result${songs.length !== 1 ? 's' : ''}`}
                    {selectedGenre && ` in ${selectedGenre}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </span>
                  <button onClick={clearFilters} className="font-body-sm text-body-sm text-secondary hover:underline flex items-center gap-1">
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
                  <button onClick={clearFilters} className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-body-md px-6 py-3 rounded-xl hover:bg-surface-container-highest transition-colors mt-2">
                    <span className="material-symbols-outlined">close</span>
                    Clear filters
                  </button>
                ) : (
                  <Link href="/tasks" className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-body-md px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors mt-2">
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
                          <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {active ? 'pause' : 'play_arrow'}
                            </span>
                          </button>
                        </div>
                        {active && (
                          <div className="absolute bottom-2 left-2 flex items-end gap-0.5">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-1 bg-secondary rounded-full animate-bounce" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
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
    </>
  );
}
