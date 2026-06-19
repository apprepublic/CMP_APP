'use client';

import Link from 'next/link';
import { useArtist } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Pause, UserPlus, UserMinus, Verified, MapPin } from 'lucide-react';
import { useState } from 'react';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function ArtistProfileClient({ slug }: { slug: string }) {
  const { data, isLoading } = useArtist(slug);
  const { play, current, isPlaying, toggle } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen bg-neu-bg pb-32">
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
          <div className="flex items-center gap-3">
            <NeuIconBadge size="sm" active>
              <span className="material-symbols-outlined text-neo-primary">person</span>
            </NeuIconBadge>
            <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full shadow-neu-flat text-neo-text-secondary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>
        <main className="pt-[60px] max-w-container-max mx-auto md:px-gutter px-margin-mobile">
          <div className="h-48 md:h-64 rounded-xl neo-skeleton mb-24" />
          <div className="h-64 rounded-neo neo-skeleton" />
        </main>
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition className="min-h-screen bg-neu-bg pb-32">
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
          <div className="flex items-center gap-3">
            <NeuIconBadge size="sm" active>
              <span className="material-symbols-outlined text-neo-primary">person</span>
            </NeuIconBadge>
            <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
          </div>
        </header>
        <main className="pt-[60px] max-w-container-max mx-auto md:px-gutter px-margin-mobile">
          <div className="text-center py-20 text-neo-text-secondary">
            <span className="material-symbols-outlined text-[64px] mb-4">person</span>
            <h2 className="font-h3 text-h3 text-neo-text-primary mb-2">Artist not found</h2>
            <p>The artist you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </PageTransition>
    );
  }

  const { artist, songs } = data;

  return (
    <PageTransition className="min-h-screen bg-neu-bg pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="sm" active>
            <span className="material-symbols-outlined text-neo-primary">person</span>
          </NeuIconBadge>
          <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neu-bg shadow-neu-flat transition-colors text-neo-text-secondary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-[60px] max-w-container-max mx-auto md:px-gutter px-margin-mobile">
        {/* Hero Section */}
        <section className="mt-4">
          <NeuCard padding="none" className="relative rounded-xl overflow-hidden shadow-neu-raised">
            <div className="h-48 md:h-64 w-full bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20 relative">
              {artist.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="Artist Cover" className="w-full h-full object-cover opacity-80" src={artist.cover_url} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/80 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row md:items-end gap-6 translate-y-12 md:translate-y-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-neu-bg overflow-hidden shadow-neu-raised flex-shrink-0 bg-neu-bg relative z-10 flex items-center justify-center bg-gradient-to-br from-neo-secondary to-neo-primary">
                {artist.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Artist Profile" className="w-full h-full object-cover" src={artist.avatar_url} />
                ) : (
                  <span className="font-h1 text-h1 text-white font-bold">{artist.stage_name?.[0]?.toUpperCase() || 'A'}</span>
                )}
              </div>
              <div className="flex-grow pb-12 md:pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div className="text-white md:text-neo-text-primary">
                  <div className="flex items-center gap-2">
                    <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-white drop-shadow-md md:drop-shadow-none md:text-neo-primary">{artist.stage_name}</h1>
                    {artist.is_verified && (
                      <NeuIconBadge size="sm" active className="bg-blue-500/20 p-0">
                        <Verified className="w-5 h-5 text-blue-500" />
                      </NeuIconBadge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-data-lg text-data-lg text-neo-secondary">{formatNumber(artist.monthly_listeners)}</span>
                    <span className="font-body-sm text-body-sm text-white/80 md:text-neo-text-secondary uppercase tracking-wider">Monthly Listeners</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant={isFollowing ? 'outline' : 'default'}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="gap-2 shadow-neu-raised-sm"
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
            </div>
          </NeuCard>
        </section>

        {/* Tracklist Section */}
        <section className="mt-24 md:mt-16">
          <NeuCard padding="lg" className="shadow-neu-flat">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-h3 text-h3 text-neo-text-primary">Top Tracks</h2>
            </div>
            {songs.length === 0 ? (
              <div className="text-center py-10 text-neo-text-secondary">
                <span className="material-symbols-outlined text-[48px] mb-2">music_note</span>
                <p>No tracks available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neu-bg-dark text-neo-text-secondary font-label-caps text-label-caps">
                      <th className="pb-3 pl-2 w-12 text-center">#</th>
                      <th className="pb-3 pl-2">Title</th>
                      <th className="pb-3 pl-2 hidden sm:table-cell">Duration</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md">
                    {songs.map((track, index) => {
                      const active = current?.id === track.id && isPlaying;
                      return (
                        <motion.tr 
                          key={track.id} 
                          className={`border-b border-neu-bg-dark/50 hover:bg-neu-bg transition-colors group cursor-pointer ${active ? 'bg-neu-bg/50' : ''}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="py-4 pl-2 text-center text-neo-text-secondary font-data-md text-data-md">{index + 1}</td>
                          <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                              <NeuCard padding="none" className="w-10 h-10 rounded bg-neu-bg overflow-hidden flex-shrink-0 hidden sm:block shadow-neu-flat">
                                {track.cover_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img alt="Album Art" className="w-full h-full object-cover" src={track.cover_url} />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20">
                                    <span className="material-symbols-outlined text-[20px] text-neo-text-muted">music_note</span>
                                  </div>
                                )}
                              </NeuCard>
                              <div>
                                <div className={`font-body-lg text-body-lg group-hover:text-neo-secondary transition-colors ${active ? 'text-neo-secondary' : 'text-neo-text-primary'}`}>{track.title}</div>
                                <div className="font-body-sm text-body-sm text-neo-text-secondary sm:hidden">{track.duration_seconds}s</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pl-2 text-neo-text-secondary hidden sm:table-cell font-data-md text-data-md">{Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, '0')}</td>
                          <td className="py-4 pr-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <NeuIconBadge 
                                size="sm" 
                                interactive 
                                className={`cursor-pointer transition-colors ${active ? 'bg-neo-secondary text-neo-primary' : 'text-neo-text-primary hover:bg-neo-primary hover:text-white'}`}
                                onClick={() => play(track, songs)}
                              >
                                {active && isPlaying ? (
                                  <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                  <Play className="w-4 h-4 fill-current" />
                                )}
                              </NeuIconBadge>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </NeuCard>
        </section>

        {/* About Section */}
        <section className="mt-6">
          <NeuCard padding="lg" className="shadow-neu-flat">
            <h2 className="font-h3 text-h3 text-neo-text-primary mb-4">About</h2>
            {artist.bio ? (
              <p className="font-body-md text-body-md text-neo-text-secondary">{artist.bio}</p>
            ) : (
              <p className="font-body-md text-body-md text-neo-text-secondary">No bio available.</p>
            )}
            <div className="flex gap-4 mt-4 flex-wrap">
              {artist.is_verified && (
                <div className="flex items-center gap-2">
                  <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
                    <Verified className="w-4 h-4 text-neo-secondary" />
                  </NeuIconBadge>
                  <span className="font-body-sm text-body-sm text-neo-text-secondary">Verified Artist</span>
                </div>
              )}
              {artist.genre && (
                <div className="flex items-center gap-2">
                  <NeuIconBadge size="sm" active>
                    <MapPin className="w-4 h-4 text-neo-text-primary" />
                  </NeuIconBadge>
                  <span className="font-body-sm text-body-sm text-neo-text-secondary">{artist.genre}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
                  <span className="material-symbols-outlined text-[16px] text-neo-secondary">people</span>
                </NeuIconBadge>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">{formatNumber(artist.follower_count)} followers</span>
              </div>
            </div>
          </NeuCard>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised">
        <Link href="/" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Tasks</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-neo-secondary text-neo-primary rounded-xl px-3 py-1 scale-90 transition-all shadow-neu-raised-sm">
          <span className="material-symbols-outlined fill">music_note</span>
          <span className="font-label-caps text-label-caps mt-1">Music</span>
        </button>
        <Link href="/marketplace" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>
    </PageTransition>
  );
}