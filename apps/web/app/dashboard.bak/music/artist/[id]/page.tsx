'use client';
export const runtime = 'edge';
export const dynamicParams = true;

import { useState } from 'react';
import Link from 'next/link';

const artist = {
  name: 'Aisha M.',
  genre: 'Afro-Fusion / R&B',
  bio: "Lagos-born singer, songwriter, and producer blending traditional highlife rhythms with modern R&B and electronic textures. Aisha's sound is the heartbeat of the new creative economy.",
  coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBm5MX0bZ5EXjRosQ9zaSSsknq22ZKyfAKDsPadqn5sJ4IAMbu77DcuV_wytvKPKnYLUtP_r59TWhAPpCE8-ckjQVxD9QLE8-a9pBcqDPyvKBhGzKSK0Bed9CK1VFprsZ0tbCN3DtKygdCuCMJRG_aDiN57NKwu8CKOZifjC8U4dmBGmgTUUKyphsnqk8nvPYTd9x5KA7E8uSuSBH0TMR-MWXCc2rszhvIBTzU12jVc1eVqiTVlY5jdWj1MinJvbLxWTocxBKWhfQ',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJyScrcc2YMz6GNwZ4-LzLytdHEeh6DDJUBd5QwnyN9-nAJ8AzxlgFXy2RHsYXfDfkAEmlYkILF60gNRjXTxAf0C4w3W3zx727aHyrvgsJfJgVCfYGCoUqJT3jUM3-9NiN9x2zj2Guh6NMI1fhwE1FV_YFEql1F-9Bca92iJaxjxYxQgv-FoKEyVT5Cnz4M_Q2X2QkgqB9GF1ev41H_drzSOmIoPuBteUgCL7RIYL9tiYHHXd5p4U02IDkUJkM9sCmUQwE0xByETE',
  totalStreams: '12.4M',
  followers: '850K',
  monthlyListeners: '2.1M',
  isFollowing: false,
};

const tracks = [
  { id: 1, title: 'Midnight in Eko', artist: 'Aisha M.', duration: '3:42', streams: '2.4M', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFYK9kkVrG10ofKu9MI9fGPNYpYYPxLncZBvjMIkaxPzuehBYqZkr9AheE7Fx9yIbB4-du2F853ofDaz4q3PDPQBDfMzBbsyTlwMKo9AjAhoEhB1FUWrcY_cswsMhyiYAcjj-u9LzjC29C3P5hMRE6nUxeXHbWhQx7Ar3on3v6lK-HcVx66x13hw1Ey8A7725kZUOt4mOZBvfj-0tDn3jUkGCr3wjhNpnQqXybe5AV98o6xYBdvtuEv54NiGOKQaqaM2YzBq-8qA4', featured: false },
  { id: 2, title: 'Golden Hour', artist: 'Aisha M. ft. Burna Boy', duration: '4:15', streams: '1.8M', image: null, featured: true },
  { id: 3, title: 'Silk & Gold', artist: 'Aisha M.', duration: '3:28', streams: '1.2M', image: null, featured: false },
  { id: 4, title: 'Lagos Rain', artist: 'Aisha M.', duration: '4:02', streams: '980K', image: null, featured: false },
];

const similarArtists = [
  { id: 1, name: 'Tomiwa', genre: 'Afrobeats', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEKvcFHlbqY5w9ndKPjw2-eTZS6F408xVSmnI76zVdm8Tudp_uYuH7qTMAUrLQ2yAehuRDrpcL9q23ke9mdUY92hfmrj8BN7s9CUZ_yQNeJXn2S06ubKK9j8lPazkf02fenk37fwpO48fPD84LJLVtMsZqV69jnNfJL1KCeMTm9IMNFyBQ-SdM-Pxc9QvENDU4iYN6fOTqPVyB5aEgUMdFRb5arM5GdZvPGKnCvCvFQZRz-PgDp8airQ4o9FlBUvlKyg8U4PBdJII' },
  { id: 2, name: 'Zainab', genre: 'Neo-Soul', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDbqajHROI9Y3HckFqvKHDO-gnz9ABDULlmQqJS9dx51zBn-k77gcEm3hhjE7EjuNxEMjgqhcmGZVFXQ4D-JjbHT3PN8BjdWHo3hJs24GQrKuOrB4U4UltF4IRk4LSbJEwwFqU4hk5jzCX_LcvPRgojaQnYG7rXC8IgqwLHDKd6SHuQWvo-pJ99Je6JPvwRR6P2VCDDjEEnlFO4uOgGPPypSZ_0axU_AiNEv2HSwAihj797cRiYZJ9IUj-hD-RV_OrGmhI7pMyVhY' },
  { id: 3, name: 'DJ K-Flex', genre: 'Producer', image: null },
];

export default function ArtistProfilePage() {
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
          {similarArtists.map((artist) => (
            <div key={artist.id} className="min-w-[160px] flex flex-col items-center p-4 bg-surface-alt rounded-xl hover:shadow-md transition-shadow">
              {artist.image ? (
                <img className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" src={artist.image} alt={artist.name} />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface-dim flex items-center justify-center text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-[32px]">person</span>
                </div>
              )}
              <p className="font-body-md text-body-md font-semibold text-center text-on-background">{artist.name}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">{artist.genre}</p>
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
