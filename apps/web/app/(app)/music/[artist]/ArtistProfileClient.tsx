'use client';

import { useState } from 'react';
import { useArtist } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import type { Song } from '@/lib/queries';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ArtistProfileClient({ slug }: { slug: string }) {
  const { data, isLoading } = useArtist(slug);
  const { play, current, isPlaying, toggle } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 pb-24">
        <div className="h-[300px] md:h-[400px] bg-surface-variant rounded-2xl" />
        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop space-y-6">
          <div className="h-8 w-48 bg-surface-variant rounded-lg" />
          <div className="h-64 bg-surface-variant rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4">person_off</span>
        <h2 className="font-h3 text-h3 text-on-background mb-2">Artist not found</h2>
        <p className="font-body-md text-on-surface-variant">The artist you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  const { artist, songs } = data;

  const playSong = (song: Song, list: Song[]) => {
    if (song.taskId) {
      play(song, list, { id: song.taskId, isPosted: true, coinReward: song.coin_reward });
    } else {
      play(song, list);
    }
  };

  const togglePlay = (song: Song, list: Song[]) => {
    if (current?.id === song.id) {
      toggle();
    } else {
      playSong(song, list);
    }
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative bg-primary-container text-on-primary overflow-hidden">
        <div className="h-48 md:h-72 w-full bg-gradient-to-br from-primary via-primary-container to-secondary-fixed/20 relative">
          {artist.cover_url && (
            <img alt="" className="w-full h-full object-cover opacity-60" src={artist.cover_url} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/70 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10 -mt-20 md:-mt-28">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-secondary-fixed shadow-2xl shrink-0 bg-surface-variant">
              {artist.avatar_url ? (
                <img className="w-full h-full object-cover" src={artist.avatar_url} alt={artist.stage_name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-secondary-fixed">
                  <span className="material-symbols-outlined text-[48px]">person</span>
                </div>
              )}
            </div>

            <div className="flex-grow pb-4">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-secondary-fixed">{artist.stage_name}</h1>
                {artist.is_verified && (
                  <span className="bg-success-verified/20 text-success-verified px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Verified
                  </span>
                )}
              </div>
              {artist.bio && (
                <p className="font-body-lg text-on-primary-container max-w-2xl mb-6">{artist.bio}</p>
              )}
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <span className="font-label-caps text-on-primary-container">Followers</span>
                  <span className="font-data-lg text-h3 text-white block">{formatNumber(artist.follower_count)}</span>
                </div>
                <div className="w-px h-10 bg-outline-variant/20" />
                <div>
                  <span className="font-label-caps text-on-primary-container">Total Streams</span>
                  <span className="font-data-lg text-h3 text-white block">{formatNumber(artist.monthly_listeners)}</span>
                </div>
                <div className="w-px h-10 bg-outline-variant/20" />
                <div>
                  <span className="font-label-caps text-on-primary-container">Genre</span>
                  <span className="font-data-lg text-h3 text-secondary-fixed block">{artist.genre || 'Various'}</span>
                </div>
                <div className="flex gap-4 ml-auto">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2 ${
                      isFollowing
                        ? 'bg-white/10 text-white border border-secondary-fixed'
                        : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed'
                    }`}
                  >
                    <span className="material-symbols-outlined">{isFollowing ? 'check' : 'person_add'}</span>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="bg-white/10 text-white p-3 rounded-lg hover:bg-white/20 transition-all">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracks List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-h3 text-h3 text-on-background">Popular Tracks</h2>
              </div>

              {songs.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] mb-2">music_note</span>
                  <p>No tracks available yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {songs.map((track, index) => {
                    const active = current?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => togglePlay(track, songs)}
                        className={`group flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                          active ? 'bg-secondary-container/20' : 'hover:bg-surface-alt'
                        }`}
                      >
                        <span className="font-data-md text-on-surface-variant w-4 text-center">{index + 1}</span>
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant flex items-center justify-center">
                          {track.cover_url ? (
                            <img className="w-full h-full object-cover" src={track.cover_url} alt="" />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant">music_note</span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className={`font-body-md font-bold truncate transition-colors ${
                            active ? 'text-secondary' : 'text-on-background group-hover:text-secondary'
                          }`}>
                            {track.title}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                              <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                              <span className="font-data-md">{formatNumber(track.play_count)}</span>
                            </div>
                            {track.coin_reward > 0 && (
                              <div className="flex items-center gap-1 border border-secondary-fixed/50 px-2 py-0.5 rounded-full bg-secondary-fixed/10">
                                <span className="material-symbols-outlined text-[14px] text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                                <span className="font-data-md text-[10px] text-on-secondary-container">+{track.coin_reward} CMP</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePlay(track, songs); }}
                          className="bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-primary/80"
                        >
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: active && isPlaying ? "'FILL' 1" : "'FILL' 0" }}>
                            {active && isPlaying ? 'pause_circle' : 'play_circle'}
                          </span>
                        </button>
                        <span className="font-data-md text-on-surface-variant hidden md:block shrink-0">{formatDuration(track.duration_seconds)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            {/* Stream & Earn CTA */}
            <div className="bg-primary-container rounded-xl p-6 border-2 border-secondary-fixed/30 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-secondary-fixed">monetization_on</span>
              </div>
              <h3 className="font-h3 text-white mb-2 relative z-10">Stream &amp; Earn</h3>
              <p className="text-on-primary-container text-sm mb-6 relative z-10">
                Support {artist.stage_name} while earning CMP tokens. Every listen contributes to their growth and your wallet.
              </p>
              {songs.length > 0 && (
                <button
                  onClick={() => playSong(songs[0], songs)}
                  className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-on-secondary-fixed-variant transition-all relative z-10 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Start Session
                </button>
              )}
            </div>

            {/* Socials & Links */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <h3 className="font-h3 text-on-background mb-4 text-[20px]">Connect</h3>
              <div className="flex flex-col gap-4">
                <a className="flex items-center justify-between p-3 border border-outline-variant/30 rounded-lg hover:border-secondary-fixed transition-colors" href="#">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">language</span>
                    </div>
                    <span className="font-body-md font-semibold text-on-background">Instagram</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">open_in_new</span>
                </a>
                <a className="flex items-center justify-between p-3 border border-outline-variant/30 rounded-lg hover:border-secondary-fixed transition-colors" href="#">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">music_note</span>
                    </div>
                    <span className="font-body-md font-semibold text-on-background">TikTok</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">open_in_new</span>
                </a>
                <a className="flex items-center justify-between p-3 border border-outline-variant/30 rounded-lg hover:border-secondary-fixed transition-colors" href="#">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">podcasts</span>
                    </div>
                    <span className="font-body-md font-semibold text-on-background">Spotify</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
