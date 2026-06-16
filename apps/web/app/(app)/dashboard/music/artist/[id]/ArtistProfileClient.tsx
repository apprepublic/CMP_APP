'use client';

import Link from 'next/link';
import { useArtist } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Pause, Download, UserPlus, UserMinus, Music, PlayCircle, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function ArtistProfileClient({ slug }: { slug: string }) {
  const { data, isLoading } = useArtist(slug);
  const { play, current, isPlaying } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen bg-neu-bg">
        <NeuCard padding="none" className="relative overflow-hidden shadow-neu-raised">
          <div className="h-64 md:h-80 w-full bg-neu-bg relative">
            <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 via-neo-primary/60 to-transparent"></div>
          </div>
          <div className="px-margin-mobile lg:px-gutter -mt-16 relative z-10 pb-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full neo-skeleton" />
              <div className="h-10 w-48 neo-skeleton rounded" />
            </div>
            <div className="h-24 neo-skeleton rounded" />
          </div>
        </NeuCard>
        <section className="px-margin-mobile lg:px-gutter py-12">
          <div className="h-10 w-40 neo-skeleton rounded mb-6" />
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 neo-skeleton rounded" />
            ))}
          </div>
        </section>
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition className="min-h-screen bg-neu-bg">
        <div className="text-center py-20 text-neo-text-secondary">
          <span className="material-symbols-outlined text-[64px] mb-4">person</span>
          <h2 className="font-h3 text-h3 text-neo-text-primary mb-2">Artist not found</h2>
          <p>The artist you're looking for doesn't exist or has been removed.</p>
        </div>
      </PageTransition>
    );
  }

  const { artist, songs } = data;

  return (
    <PageTransition className="min-h-screen bg-neu-bg">
      {/* Hero Section */}
      <NeuCard padding="none" className="relative overflow-hidden shadow-neu-raised">
        <div className="h-64 md:h-80 w-full bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20 relative">
          {artist.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Artist Cover" className="w-full h-full object-cover opacity-80" src={artist.cover_url} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 via-neo-primary/60 to-transparent"></div>
        </div>

        <div className="px-margin-mobile lg:px-gutter -mt-16 relative z-10 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <NeuIconBadge size="lg" active className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-neu-bg shadow-neu-raised overflow-hidden p-0 bg-gradient-to-br from-neo-secondary to-neo-primary flex items-center justify-center">
                {artist.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="w-full h-full object-cover" src={artist.avatar_url} alt={artist.stage_name} />
                ) : (
                  <span className="font-h1 text-h1 text-white font-bold">{artist.stage_name?.[0]?.toUpperCase() || 'A'}</span>
                )}
              </NeuIconBadge>
              <div className="text-center md:text-left mb-2">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary">{artist.stage_name}</h1>
                  {artist.is_verified && (
                    <NeuIconBadge size="sm" active className="bg-blue-500/20 p-0">
                      <span className="material-symbols-outlined text-[16px] text-blue-500">verified</span>
                    </NeuIconBadge>
                  )}
                </div>
                {artist.genre && (
                  <p className="font-body-lg text-body-lg text-neo-secondary mt-1">{artist.genre}</p>
                )}
              </div>
            </div>
            <Button
              size="lg"
              variant={isFollowing ? 'outline' : 'default'}
              onClick={() => setIsFollowing(!isFollowing)}
              className="gap-2 shadow-neu-raised-sm w-full md:w-auto"
            >
              {isFollowing ? (
                <>
                  <UserMinus className="w-5 h-5" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Follow
                </>
              )}
            </Button>
          </div>

          {artist.bio && (
            <div className="mt-8 max-w-3xl">
              <p className="font-body-md text-body-md text-neo-text-secondary">{artist.bio}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 border-t border-neu-bg-dark pt-6">
            <StaggerContainer stagger={0.1}>
              <StaggerItem>
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                    <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
                      <PlayCircle className="w-4 h-4 text-neo-secondary" />
                    </NeuIconBadge>
                    <p className="font-label-caps text-label-caps text-neo-text-secondary">Total Streams</p>
                  </div>
                  <p className="font-data-lg text-data-lg text-neo-text-primary">{formatNumber(artist.monthly_listeners)}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                    <NeuIconBadge size="sm" active>
                      <Users className="w-4 h-4 text-neo-text-primary" />
                    </NeuIconBadge>
                    <p className="font-label-caps text-label-caps text-neo-text-secondary">Followers</p>
                  </div>
                  <p className="font-data-lg text-data-lg text-neo-text-primary">{formatNumber(artist.follower_count)}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                    <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
                      <TrendingUp className="w-4 h-4 text-neo-secondary" />
                    </NeuIconBadge>
                    <p className="font-label-caps text-label-caps text-neo-text-secondary">Monthly Listeners</p>
                  </div>
                  <p className="font-data-lg text-data-lg text-neo-text-primary">{formatNumber(artist.monthly_listeners)}</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </NeuCard>

      {/* Song List Section */}
      <section className="px-margin-mobile lg:px-gutter py-12 max-w-container-max mx-auto">
        <h3 className="font-h3 text-h3 text-neo-text-primary mb-6">Popular Tracks</h3>
        {songs.length === 0 ? (
          <NeuCard padding="lg" className="shadow-neu-flat text-center py-10 text-neo-text-secondary">
            <span className="material-symbols-outlined text-[48px] mb-2">music_note</span>
            <p>No tracks available yet.</p>
          </NeuCard>
        ) : (
          <NeuCard padding="none" className="shadow-neu-flat overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-neu-bg-dark text-neo-text-secondary font-label-caps text-label-caps">
              <div className="w-8 text-center">#</div>
              <div>Song Title</div>
              <div className="hidden sm:block">Duration</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-neu-bg-dark/50">
              {songs.map((track, index) => {
                const active = current?.id === track.id && isPlaying;
                return (
                  <motion.div 
                    key={track.id} 
                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-neu-bg transition-colors group ${active ? 'bg-neu-bg/50' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-8 text-center font-data-md text-data-md text-neo-text-secondary">{index + 1}</div>
                    <div className="flex items-center gap-4">
                      {track.cover_url ? (
                        <NeuCard padding="none" className="w-12 h-12 rounded bg-neu-bg shadow-neu-flat overflow-hidden">
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="w-full h-full object-cover" src={track.cover_url} alt={track.title} />
                        </NeuCard>
                      ) : (
                        <NeuIconBadge size="md" active className="bg-neu-bg">
                          <Music className="w-5 h-5 text-neo-text-secondary" />
                        </NeuIconBadge>
                      )}
                      <div>
                        <p className={`font-body-md text-body-md font-semibold group-hover:text-neo-secondary transition-colors ${active ? 'text-neo-secondary' : 'text-neo-text-primary'}`}>{track.title}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block font-data-md text-data-md text-neo-text-secondary">{Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, '0')}</div>
                    <div className="flex items-center gap-3 justify-end">
                      <NeuIconBadge 
                        size="md" 
                        interactive 
                        className={`cursor-pointer transition-colors ${active ? 'bg-neo-secondary shadow-neu-raised-sm' : 'bg-neo-secondary shadow-neu-raised-sm hover:bg-neo-secondary/90'}`}
                        onClick={() => play(track, songs)}
                      >
                        {active && isPlaying ? (
                          <Pause className="w-5 h-5 text-neo-primary" />
                        ) : (
                          <Play className="w-5 h-5 text-neo-primary ml-0.5" />
                        )}
                      </NeuIconBadge>
                      <Button variant="outline" size="sm" className="gap-1 border-neo-secondary text-neo-secondary hover:bg-neo-secondary hover:text-neo-primary">
                        <Download className="w-4 h-4" />
                        <span>+{track.coin_reward}</span>
                        <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </NeuCard>
        )}
      </section>
    </PageTransition>
  );
}