'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary-container text-on-primary">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${artist.coverImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/60 to-transparent"></div>
        </div>

        {/* Artist Info */}
        <div className="px-margin-mobile lg:px-gutter -mt-16 relative z-10 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <img className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary-container shadow-xl object-cover" src={artist.avatar} alt={artist.name} />
              <div className="text-center md:text-left mb-2">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary">{artist.name}</h1>
                <p className="font-body-lg text-body-lg text-secondary-fixed mt-1">{artist.genre}</p>
              </div>
            </div>
            <button
              onClick={() => setFollowing(!following)}
              className={`font-label-caps text-label-caps px-8 py-3 rounded-lg shadow-lg transition-colors w-full md:w-auto ${
                following
                  ? 'bg-surface text-on-surface border border-outline-variant'
                  : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim'
              }`}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="font-body-md text-body-md text-on-primary-container">{artist.bio}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl border-t border-on-primary-container/20 pt-6">
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Total Streams</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.totalStreams}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Followers</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.followers}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Monthly Listeners</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.monthlyListeners}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Song List Section */}
      <section className="px-margin-mobile lg:px-gutter py-12 max-w-container-max mx-auto">
        <h3 className="font-h3 text-h3 text-on-background mb-6">Popular Tracks</h3>
        <div className="bg-surface-alt rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-outline-variant/30 text-on-surface-variant font-label-caps text-label-caps">
            <div className="w-8 text-center">#</div>
            <div>Song Title</div>
            <div className="hidden sm:block">Duration</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Track Rows */}
          <div className="divide-y divide-outline-variant/20">
            {tracks.map((track, index) => (
              <div key={track.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-surface-container transition-colors group">
                <div className="w-8 text-center font-data-md text-data-md text-on-surface-variant">{index + 1}</div>
                <div className="flex items-center gap-4">
                  {track.image ? (
                    <img className="w-12 h-12 rounded bg-surface-dim object-cover" src={track.image} alt={track.title} />
                  ) : (
                    <div className="w-12 h-12 rounded bg-surface-dim flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">music_note</span>
                    </div>
                  )}
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-background group-hover:text-primary transition-colors">{track.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{track.artist}</p>
                  </div>
                </div>
                <div className="hidden sm:block font-data-md text-data-md text-on-surface-variant">{track.duration}</div>
                <div className="flex items-center gap-3 justify-end">
                  <button className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                  <button className="flex items-center gap-1 border border-secondary-container text-secondary-container px-3 py-1.5 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-data-md text-data-md">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>+3</span>
                    <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Similar Artists */}
      <section className="px-margin-mobile lg:px-gutter py-8 max-w-container-max mx-auto mb-12">
        <h3 className="font-h3 text-h3 text-on-background mb-6">Similar Artists</h3>
        <div className="flex overflow-x-auto gap-gutter pb-4">
          {similarArtists.map((similarArtist) => (
            <div key={similarArtist.id} className="min-w-[160px] flex flex-col items-center p-4 bg-surface-alt rounded-xl hover:shadow-md transition-shadow">
              {similarArtist.image ? (
                <img className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" src={similarArtist.image} alt={similarArtist.name} />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface-dim flex items-center justify-center text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-[32px]">person</span>
                </div>
              )}
              <p className="font-body-md text-body-md font-semibold text-center text-on-background">{similarArtist.name}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">{similarArtist.genre}</p>
              <button className="border border-primary-container text-primary-container font-label-caps text-label-caps px-4 py-1.5 rounded-lg hover:bg-primary-container hover:text-on-primary transition-colors w-full">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Music Player */}
      <div className="fixed bottom-0 w-full lg:w-[calc(100%-16rem)] lg:left-64 z-40 bg-primary-container text-on-primary shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-outline-variant/20 left-0">
        <div className="px-margin-mobile lg:px-gutter py-3 flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-1/3">
            <img className="w-12 h-12 rounded object-cover" src={tracks[0].image || ''} alt="Now playing" />
            <div className="hidden sm:block">
              <p className="font-body-md text-body-md font-semibold truncate">{tracks[0].title}</p>
              <p className="font-body-sm text-body-sm text-on-primary-container truncate">{tracks[0].artist}</p>
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-4">
              <button className="text-on-primary-container hover:text-secondary-fixed transition-colors"><span className="material-symbols-outlined text-[20px]">skip_previous</span></button>
              <button className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:scale-105 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
              </button>
              <button className="text-on-primary-container hover:text-secondary-fixed transition-colors"><span className="material-symbols-outlined text-[20px]">skip_next</span></button>
            </div>
          </div>
          {/* Extras */}
          <div className="flex items-center justify-end gap-3 w-1/3">
            <button className="text-secondary-fixed hover:text-secondary transition-colors"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
