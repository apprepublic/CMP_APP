'use client';

import { useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Download, Heart, UserPlus, UserMinus, Music, Users, TrendingUp, PlayCircle } from 'lucide-react';

const artist = {
  name: 'Aisha M',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFRMnTMcbu8r6zY05xUUdrM9m8LmxxQ4Gm0Rd-Oyo9a9pTqLV2j5zZg5NbaQ72VPGyw5r-1OJ1kERLa-vkjBk8kmzEARO4ENFwxJrIPxkeXXpmrum6xgFGqC9OOb00u91rPPsyIdHhlll1bf-clNmYFcyRv_xmTXc63FtcfjekGu969hDTpvFSQ-wnKyZSv1ZSSmTdpOy9MbrjQncg68Ng_5mLgShtoX1bZdq3CgYvbdgKBPhIxFenXv5_2HoqVpwaEN2w6NXDt5ts',
  coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE3pxt9qWHcXBSPsyxNGFoO-0Fp1JADPZzlFKBo6LchDLYGjhXHDh0KBI6mxEwSQ_mjTF19Q6glEJIYzVJ4ddam1Htz-rjt2xa9DheCZJfVL0WPpkLd7fhDZlmNK6BcWNeZJAjVbxXar3wsXTjXe63CZkXzxTdpSrOIGht1q9lF7FDeSClsdJXNLfu04BiHDwSjjWxyFzbpnWRDMmIrj8AUEqqPdRXj1VrDc20gbZAlHLVZN8W-lX7KrIyPTcaUW7zG8b_2C8XBDM',
  genre: 'Afrobeats',
  bio: 'Aisha M is a rising Afrobeats star from Lagos, blending traditional rhythms with modern production. Her debut EP garnered over 500K streams in its first month.',
  totalStreams: '1.2M',
  followers: '84K',
  monthlyListeners: '320K',
  isFollowing: false,
};

