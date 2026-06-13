'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, SkipBack, SkipForward, Pause, Shuffle, Repeat, Heart, Volume2, Download, MoreVertical, UserPlus, UserMinus, Verified, MapPin } from 'lucide-react';

const mockArtist = {
  name: 'Luna Echo',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFRMnTMcbu8r6zY05xUUdrM9m8LmxxQ4Gm0Rd-Oyo9a9pTqLV2j5zZg5NbaQ72VPGyw5r-1OJ1kERLa-vkjBk8kmzEARO4ENFwxJrIPxkeXXpmrum6xgFGqC9OOb00u91rPPsyIdHhlll1bf-clNmYFcyRv_xmTXc63FtcfjekGu969hDTpvFSQ-wnKyZSv1ZSSmTdpOy9MbrjQncg68Ng_5mLgShtoX1bZdq3CgYvbdgKBPhIxFenXv5_2HoqVpwaEN2w6NXDt5ts',
  coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE3pxt9qWHcXBSPsyxNGFoO-0Fp1JADPZzlFKBo6LchDLYGjhXHDh0KBI6mxEwSQ_mjTF19Q6glEJIYzVJ4ddam1Htz-rjt2xa9DheCZJfVL0WPpkLd7fhDZlmNK6BcWNeZJAjVbxXar3wsXTjXe63CZkXzxTdpSrOIGht1q9lF7FDeSClsdJXNLfu04BiHDwSjjWxyFzbpnWRDMmIrj8AUEqqPdRXj1VrDc20gbZAlHLVZN8W-lX7KrIyPTcaUW7zG8b_2C8XBDM',
  monthlyStreams: '2.4M',
  isFollowing: false,
};

