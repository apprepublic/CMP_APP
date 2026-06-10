'use client';

import { useState } from 'react';

const genres = ['All Genres', 'Afrobeats', 'Highlife', 'Amapiano', 'Alte', 'Hip Hop', 'R&B'];

const trendingSongs = [
  { id: 1, title: 'Lagos Nights', artist: 'Burna Boy', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuYoPpo9F8aR-AxWbnqvvg-_sloUORxhAKDUwj6JFxzcz0ywXP0Cu0Dp8Iy9ngh80cQMVGpKRxsrLcQdw3qJAZfXvFa1L2zPO0jvJ2fIaoyM_-oH9U0sarhDtl7FOb-zT5pSFor2fO3LJpYauSZ-K9MnAYoHu301hTKZmis-X3WDhabiPRxmR5j4_fWRJZkzv5LLEcJtE_Ilx2q1ZJLPmtmipFovObg9r8Lk7inN9bU1C4GmdydzRhhWn2v-fTPP-tKoVCyYIwCdQ' },
  { id: 2, title: 'Golden Hour', artist: 'Tems', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpNZpU_qg5uTDQr7Y-vqpzGIXd05y_19o0nzt8gxZFy2FRRsK5eEJ1nxemIXYirFLdF63c0EIKsS9O7Inv2xoypwmJvFwMMsreLTKf2JXZ1fj_tVZRvLaxHo0Bg_rwr2zrl_2YA6vwh2fHge9fWPB8OMIeCP20efkm-i5j1PS9UZ97C4DUYopidDCsQAoftBrhI0uRSCiOIdXoGSIWLt1ZEHHhO9Y3oPYvS0bQAYvUhWYsLXnOTvXAsA95mOPNaNF9o-3PD-Z9oqA' },
  { id: 3, title: 'Rhythm & Flow', artist: 'Wizkid', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyZ8e72BTjweMOyOlT7nJINkZtJPmHObQn3m37EAfb87ZFJ1epWp1sdYxDJuhhOrWwINs2LketEQpi95TKm7ARM5rixCSmzLvgPvuxYYe5hh2WexCJRK1q7KAqEq2NRbU_IkSiXvxUcR7bBW2vOskwqEkdcSO8c1ULFvvNvUBfW2FhXnPcbwkO-BQd0FGsMMEgbVOFXhBYtvLqqRz4JIqkWzD72BFTDZEWjMdH9LdODoubjdfIg1gTf63F3NdVkSJlpXjQahGrVE0' },
  { id: 4, title: 'Studio Sessions', artist: 'Ayra Starr', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcQFONTeth1n9SVG2HDP6K2VdA04oRURkLB8kdv-NYCtprtRRq5Gfw0ylTS0NXPXWsfIrjmXEJ_FD8SziVd1f_i_yi--WdLzy7WstU1W9NxdC0Qit83oKS4MX70KzxeW4ssaqX6tK45l8HWYwmb2c5qsZT7AKNXBc7V1ldwhDpV2odJLze-mCR981ZpsSNnb1o92oqzQHJMMaVU8x5SVuV7PAgSw8BOxcSkWNdNNV7jN6pCTojrDXpXmtZlBFzKIwIIE8auK5aG-E' },
  { id: 5, title: 'Electric City', artist: 'Rema', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPAtOJ9YLCzqFoUf0Pb4YFux7j9Fy4pRo-xbdjP4-pUp84ly_5jOqGn_UpDx3GrX2WFhW6UQGnOgTjofthlUHfRoGOeYknc-D5zk-XL0eFDy5Xgrg40lJ3E2C4afs2uNKM1RAO1Nce-rRhEtxX6-D8nPDMSzuDUCAxE6HKItz-V40BnSn_m0t8kGVRCRgThQyv2B1bjb_epT7BXVRvgObZY-cdUS_HPZ59jxpqFN3E4hY2NcVXzdsgYThKaMjCzwaeMpg__ZH0-tE' },
];

const spotlightArtist = {
  name: 'Oxlade',
  description: "New EP 'Oxygen' out now",
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAUeUR7ZHP-etywiOhtRLXPXqi4CuuiQvSyoeko3uCtsjRdMu_He-CDVBiWcK9_zqHXZDSjQuhBDfZHzWYMbyvPpNLyA9B-X06KskDXwEQyYw1eh0q7ThHyKoMDJFsmy5_tPsxW31MWwfseSfDhbTC1e3Ze4_msqdXbk2S1p9_Qb0QH-j_zu_ksOMcSDgxNnpdiifbdxEG-HhtYCXYRfCvEZkd6aYDsXLLRIzMNoS_iA6XbwzJyFpDD8ZSIiWGwn4RhcwvaOcmCDs',
  badge: 'Spotlight',
};

const emergingTalents = [
  { id: 1, name: 'Fave', description: 'Blending soulful vocals with contemporary Afropop rhythms.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzLGvgJpTWyp5b6RtIEsUB0RxpzhO3qdAnl12-MhCQtVc5ZUJwKctKDislZDoAlzfik90UpzVzbpaXHVGqhEgdZSm8VceSsDEdeRbXulbPqnU6ufq9Z2udTsO43Vl13EqRT_FcjdEK4E50YHeZnJDDrMQHcOOw8u15mfsli1_zpD4aT_LiZyMBKewKcZmF3XpMkKnPkObEVccDswY2PewdkGeay9Vk1EaAzLxgfW7O_0cBCum4MY3bpYYkiyXVUw_cpzCYcO0zyeI' },
];

const nowPlaying = {
  title: 'Lagos Nights',
  artist: 'Burna Boy',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBra7JekNmWKbcOMVrYI5O1_mOyyXBukIV6NPJrsuLURVJXd4cCjp4XrHBnT3JrskQart6bnjMBZDgHJjPfUzuE7tPyYwV8sLFDEyrnQLpCQ72mKwPyO3DNHdsNdpkBGbhK4gESPvFXSURbxDMv-r_2Dmmy0QSXs4DUfLd3GM9onz8tQ6muerLicxofhvbc691VrPq1bteJu7YT6ILr7u6o1mkNa4aUNyd9Jh4MJrq-pO5xJiBB7ybCHIJGRQQHd1XaNubBzOfoaNk',
  progress: 35,
  currentTime: '1:24',
  duration: '3:45',
};

export default function MusicPage() {
  const [activeGenre, setActiveGenre] = useState('All Genres');

  return (
    <div className="space-y-12">
      {/* Hero Search Section */}
      <section className="relative bg-primary-container rounded-2xl p-8 lg:p-12 overflow-hidden shadow-sm">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <h2 className="font-h1-mobile lg:font-h1 text-h1-mobile lg:text-h1 text-on-primary">Discover the Sound of the Creative Economy</h2>
          <div className="w-full relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[28px] group-focus-within:text-secondary transition-colors">search</span>
            <input className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-primary placeholder-on-primary-container/70 rounded-xl pl-14 pr-6 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner" placeholder="Find artists, songs, podcasts..." type="text"/>
          </div>
        </div>
      </section>

      {/* Genre Pills */}
      <section>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-colors shadow-sm ${
                genre === activeGenre
                  ? 'bg-secondary-container text-on-secondary-container border-2 border-transparent'
                  : 'bg-surface-alt text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-h3 text-h3 text-on-background">Trending Now</h3>
          <a className="font-body-sm text-body-sm text-secondary font-semibold hover:underline" href="#">See all</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
          {trendingSongs.map((song) => (
            <div key={song.id} className="group cursor-pointer">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-surface-variant shadow-sm group-hover:shadow-md transition-all">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`${song.title} by ${song.artist}`} src={song.image} />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                </div>
              </div>
              <h4 className="font-body-md text-body-md font-semibold text-on-background truncate">{song.title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emerging Talents - Bento Grid Style */}
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
          {/* Feature Card - Spotlight */}
          <div className="col-span-1 md:col-span-2 relative rounded-2xl overflow-hidden group h-64 md:h-80 shadow-sm cursor-pointer">
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={spotlightArtist.name} src={spotlightArtist.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary-container/90 backdrop-blur text-on-secondary-container font-label-caps text-label-caps rounded-full mb-3 shadow-sm border border-secondary/50">{spotlightArtist.badge}</span>
                <h4 className="font-h2 text-h2 text-on-primary mb-1">{spotlightArtist.name}</h4>
                <p className="font-body-md text-on-primary/80">{spotlightArtist.description}</p>
              </div>
              <button className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg hover:bg-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </div>

          {/* Standard Card */}
          {emergingTalents.map((artist) => (
            <div key={artist.id} className="relative rounded-2xl overflow-hidden group h-64 md:h-80 bg-surface-alt shadow-sm border border-outline-variant/30 flex flex-col cursor-pointer hover:border-secondary transition-colors">
              <div className="h-1/2 w-full relative overflow-hidden">
                <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={artist.name} src={artist.image} />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between bg-surface-container-lowest">
                <div>
                  <h4 className="font-h3 text-h3 text-on-background mb-1 group-hover:text-secondary transition-colors">{artist.name}</h4>
                  <p className="font-body-sm text-on-surface-variant line-clamp-2">{artist.description}</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="font-label-caps text-label-caps text-secondary font-bold">Listen</span>
                  <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Music Player (Sticky Bottom) */}
      <div className="fixed bottom-0 w-full lg:w-[calc(100%-16rem)] lg:left-64 z-40 bg-primary-container text-on-primary border-t border-outline/20 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 left-0">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant/20 cursor-pointer">
          <div className="h-full bg-secondary-container w-[35%] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary-fixed rounded-full shadow-md scale-0 hover:scale-100 transition-transform cursor-pointer"></div>
          </div>
        </div>

        <div className="h-[72px] px-4 md:px-6 flex items-center justify-between">
          {/* Now Playing Info */}
          <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
            <div className="w-12 h-12 rounded bg-surface-variant overflow-hidden shrink-0 shadow-sm border border-outline/10">
              <img className="w-full h-full object-cover" alt={`${nowPlaying.title} by ${nowPlaying.artist}`} src={nowPlaying.image} />
            </div>
            <div className="truncate hidden sm:block">
              <h5 className="font-body-md text-body-md font-semibold text-on-primary truncate">{nowPlaying.title}</h5>
              <p className="font-body-sm text-body-sm text-on-primary-container truncate">{nowPlaying.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 w-1/3">
            <button className="text-on-primary-container hover:text-secondary transition-colors hidden md:block">
              <span className="material-symbols-outlined text-[24px]">shuffle</span>
            </button>
            <button className="text-on-primary hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>skip_previous</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary transition-colors hover:scale-105 shadow-md">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
            </button>
            <button className="text-on-primary hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>skip_next</span>
            </button>
            <button className="text-on-primary-container hover:text-secondary transition-colors hidden md:block">
              <span className="material-symbols-outlined text-[24px]">repeat</span>
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-end gap-4 w-1/3 text-on-primary-container hidden md:flex">
            <span className="font-data-md text-data-md">{nowPlaying.currentTime} / {nowPlaying.duration}</span>
            <button className="hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-[20px]">queue_music</span>
            </button>
            <div className="flex items-center gap-2 w-24">
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
              <div className="h-1 bg-surface-variant/30 rounded-full w-full">
                <div className="h-full bg-secondary-container rounded-full w-[70%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}