const tracks = [
  { id: '1', title: 'Lagos Nights', artist: 'Aisha M', duration: '3:42', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLpYMhKyUa3sYfjFwarbRZOAgcB7gxZ5UAftIvcxhLD7heSc8Kky1bvKl9y3QwQToZ7Hyo1U2Pm451bDN15__5P8JArXLALuKP1XypuIT8j8hzfeYaLPO2r_XojOLNOD9z9BB3S_muGDdH5-EtKZfsvDkITMChSw8ovuykCltnOXCXIbJMADsByFMcRKCO9f_napkWXv9NPxnHsoMAe3QFUhtGUCv2UU_UG1nUHeB3DF1x-FNz6krDG7na8XgFrFhBm6OZ9841xZaQ' },
  { id: '2', title: 'Oju Oluwa', artist: 'Aisha M', duration: '4:15', image: '' },
  { id: '3', title: 'Gbedu', artist: 'Aisha M', duration: '2:58', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpiga3eNOVP8yXBmlTNQD-8rvLmmwEikDjZAWVzH-KFiNYtQPsXf_58t9SDDhgXjRA5aY6W_O6siz5Aenybsd59MVJMOfSCwNSVWK_lR7WLrbWVvO6DRmtTwUhJ_fG6shEvUUbqFYZjvXdpj_yt6RXOmpqfjkmGilqacpa3K-jHTsQFrSmcmIvjuU-HpJ3XON77d0wtkyEz-g3w8VJzDt8cpS-0442OCncJFJMzeNwMHa81VM-8KNTy-CaUme_QEjvQ4eAMVcRRn0' },
  { id: '4', title: 'Sway', artist: 'Aisha M', duration: '3:20', image: '' },
  { id: '5', title: 'Ile', artist: 'Aisha M', duration: '5:01', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqkXT-8nTiFDgN-EPzsYxJc5xTladBCv9aJ-3nBZW3h8SlgZ7CzLq8lG-QyrU_GIIwa-aA-yG97Ux5LqSkEmuczKhqqe5vjBb3gdznHNOCHW2OVOFO172T_rOkAPy9RQ67azHCIjBanfO7Q2aeT-1OjmFX82-iOQbkyja9BwYkVRPh6huHB3veUqMzZgp9SpAuiDFGwhWHxYBdkWJ20vneKSjSpqUj5v9VDO_KAf2IHBJdq1kWS-MmbfpTeuJB8Py1JbstbzjjCps' },
];

const similarArtists = [
  { id: '1', name: 'Tomiwa Beats', genre: 'Afropop', image: '' },
  { id: '2', name: 'Zainab Flow', genre: 'R&B', image: '' },
  { id: '3', name: 'DJ Kex', genre: 'Amapiano', image: '' },
  { id: '4', name: 'Segun Vibes', genre: 'Highlife', image: '' },
];

export default function ArtistProfileClient() {
  const [following, setFollowing] = useState(artist.isFollowing);

  return (
    <PageTransition className="min-h-screen bg-neu-bg">
      {/* Hero Section */}
      <NeuCard padding="none" className="relative overflow-hidden shadow-neu-raised">
        <div className="h-64 md:h-80 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${artist.coverImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 via-neo-primary/60 to-transparent"></div>
        </div>

        <div className="px-margin-mobile lg:px-gutter -mt-16 relative z-10 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <NeuIconBadge size="lg" active className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-neu-bg shadow-neu-raised overflow-hidden p-0">
                <img className="w-full h-full object-cover" src={artist.avatar} alt={artist.name} />
              </NeuIconBadge>
              <div className="text-center md:text-left mb-2">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary">{artist.name}</h1>
                <p className="font-body-lg text-body-lg text-neo-secondary mt-1">{artist.genre}</p>
              </div>
            </div>
            <Button
              size="lg"
              variant={following ? 'outline' : 'default'}
              onClick={() => setFollowing(!following)}
              className="gap-2 shadow-neu-raised-sm w-full md:w-auto"
            >
              {following ? (
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

          <div className="mt-8 max-w-3xl">
            <p className="font-body-md text-body-md text-neo-text-secondary">{artist.bio}</p>
          </div>

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
                  <p className="font-data-lg text-data-lg text-neo-text-primary">{artist.totalStreams}</p>
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
                  <p className="font-data-lg text-data-lg text-neo-text-primary">{artist.followers}</p>
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
                  <p className="font-data-lg text-data-lg text-neo-text-primary">{artist.monthlyListeners}</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </NeuCard>

      {/* Song List Section */}
      <section className="px-margin-mobile lg:px-gutter py-12 max-w-container-max mx-auto">
        <h3 className="font-h3 text-h3 text-neo-text-primary mb-6">Popular Tracks</h3>
        <NeuCard padding="none" className="shadow-neu-flat overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-neu-bg-dark text-neo-text-secondary font-label-caps text-label-caps">
            <div className="w-8 text-center">#</div>
            <div>Song Title</div>
            <div className="hidden sm:block">Duration</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-neu-bg-dark/50">
            {tracks.map((track, index) => (
              <motion.div 
                key={track.id} 
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-neu-bg transition-colors group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-8 text-center font-data-md text-data-md text-neo-text-secondary">{index + 1}</div>
                <div className="flex items-center gap-4">
                  {track.image ? (
                    <NeuCard padding="none" className="w-12 h-12 rounded bg-neu-bg shadow-neu-flat overflow-hidden">
                      <img className="w-full h-full object-cover" src={track.image} alt={track.title} />
                    </NeuCard>
                  ) : (
                    <NeuIconBadge size="md" active className="bg-neu-bg">
                      <Music className="w-5 h-5 text-neo-text-secondary" />
                    </NeuIconBadge>
                  )}
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-neo-text-primary group-hover:text-neo-secondary transition-colors">{track.title}</p>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary">{track.artist}</p>
                  </div>
                </div>
                <div className="hidden sm:block font-data-md text-data-md text-neo-text-secondary">{track.duration}</div>
                <div className="flex items-center gap-3 justify-end">
                  <NeuIconBadge size="md" interactive className="cursor-pointer bg-neo-secondary shadow-neu-raised-sm hover:bg-neo-secondary/90 transition-colors">
                    <Play className="w-5 h-5 text-neo-primary ml-0.5" />
                  </NeuIconBadge>
                  <Button variant="outline" size="sm" className="gap-1 border-neo-secondary text-neo-secondary hover:bg-neo-secondary hover:text-neo-primary">
                    <Download className="w-4 h-4" />
                    <span>+3</span>
                    <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </NeuCard>
      </section>

      {/* Similar Artists */}
      <section className="px-margin-mobile lg:px-gutter py-8 max-w-container-max mx-auto mb-12">
        <h3 className="font-h3 text-h3 text-neo-text-primary mb-6">Similar Artists</h3>
        <div className="flex overflow-x-auto gap-gutter pb-4 scrollbar-hide">
          {similarArtists.map((similarArtist) => (
            <motion.div 
              key={similarArtist.id} 
              className="min-w-[160px] flex flex-col items-center p-4 bg-neu-bg rounded-xl shadow-neu-flat hover:shadow-neu-raised transition-shadow"
              whileHover={{ y: -4 }}
            >
              {similarArtist.image ? (
                <NeuIconBadge size="lg" active className="w-24 h-24 rounded-full overflow-hidden p-0 mb-4">
                  <img className="w-full h-full object-cover" src={similarArtist.image} alt={similarArtist.name} />
                </NeuIconBadge>
              ) : (
                <NeuIconBadge size="lg" active className="w-24 h-24 rounded-full mb-4">
                  <span className="material-symbols-outlined text-[32px] text-neo-text-secondary">person</span>
                </NeuIconBadge>
              )}
              <p className="font-body-md text-body-md font-semibold text-center text-neo-text-primary">{similarArtist.name}</p>
              <p className="font-body-sm text-body-sm text-neo-text-secondary text-center mb-3">{similarArtist.genre}</p>
              <Button variant="outline" size="sm" className="border-neo-primary text-neo-primary hover:bg-neo-primary hover:text-white w-full">
                Follow
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sticky Music Player */}
      <div className="fixed bottom-0 w-full lg:w-[calc(100%-16rem)] lg:left-64 z-40 bg-neu-bg shadow-neu-raised border-t border-neu-bg-dark left-0">
        <div className="px-margin-mobile lg:px-gutter py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 w-1/3">
            <NeuCard padding="none" className="w-12 h-12 rounded overflow-hidden shadow-neu-raised-sm">
              <img className="w-full h-full object-cover" src={tracks[0].image} alt="Now playing" />
            </NeuCard>
            <div className="hidden sm:block">
              <p className="font-body-md text-body-md font-semibold truncate">{tracks[0].title}</p>
              <p className="font-body-sm text-body-sm text-neo-text-secondary truncate">{tracks[0].artist}</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-4">
              <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors">
                <span className="material-symbols-outlined text-[20px]">skip_previous</span>
              </button>
              <NeuIconBadge size="md" interactive className="cursor-pointer bg-neo-secondary shadow-neu-raised-sm">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
              </NeuIconBadge>
              <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors">
                <span className="material-symbols-outlined text-[20px]">skip_next</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 w-1/3">
            <button className="text-neo-secondary hover:text-neo-secondary/80 transition-colors">
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}