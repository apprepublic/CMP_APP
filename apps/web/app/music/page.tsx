'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Play, Music, Album, Mic, Headphones } from 'lucide-react';

const trendingSongs = [
  { id: '1', title: 'Midnight City', artist: 'M83', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3eLDEp6bhvmTxmxsyD8S77KztvBP2U7ggJsG56A68FFoAehzZspHWco5awpAtC0KvOuQa2SRGj7VdRk0Fkaz_Kx6DYsCk86548q14afeygrbZXYDVIueZ8LfHoalLUDHiqj38X8Sw_oRuJ4MFT-th0TKTQyAbZGo1suLS1-e2Cb3P5Nss0f2_kIUU5bronHT_9fc645zJQJdDxWnITc9U0_crLjmKtYSEWYPC9ted2GSxHAVzXFdUNK1MzX508zwyT1fb0AOWZ6mB' },
  { id: '2', title: 'Golden Hour', artist: 'Jazz Masters', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVNRwog5aRPQMnkIl8K4mD5e26IplYeZdZj_dQdrw86KsN5JdFyVLde0_0zcbRYHlfyDK3VQHUPqDsDEvhezm5PeDgPzj3jJsSE9r4mx_ZF_yU0og_z-ecoYCQKHqT3wPq0u0Om1VM7b-xNGW1t_ionNtBYa4IqBRBjiWg9VXOSQhbb6WVkg5ZrcNVSBKO5-TKJz_Ok4wsy24RHP-gTSspCt1FDekS4wuQqFaWB5Ejd7G8IlfqDYLUlMjRZl8AFfeVgoJhDZHT5qwZ' },
  { id: '3', title: 'Urban Echoes', artist: 'The Producers', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfeVmvB_5bvv_1XjiQRm1Xxjdpa1nRQoUFUdHvKWuH9uvT7OB2YLCQ3_2B3azBeQX71tfaYvZehExvvr4Lvz3E5icgECNi5hG3sfi3zV7WnyGMNNlLc-y8kyHGPKQ8CGS-Y6U9i1aHyhHBXzclHdCz8sUl94p-xBKuElE-uwjtkfpfaaZK_lUTbaSlcXsvrFQazEEA29n3AGMRj7s5DWBOjicoZF39Fv4W5ZgVUJcZ-1_ZB4BMx1C_SdKwTgSNMejzTJo67TJrsu14' },
  { id: '4', title: 'Deep Waters', artist: 'Oceanic', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZc7MXnF1IMGC1kNb5LVQLmD-tIcxPTwZXN_nq993KZfO35bKXpA3Z-E_bw2X-f-V1PLadyANryizjSxOrr6XrPDPkf20oMBlnFXxq-W_uCoAs_izDaEmlWpahLvmLxz1ffdostvZkRZxZuYzr44F0aDqjgBHKN-4fGSYnV-mvkjUb3dI7y5Ul0t5wOm5ld1ptcdn6x9KroZ7DyOV6ku_H0LgQ384OcWXFdrqRpfZhG2_Itdby6G18RLoWEHTA-5y-cfnEff-pb7t' },
];

const genres = [
  { id: '1', name: 'Afrobeats', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8OSK1AVqLwjxErFcz0X28Us6hsXiGyla-3hJXrKqo_G-X2XAggYBPd30RAcEm94IVf8PcgAj27N1Fw-TpQAcoXhQ5wpLtLkQkWthlFnsVrx85YNxcDJWc7bg0w1i0Z05_dnRH5B-ZIkY-VngvWIXmhdiuTEeAhVBhNh2ATPr6btUKVUYrRt1Ui9A4uEF8iIzHKRrOM2iOhgRTpuKC9GULviNJ6p38G_5rJ7ZSPGk0oIVGhGNTvoaFPJKMQUP0XJaKqJSFOx8TjTEY' },
  { id: '2', name: 'Highlife', icon: Music },
  { id: '3', name: 'Amapiano', icon: Album },
  { id: '4', name: 'Hip Hop', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzTBAcaVTt8B3XxoMunqknCjwu_87hcVcSSjIVtQm0Jm0JfxQYfE_pP-ggXbYmTCcv4-QRiinpPQ3_X18uvAT73LZukXyvWLqf69IWzUZbBiVJ2f0JiLbfP1Mk2K3IRsEWwFl8s3BK3d1w5JC1G_AhwjoY8yJdKccnJ7pG87uyutSY9qZPogNqgVqXx1uao1CxbYy9c0Yl3_H-dNWckqOpdtCD19uYremo_W-HYLhWXoSsHh3px8I_iRYK4dRhxQE-xbfmfCD0_Cfq' },
];

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageTransition className="min-h-screen bg-neu-bg pb-32 md:pb-8">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-neu-bg shadow-neu-flat border-b border-neu-bg-dark">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="sm" active>
            <img alt="User Profile" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxZALsq3LtoPthaLtklhy1dM1-Aebovw6D--bbMS8NWVByRkK8WUmiuPMBDBoz8KDkhWN4m2_T8oLVUK6iaB7XArmmbfoSZKzK28bHuUfQ1jsWEYI2hwLVfCL33RhPurUu9JadjrKAUI-3vOov-V1dbu1xblJo2v0YDCJOteNeAFYKNzGcX8dLeMpMe3e4P8cpDg5_ULQLZhffRGCx6plsWQb3H_rhXKn0mPjVwKPKIXI5wCZ1_bkRX3ClSD1EkoS8U2S_i8pu8Y5s" />
          </NeuIconBadge>
          <span className="font-h3 text-h3 text-neo-primary font-bold">CMPapp</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neu-bg shadow-neu-flat transition-colors text-neo-text-secondary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-[60px] max-w-container-max mx-auto md:px-gutter px-margin-mobile">
        {/* Search Section */}
        <section className="mb-6 mt-2">
          <div className="relative w-full max-w-2xl mx-auto">
            <Input
              placeholder="Find artists, songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5 text-neo-text-muted" />}
              className="pl-12"
            />
          </div>
        </section>

        {/* Featured Discovery (Bento Hero) */}
        <section className="mb-8">
          <NeuCard padding="none" interactive className="rounded-xl overflow-hidden bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white relative h-64 md:h-80 shadow-neu-raised border border-neo-primary/20">
            <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBQi3UEUQrIPKP1UljoWnh45ddDV3BUF8n8HdJvqMLw7UNbZVJnIekUQI4NMHdbrs_b8HvcIbzpTp2hxwN2Ox3wKKK1cqBGaq5_tDC6_l4F6udacP0OyuQ4cbc71BivBioZ1JPVk0Vgey95S2wpyGL0QGlRBULbgV-lV7YANdjUrjnBgZE3nwjDsVtTMWA7O0hzrIhYPE-0Ab_91OY4CiYCPVmioWdkD5QO1BE5q8XdPgEYQF9XkKi6fLp-Au_yM_QE81zg_jaiBDr1" alt="Featured" />
            <div className="absolute inset-0 bg-gradient-to-t from-neo-primary via-neo-primary/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
              <div>
                <NeuCard padding="none" className="inline-flex items-center gap-1 bg-neo-secondary/20 backdrop-blur border border-neo-secondary rounded-full px-3 py-1 mb-3">
                  <span className="font-label-caps text-label-caps text-neo-secondary tracking-wider">Exclusive Drop</span>
                </NeuCard>
                <h2 className="font-h2 text-h2 text-white mb-1">Neon Dreams</h2>
                <p className="font-body-lg text-body-lg text-white/80">The new album by Synthwave Collective</p>
              </div>
              <NeuIconBadge size="lg" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-neo-primary ml-0.5" />
              </NeuIconBadge>
            </div>
          </NeuCard>
        </section>

        {/* Trending Now */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-h3 text-h3 text-neo-text-primary">Trending Now</h2>
            <a className="font-body-sm text-body-sm text-neo-secondary font-semibold hover:underline" href="#">View All</a>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <StaggerContainer stagger={0.06}>
              {trendingSongs.map((song) => (
                <StaggerItem key={song.id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <NeuCard padding="none" interactive className="flex-none w-36 md:w-48 snap-start rounded-lg border border-neu-bg-dark shadow-neu-flat cursor-pointer overflow-hidden">
                      <div className="relative aspect-square rounded-md overflow-hidden mb-3 border border-neu-bg-dark">
                        <img className="w-full h-full object-cover" src={song.cover} alt={song.title} />
                        <div className="absolute inset-0 bg-neo-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <NeuIconBadge size="md" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 text-neo-primary ml-0.5" />
                          </NeuIconBadge>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-body-md text-body-md font-semibold text-neo-text-primary truncate">{song.title}</h3>
                        <p className="font-body-sm text-body-sm text-neo-text-secondary truncate">{song.artist}</p>
                      </div>
                    </NeuCard>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Genres (Bento Grid) */}
        <section className="mb-8">
          <h2 className="font-h3 text-h3 text-neo-text-primary mb-4">Explore Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Afrobeats (Large Hero Tile) */}
            <NeuCard padding="none" interactive className="col-span-2 row-span-2 relative rounded-xl overflow-hidden shadow-neu-flat border border-neu-bg-dark group cursor-pointer aspect-square md:aspect-auto md:h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 via-neo-primary/40 to-transparent z-10"></div>
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={genres[0].image} alt="Afrobeats" />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="font-h2 text-h2 text-white">Afrobeats</h3>
                <p className="font-body-sm text-body-sm text-white/80 mt-1">Trending global sounds</p>
              </div>
            </NeuCard>
            {/* Highlife */}
            <NeuCard padding="none" interactive className="relative rounded-xl overflow-hidden shadow-neu-flat border border-neu-bg-dark group cursor-pointer aspect-square bg-neu-bg">
              <div className="absolute inset-0 bg-neo-primary/70 z-10 group-hover:bg-neo-primary/80 transition-colors"></div>
              <img className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYI0-36IxWfz0untMb3MwzsRqzrAePJ4eu9VCffNHax9si-979vs2E6W7XVyE99zqluS-4_Qd2pzcZaeCaKdjpCIoQGDfAnBOA7HgptmWrPQjq2QumD4Oo-Vx4EBQIzN7l-AlFpQMDKs-xrPXns0QESsXK-uwSosLoDqdVOfjVex2fdHbiq4DCHdbgiGIulyTq5-I7Djl0Oggvarrh-tedhWIqn1N6Wt6lLISATGzLJTjQFdDolabdMA5omc-OaURjQqmF0z1nycBP" alt="Highlife" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <NeuIconBadge size="lg" active className="bg-neo-secondary/20 mb-2">
                  <Music className="w-6 h-6 text-neo-secondary" />
                </NeuIconBadge>
                <h3 className="font-h3 text-h3 text-white text-center">Highlife</h3>
              </div>
            </NeuCard>
            {/* Amapiano */}
            <NeuCard padding="none" interactive className="relative rounded-xl overflow-hidden shadow-neu-flat border border-neu-bg-dark group cursor-pointer aspect-square bg-neu-bg">
              <div className="absolute inset-0 bg-[#271900]/70 z-10 group-hover:bg-[#271900]/80 transition-colors"></div>
              <img className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ56svR9d8j91Vc5OCMapLCR2toB98jqNDlpdfe0ujUBdCss7bg_p0SJpsu7Xy6ZUmIFiw7x5LHOeFHdiyXUHLDrjy-baZJCeTK54Ml9UA-n8w2-WXyIBPzKPVE7KaFwxj-whwsI0uJovwHnjDxNvJWnIQkDUgaelUurfdlYigE0Da1w63AY1Ap5nPJhlWH9UIHvDPaP17ofHF4ZPREexB1RIMLR3ZLyyCcaub_zHB76ODE8wZJOdDDIfYfEwyYyhvDdzY_3bv8d0d" alt="Amapiano" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <NeuIconBadge size="lg" active className="bg-neo-secondary/20 mb-2">
                  <Album className="w-6 h-6 text-neo-secondary" />
                </NeuIconBadge>
                <h3 className="font-h3 text-h3 text-white text-center">Amapiano</h3>
              </div>
            </NeuCard>
            {/* Hip Hop (Wide bottom) */}
            <NeuCard padding="none" interactive className="col-span-2 relative rounded-xl overflow-hidden shadow-neu-flat border border-neu-bg-dark group cursor-pointer h-32 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-neo-primary/90 to-neo-primary/30 z-10"></div>
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={genres[3].image} alt="Hip Hop" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
                <h3 className="font-h3 text-h3 text-white">Hip Hop</h3>
                <p className="font-body-sm text-body-sm text-white/80">Fresh beats & flows</p>
              </div>
            </NeuCard>
          </div>
        </section>

        {/* Top Artists Section */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-h3 text-h3 text-neo-text-primary">Top Artists</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
            {[
              { name: 'DJ Horizon', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnx2BlrVWc-5amdVgIcnpCTMxgAXr1FHDW1o5HZn7fwpnsgaMYYptVtKEZQGMctzRWRNsMVn3mMG9FqMhhTXTwumHUGCWd-tTPizCos3IUgycRFrswTFdNqB3Ktx09xOztClMwBqgaT9xKFMZGrTnVgth-umYtHzQkbPPmm33JJBsJGnO6X9SQ9Op7WqPsdEvgHLIQEK5y4toazphkDkKkg2Nl4YmHvtX5Rmy1tIk2zrvVKYxtMKSaFTsObTBFn4xqKk-Ih4_WK6BL' },
              { name: 'Luna Ray', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Af3eE_a5GnQXgUejCqF84ctWacoCpUwWZir6ARQV3-Q2P6NyQRjOoOeDqezMi-w1ZEIocCPAxpbwKI-5AqVavvhuMQKI0eU6L9bd_rIgaFX4oawlCkK3nR-ZGepfPizi2JRJppkcpClTFJhr_ou6s_m1QIHcao1njfS844c-zPeASWIKABS9TSJIVA-TVpKCXVn0HDjeHXn4ldEPxKru_SW8PJIet_RjP0ItDo35Wa0KnOTk07l7TlMIhtcu4L1KScE7015EkhLu' },
              { name: 'SynthX', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzd2O0MXDHdCXA34o22ti3gHptyVbN-mLZ-8hQ3qNUotTYBKEZFF1sDD8wAgWxYFF8XJ7wQxP_yw1sJlOYQDixjk4UvSx0Y8Ta3AtyG8mTivlIyH8QYL31-s93GNc7ImJvLdLIxih0I_sPypIZuLeQnEiCDVLgkTtMw7D-OHiQ3Vr_QtUocjNTrnJ57ZraP3mNprOzJQ7xwbZPIop_bYgYz_HNvIsHbngbjZzvjBwTRJL-FAlpq_g2JA1eNMuY8SiRLp8TB1MzzMFw' },
              { name: 'Sonic Architect', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCDnSeEmgZpPzHPCtqhWewYJA5ZgUrndl1zOj9P8i8Kt-RzfuuT1Dvz98uDkwxjcJ7_3pn49KcKY1sx2X7-EO88vh0KTSZooXDLb44Nu3tI5mMNjlzanZYEYNsJZ3mV_yWah2rJczCNmQW6HX1lWGc-u7u6JDYnngv1J6Cg00OX56-7Wa9Kc65kYnYRp0vF167BW7h7uoz0c73kOtJ3mmik0XZ_L_MkRkMSmU-HzptCrzxywLodWsZBFukUW0WqwIHSt6HC5BbRHyK' },
            ].map((artist, index) => (
              <motion.div key={index} className="flex-none w-24 md:w-32 snap-start flex flex-col items-center gap-2 cursor-pointer group" whileHover={{ y: -4 }}>
                <NeuIconBadge size="lg" active className="border-2 border-transparent group-hover:border-neo-secondary transition-colors overflow-hidden shadow-neu-raised-sm">
                  <img className="w-full h-full object-cover" src={artist.image} alt={artist.name} />
                </NeuIconBadge>
                <p className="font-body-sm text-body-sm font-semibold text-neo-text-primary truncate w-full text-center">{artist.name}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Global Music Player Bar */}
      <div className="fixed bottom-[72px] md:bottom-0 left-0 w-full z-40 bg-neu-bg shadow-neu-raised backdrop-blur-lg border-t border-neu-bg-dark">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neu-bg shadow-neu-inset cursor-pointer group/slider">
          <div className="h-full bg-neo-secondary w-[45%] relative group-hover/slider:h-1.5 transition-all shadow-neu-raised-sm">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-neo-secondary rounded-full shadow-md opacity-0 group-hover/slider:opacity-100 transition-opacity translate-x-1/2"></div>
          </div>
        </div>
        <div className="max-w-container-max mx-auto w-full px-4 md:px-gutter h-20 flex items-center justify-between gap-4">
          {/* Left: Thumbnail & Info */}
          <div className="flex items-center gap-3 w-1/3 min-w-[150px]">
            <NeuCard padding="none" className="w-12 h-12 rounded-md overflow-hidden bg-neu-bg shadow-neu-raised-sm shrink-0">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH4GNQCLvKvNKPCcazzogBucp41BK0-Z2Lpo_J82s-2xFti3MdQoFsmRCDKfXMTeVlhIgpIVGSwo6viRM_Q0lJyJIQgp1vQHhV6mSi4q_9Rcp0l308aUJ_tpTP7y06bDA1IjLKa1XYjb-bo9z0t1h1Q2XJ9Lp2x8STy8-KSOiqnr7St1GNBEDvZRueEXioY2QrXCGJooFw4bzlFgAlWfcB6syrxx3SBLcLjZIuoKFM1V1vHmB1GNweAhSqKadvNWGM2kFUxk83pQDU" alt="Now Playing" />
            </NeuCard>
            <div className="flex flex-col hidden sm:flex overflow-hidden">
              <span className="font-body-md text-body-md font-semibold text-neo-text-primary truncate">Midnight Synthesis</span>
              <span className="font-body-sm text-body-sm text-neo-text-secondary truncate">Luna Echo</span>
            </div>
          </div>
          {/* Center: Playback Controls */}
          <div className="flex items-center justify-center gap-2 md:gap-6 w-1/3">
            <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors p-2 active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[24px]">shuffle</span>
            </button>
            <button className="text-neo-text-primary hover:text-neo-secondary transition-colors p-2 active:scale-95">
              <span className="material-symbols-outlined text-[32px]" data-weight="fill">skip_previous</span>
            </button>
            <NeuIconBadge size="lg" active className="bg-neo-secondary shadow-neu-raised-sm cursor-pointer hover:bg-neo-secondary/90 hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-[28px]" data-weight="fill">pause</span>
            </NeuIconBadge>
            <button className="text-neo-text-primary hover:text-neo-secondary transition-colors p-2 active:scale-95">
              <span className="material-symbols-outlined text-[32px]" data-weight="fill">skip_next</span>
            </button>
            <button className="text-neo-text-secondary hover:text-neo-secondary transition-colors p-2 active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[24px]">repeat</span>
            </button>
          </div>
          {/* Right: Secondary Controls */}
          <div className="flex items-center justify-end gap-3 w-1/3 min-w-[100px]">
            <button className="text-neo-text-secondary hover:text-neo-text-primary transition-colors active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[20px]">queue_music</span>
            </button>
            <div className="flex items-center gap-2 w-24 md:w-32 group/vol">
              <span className="material-symbols-outlined text-[20px] text-neo-text-secondary group-hover/vol:text-neo-text-primary transition-colors">volume_up</span>
              <div className="w-full h-1 bg-neu-bg shadow-neu-inset rounded-full cursor-pointer relative">
                <div className="absolute top-0 left-0 h-full w-[75%] bg-neo-secondary rounded-full group-hover/vol:bg-neo-secondary transition-colors shadow-neu-raised-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-neu-bg shadow-neu-raised">
        <Link href="/" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[24px]">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-neo-secondary text-neo-primary rounded-xl px-3 py-1 scale-90 transition-all shadow-neu-raised-sm">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
          <span className="font-label-caps text-label-caps mt-1 font-bold">Music</span>
        </button>
        <Link href="/marketplace" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[24px]">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-neo-text-secondary px-3 py-1 hover:text-neo-secondary transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>
    </PageTransition>
  );
}