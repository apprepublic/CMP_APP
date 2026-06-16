'use client';

import { useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, Download } from 'lucide-react';

const genres = ['All Genres', 'Afrobeats', 'Highlife', 'Amapiano', 'Alte', 'Hip Hop', 'R&B'];

const trendingSongs = [
  { id: 1, title: 'Lagos Nights', artist: 'Burna Boy', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuYoPpo9F8aR-AxWbnqvvg-_sloUORxhAKDUwj6JFxzcz0ywXP0Cu0Dp8Iy9ngh80cQMVGpKRxsrLcQdw3qJAZfXvFa1L2zPO0jvJ2fIaoyM_-oH9U0sarhDtl7FOb-zT5pSFor2fO3LJpYauSZ-K9MnAYoHu301hTKZmis-X3WDhabiPRxmR5j4_fWRJZkzv5LLEcJtE_Ilx2q1ZJLPmtmipFovObg9r8Lk7inN9bU1C4GmdydzRhhWn2v-fTPP-tKoVCyYIwCdQ' },
  { id: 2, title: 'Golden Hour', artist: 'Tems', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpNZpU_qg5uTDQr7Y-vqpzGIXd05y_19o0nzt8gxZFy2FRRsK5eEJ1nxemIXYirFLdF63c0EIKsS9O7Inv2xoypwmJvFwMMsreLTKf2JXZ1fj_tVZRvLaxHo0Bg_rwr2zrl_2YA6vwh2fHge9fWPB8OMIeCP20efkm-i5j1PS9UZ97C4DUYopidDCsQAoftBrhI0uRSCiOIdXoGSIWLt1ZEHHhO9Y3oPYvS0bQAYvUhWYsLXnOTvXAsA95mOPNaNF9o-3PD-Z9oqA' },
  { id: 3, title: 'Rhythm & Flow', artist: 'Wizkid', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyZ8e72BTjweMOyOlT7nJINkZtJPmHObQn3m37EAfb87ZFJ1epWp1sdYxDJuhhOrWwINs2LketEQpi95TKm7ARM5rixCSmzLvgPvuxYYe5hh2WexCJRK1q7KAqEq2NRbU_IkSiXvxUcR7bBW2vOskwqEkdcSO8c1ULFvvNvUBfW2FhXnPcbwkO-BQd0FGsMMEgbVOFXhBYtvLqqRz4JIqkWzD72BFTDZEWjMdH9LdODoubjdfIg1gTf63F3NdVkSJlpXjQahGrVE0' },
  { id: 4, title: 'Studio Sessions', artist: 'Ayra Starr', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcQFONTeth1n9SVG2HDP6K2VdA04oRURkLB8kdv-NYCtprtRRq5Gfw0ylTS0NXPXWsfIrjmXEJ_FD8SziVd1f_i_yi--WdLzy7WstU1W9NxdC0Qit83oKS4MX70KzxeW4ssaqX6tK45l8HWYwmb2c5qsZT7AKNXBc7V1ldwhDpV2odJLze-mCR981ZpsSNnb1o92oqzQHJMMaVU8x5SVuV7PAgSw8BOxcSkWNdNNV7jN6pCTojrDXpXmtZlBFzKIwIIE8auK5aG-E' },
];

const spotlightArtist = {
  name: 'Oxlade',
  description: "New EP 'Oxygen' out now",
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAUeUR7ZHP-etywiOhtRLXPXqi4CuuiQvSyoeko3uCtsjRdMu_He-CDVBiWcK9_zqHXZDSjQuhBDfZHzWYMbyvPpNLyA9B-X06KskDXwEQyYw1eh0q7ThHyKoMDJFsmy5_tPsxW31MWwfseSfDhbTC1e3Ze4_msqdXbk2S1p9_Qb0QH-j_zu_ksOMcSDgxNnpdiifbdxEG-HhtYCXYRfCvEZkd6aYDsXLLRIzMNoS_iA6XbwzJyFpDD8ZSIiWGwn4RhcwvaOcmCDs',
  badge: 'Spotlight',
};

export default function MusicPage() {
  const [activeGenre, setActiveGenre] = useState('All Genres');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <PageTransition className="space-y-12">
      {/* Hero Search Section */}
      <NeuCard padding="lg" className="relative overflow-hidden shadow-neu-raised bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neo-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neo-secondary/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <h2 className="font-h1-mobile lg:font-h1 text-h1-mobile lg:text-h1 text-white">Discover the Sound of the Creative Economy</h2>
          <div className="w-full relative group">
            <Input
              className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 rounded-xl pl-14 pr-6 py-4 font-body-lg focus:border-neo-secondary focus:ring-0 transition-all shadow-neu-inset"
              placeholder="Find artists, songs, podcasts..."
              icon={<Search className="w-6 h-6 text-white/70 group-focus-within:text-neo-secondary transition-colors absolute left-4 top-1/2 -translate-y-1/2" />}
            />
          </div>
        </div>
      </NeuCard>

      {/* Genre Pills */}
      <section>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-all shadow-neu-flat hover:shadow-neu-raised-sm active:scale-95 ${
                genre === activeGenre
                  ? 'bg-neo-secondary text-neo-primary shadow-neu-raised-sm'
                  : 'bg-neu-bg text-neo-text-secondary'
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
          <h3 className="font-h3 text-h3 text-neo-text-primary">Trending Now</h3>
          <a className="font-body-sm text-body-sm text-neo-secondary font-semibold hover:underline" href="#">See all</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
          <StaggerContainer stagger={0.06}>
            {trendingSongs.map((song) => (
              <StaggerItem key={song.id}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  <NeuCard padding="none" interactive className="group cursor-pointer shadow-neu-flat overflow-hidden">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-neu-bg">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`${song.title} by ${song.artist}`} src={song.image} />
                      <div className="absolute inset-0 bg-neo-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <NeuIconBadge size="md" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Play className="w-5 h-5 text-neo-primary ml-0.5" />
                        </NeuIconBadge>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary truncate">{song.title}</h4>
                      <p className="font-body-sm text-body-sm text-neo-text-secondary truncate">{song.artist}</p>
                    </div>
                  </NeuCard>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Emerging Talents - Bento Grid Style */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-h3 text-h3 text-neo-text-primary">Emerging Talents</h3>
          <div className="flex gap-2">
            <NeuIconBadge size="sm" interactive className="cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-neo-text-primary">chevron_left</span>
            </NeuIconBadge>
            <NeuIconBadge size="sm" interactive className="cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-neo-text-primary">chevron_right</span>
            </NeuIconBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card - Spotlight */}
          <NeuCard padding="none" interactive className="col-span-1 md:col-span-2 relative rounded-2xl overflow-hidden group h-64 md:h-80 shadow-neu-raised cursor-pointer">
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={spotlightArtist.name} src={spotlightArtist.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 via-neo-primary/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
              <div>
                <NeuCard padding="none" className="inline-block px-3 py-1 bg-neo-secondary/90 backdrop-blur text-neo-primary font-label-caps text-label-caps rounded-full mb-3 shadow-neu-raised-sm border border-neo-secondary/50">
                  {spotlightArtist.badge}
                </NeuCard>
                <h4 className="font-h2 text-h2 text-white mb-1">{spotlightArtist.name}</h4>
                <p className="font-body-md text-body-md text-white/80">{spotlightArtist.description}</p>
              </div>
              <NeuIconBadge size="lg" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer hover:bg-neo-secondary/90 transition-colors">
                <Play className="w-6 h-6 text-neo-primary" />
              </NeuIconBadge>
            </div>
          </NeuCard>

          {/* Standard Card */}
          <NeuCard padding="none" interactive className="relative rounded-2xl overflow-hidden group h-64 md:h-80 bg-neu-bg shadow-neu-flat border border-neu-bg-dark flex flex-col cursor-pointer hover:border-neo-secondary/50 transition-colors">
            <div className="h-1/2 w-full relative overflow-hidden">
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Fave" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzLGvgJpTWyp5b6RtIEsUB0RxpzhO3qdAnl12-MhCQtVc5ZUJwKctKDislZDoAlzfik90UpzVzbpaXHVGqhEgdZSm8VceSsDEdeRbXulbPqnU6ufq9Z2udTsO43Vl13EqRT_FcjdEK4E50YHeZnJDDrMQHcOOw8u15mfsli1_zpD4aT_LiZyMBKewKcZmF3XpMkKnPkObEVccDswY2PewdkGeay9Vk1EaAzLxgfW7O_0cBCum4MY3bpYYkiyXVUw_cpzCYcO0zyeI" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-neu-bg">
              <div>
                <h4 className="font-h3 text-h3 text-neo-text-primary mb-1 group-hover:text-neo-secondary transition-colors">Fave</h4>
                <p className="font-body-sm text-body-sm text-neo-text-secondary line-clamp-2">Blending soulful vocals with contemporary Afropop rhythms.</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="font-label-caps text-label-caps text-neo-secondary font-bold">Listen</span>
                <span className="material-symbols-outlined text-[16px] text-neo-secondary">arrow_forward</span>
              </div>
            </div>
          </NeuCard>
        </div>
      </section>

      {/* Global Music Player (Sticky Bottom) */}
      <div className="fixed bottom-0 w-full lg:w-[calc(100%-16rem)] lg:left-64 z-40 bg-neu-bg shadow-neu-raised border-t border-neu-bg-dark left-0 transition-all duration-300">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neu-bg shadow-neu-inset cursor-pointer">
          <div className="h-full bg-neo-secondary w-[35%] relative shadow-neu-raised-sm">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-neo-secondary rounded-full shadow-md scale-0 hover:scale-100 transition-transform cursor-pointer"></div>
          </div>
        </div>

        <div className="h-[72px] px-4 md:px-6 flex items-center justify-between">
          {/* Now Playing Info */}
          <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
            <NeuCard padding="none" className="w-12 h-12 rounded bg-neu-bg shadow-neu-raised-sm overflow-hidden shrink-0 border border-neu-bg-dark/10">
              <img className="w-full h-full object-cover" alt="Lagos Nights by Burna Boy" src={trendingSongs[0].image} />
            </NeuCard>
            <div className="truncate hidden sm:block">
              <h5 className="font-body-md text-body-md font-semibold text-neo-text-primary truncate">Lagos Nights</h5>
              <p className="font-body-sm text-body-sm text-neo-text-secondary truncate">Burna Boy</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 w-1/3">
            <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors hidden md:block">
              <Shuffle className="w-6 h-6" />
            </button>
            <button className="text-neo-text-primary hover:text-neo-secondary transition-colors">
              <SkipBack className="w-8 h-8" />
            </button>
            <NeuIconBadge size="lg" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer hover:bg-neo-secondary/90 hover:scale-105 transition-all">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-neo-primary" />
              ) : (
                <Play className="w-6 h-6 text-neo-primary ml-0.5" />
              )}
            </NeuIconBadge>
            <button className="text-neo-text-primary hover:text-neo-secondary transition-colors">
              <SkipForward className="w-8 h-8" />
            </button>
            <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors hidden md:block">
              <Repeat className="w-6 h-6" />
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-end gap-4 w-1/3 text-neo-text-secondary hidden md:flex">
            <span className="font-data-md text-data-md">1:24 / 3:45</span>
            <button className="hover:text-neo-secondary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 w-24">
              <Volume2 className="w-5 h-5" />
              <div className="h-1 bg-neu-bg shadow-neu-inset rounded-full w-full">
                <div className="h-full bg-neo-secondary rounded-full w-[70%] shadow-neu-raised-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}