const topTracks = [
  { id: '1', title: 'Midnight Drive', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLpYMhKyUa3sYfjFwarbRZOAgcB7gxZ5UAftIvcxhLD7heSc8Kky1bvKl9y3QwQToZ7Hyo1U2Pm451bDN15__5P8JArXLALuKP1XypuIT8j8hzfeYaLPO2r_XojOLNOD9z9BB3S_muGDdH5-EtKZfsvDkITMChSw8ovuykCltnOXCXIbJMADsByFMcRKCO9f_napkWXv9NPxnHsoMAe3QFUhtGUCv2UU_UG1nUHeB3DF1x-FNz6krDG7na8XgFrFhBm6OZ9841xZaQ', duration: '3:45' },
  { id: '2', title: 'Echoes of Lagos', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiga3eNOVP8yXBmlTNQD-8rvLmmwEikDjZAWVzH-KFiNYtQPsXf_58t9SDDhgXjRA5aY6W_O6siz5Aenybsd59MVJMOfSCwNSVWK_lR7WLrbWVvO6DRmtTwUhJ_fG6shEvUUbqFYZjvXdpj_yt6RXOmpqfjkmGilqacpa3K-jHTsQFrSmcmIvjuU-HpJ3XON77d0wtkyEz-g3w8VJzDt8cpS-0442OCncJFJMzeNwMHa81VM-8KNTy-CaUme_QEjvQ4eAMVcRRn0', duration: '4:12' },
  { id: '3', title: 'Neon Pulse', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqkXT-8nTiFDgN-EPzsYxJc5xTladBCv9aJ-3nBZW3h8SlgZ7CzLq8lG-QyrU_GIIwa-aA-yG97Ux5LqSkEmuczKhqqe5vjBb3gdznHNOCHW2OVOFO172T_rOkAPy9RQ67azHCIjBanfO7Q2aeT-1OjmFX82-iOQbkyja9BwYkVRPh6huHB3veUqMzZgp9SpAuiDFGwhWHxYBdkWJ20vneKSjSpqUj5v9VDO_KAf2IHBJdq1kWS-MmbfpTeuJB8Py1JbstbzjjCps', duration: '2:58' },
];

const nowPlaying = {
  title: 'Midnight Drive',
  artist: 'Luna Echo',
  cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLpYMhKyUa3sYfjFwarbRZOAgcB7gxZ5UAftIvcxhLD7heSc8Kky1bvKl9y3QwQToZ7Hyo1U2Pm451bDN15__5P8JArXLALuKP1XypuIT8j8hzfeYaLPO2r_XojOLNOD9z9BB3S_muGDdH5-EtKZfsvDkITMChSw8ovuykCltnOXCXIbJMADsByFMcRKCO9f_napkWXv9NPxnHsoMAe3QFUhtGUCv2UU_UG1nUHeB3DF1x-FNz6krDG7na8XgFrFhBm6OZ9841xZaQ',
};

export default function ArtistProfilePage() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(mockArtist.isFollowing);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFollow = () => setIsFollowing(!isFollowing);

  return (
    <PageTransition className="min-h-screen bg-neu-bg pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="sm" active>
            <img alt="User Profile" className="w-full h-full object-cover rounded-full" src={mockArtist.avatar} />
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
            <div className="h-48 md:h-64 w-full bg-neu-bg relative">
              <img alt="Artist Cover" className="w-full h-full object-cover opacity-80" src={mockArtist.coverImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/80 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row md:items-end gap-6 translate-y-12 md:translate-y-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-neu-bg overflow-hidden shadow-neu-raised flex-shrink-0 bg-neu-bg relative z-10">
                <img alt="Artist Profile Picture" className="w-full h-full object-cover" src={mockArtist.avatar} />
              </div>
              <div className="flex-grow pb-12 md:pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div className="text-white md:text-neo-text-primary">
                  <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-white drop-shadow-md md:drop-shadow-none md:text-neo-primary">{mockArtist.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-data-lg text-data-lg text-neo-secondary">{mockArtist.monthlyStreams}</span>
                    <span className="font-body-sm text-body-sm text-white/80 md:text-neo-text-secondary uppercase tracking-wider">Monthly Streams</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant={isFollowing ? 'outline' : 'default'}
                  onClick={handleFollow}
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
              <Button variant="ghost" size="sm" className="gap-1 text-neo-secondary hover:text-neo-secondary/80">
                See All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Button>
            </div>
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
                  {topTracks.map((track, index) => (
                    <motion.tr 
                      key={track.id} 
                      className="border-b border-neu-bg-dark/50 hover:bg-neu-bg transition-colors group cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-4 pl-2 text-center text-neo-text-secondary font-data-md text-data-md">{index + 1}</td>
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <NeuCard padding="none" className="w-10 h-10 rounded bg-neu-bg overflow-hidden flex-shrink-0 hidden sm:block shadow-neu-flat">
                            <img alt="Album Art" className="w-full h-full object-cover" src={track.cover} />
                          </NeuCard>
                          <div>
                            <div className="font-body-lg text-body-lg text-neo-text-primary group-hover:text-neo-secondary transition-colors">{track.title}</div>
                            <div className="font-body-sm text-body-sm text-neo-text-secondary sm:hidden">{track.duration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pl-2 text-neo-text-secondary hidden sm:table-cell font-data-md text-data-md">{track.duration}</td>
                      <td className="py-4 pr-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <NeuIconBadge size="sm" interactive className="cursor-pointer text-neo-text-primary hover:bg-neo-primary hover:text-white transition-colors">
                            <Play className="w-4 h-4 fill-current" />
                          </NeuIconBadge>
                          <NeuIconBadge size="sm" interactive className="cursor-pointer hidden sm:flex">
                            <Download className="w-4 h-4" />
                          </NeuIconBadge>
                          <NeuIconBadge size="sm" interactive className="cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </NeuIconBadge>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </NeuCard>
        </section>

        {/* About Section */}
        <section className="mt-6">
          <NeuCard padding="lg" className="shadow-neu-flat">
            <h2 className="font-h3 text-h3 text-neo-text-primary mb-4">About</h2>
            <p className="font-body-md text-body-md text-neo-text-secondary">
              Luna Echo is an emerging electronic music producer known for blending synthwave, lo-fi, and ambient soundscapes.
              With over 2.4M monthly streams, she continues to captivate audiences worldwide with her unique sound.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
                  <Verified className="w-4 h-4 text-neo-secondary" />
                </NeuIconBadge>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Verified Artist</span>
              </div>
              <div className="flex items-center gap-2">
                <NeuIconBadge size="sm" active>
                  <MapPin className="w-4 h-4 text-neo-text-primary" />
                </NeuIconBadge>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Lagos, Nigeria</span>
              </div>
            </div>
          </NeuCard>
        </section>
      </main>

      {/* Global Player Bar */}
      <div className="fixed bottom-[72px] md:bottom-0 left-0 w-full z-40 bg-neu-bg shadow-neu-raised backdrop-blur-lg border-t border-neu-bg-dark">
        <div className="max-w-container-max mx-auto w-full px-4 md:px-gutter h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-1/3 min-w-[150px]">
            <NeuCard padding="none" className="w-12 h-12 rounded-md overflow-hidden bg-neu-bg shadow-neu-raised-sm shrink-0">
              <img className="w-full h-full object-cover" src={nowPlaying.cover} alt="Now Playing" />
            </NeuCard>
            <div className="flex flex-col hidden sm:flex overflow-hidden">
              <span className="font-body-md text-body-md font-semibold text-neo-text-primary truncate">{nowPlaying.title}</span>
              <span className="font-body-sm text-body-sm text-neo-text-secondary truncate">{nowPlaying.artist}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-6 w-1/3">
            <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors p-2 active:scale-95 hidden md:block">
              <Shuffle className="w-6 h-6" />
            </button>
            <button className="text-neo-text-primary hover:text-neo-secondary transition-colors p-2 active:scale-95">
              <SkipBack className="w-8 h-8" />
            </button>
            <NeuIconBadge size="lg" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer hover:bg-neo-secondary/90 hover:scale-105 transition-all">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-neo-primary" />
              ) : (
                <Play className="w-6 h-6 text-neo-primary ml-0.5" />
              )}
            </NeuIconBadge>
            <button className="text-neo-text-primary hover:text-neo-secondary transition-colors p-2 active:scale-95">
              <SkipForward className="w-8 h-8" />
            </button>
            <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors p-2 active:scale-95 hidden md:block">
              <Repeat className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-3 w-1/3 min-w-[100px]">
            <button className="text-neo-text-secondary hover:text-neo-text-primary transition-colors active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[20px]">queue_music</span>
            </button>
            <div className="flex items-center gap-2 w-24 md:w-32 group/vol">
              <Volume2 className="w-5 h-5 text-neo-text-secondary group-hover/vol:text-neo-text-primary transition-colors" />
              <div className="w-full h-1 bg-neu-bg shadow-neu-inset rounded-full cursor-pointer relative">
                <div className="absolute top-0 left-0 h-full w-[75%] bg-neo-secondary rounded-full group-hover/vol:bg-neo-secondary transition-colors shadow-neu-raised-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised">
        <Link href="/" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
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