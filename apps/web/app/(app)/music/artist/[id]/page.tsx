'use client';

import Link from 'next/link';

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  // Mock data for the artist
  const artist = {
    name: 'Aisha M.',
    genre: 'Afro-Fusion / R&B',
    bio: "Lagos-born singer, songwriter, and producer blending traditional highlife rhythms with modern R&B and electronic textures. Aisha's sound is the heartbeat of the new creative economy.",
    stats: {
      streams: '12.4M',
      followers: '850K',
      listeners: '2.1M'
    },
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJyScrcc2YMz6GNwZ4-LzLytdHEeh6DDJUBd5QwnyN9-nAJ8AzxlgFXy2RHsYXfDfkAEmlYkILF60gNRjXTxAf0C4w3W3zx727aHyrvgsJfJgVCfYGCoUqJT3jUM3-9NiN9x2zj2Guh6NMI1fhwE1FV_YFEql1F-9Bca92iJaxjxYxQgv-FoKEyVT5Cnz4M_Q2X2QkgqB9GF1ev41H_drzSOmIoPuBteUgCL7RIYL9tiYHHXd5p4U02IDkUJkM9sCmUQwE0xByETE',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBm5MX0bZ5EXjRosQ9zaSSsknq22ZKyfAKDsPadqn5sJ4IAMbu77DcuV_wytvKPKnYLUtP_r59TWhAPpCE8-ckjQVxD9QLE8-a9pBcqDPyvKBhGzKSK0Bed9CK1VFprsZ0tbCN3DtKygdCuCMJRG_aDiN57NKwu8CKOZifjC8U4dmBGmgTUUKyphsnqk8nvPYTd9x5KA7E8uSuSBH0TMR-MWXCc2rszhvIBTzU12jVc1eVqiTVlY5jdWj1MinJvbLxWTocxBKWhfQ'
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Hero Section */}
      <section className="relative bg-primary-container text-on-primary rounded-xl overflow-hidden shadow-sm">
        {/* Cover Image */}
        <div 
          className="h-64 md:h-80 w-full bg-cover bg-center relative" 
          style={{ backgroundImage: `url('${artist.cover}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/60 to-transparent"></div>
        </div>
        
        {/* Artist Info */}
        <div className="px-6 lg:px-10 -mt-16 relative z-10 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <img 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary-container shadow-xl object-cover" 
                src={artist.avatar} 
                alt={`${artist.name} Profile`}
              />
              <div className="text-center md:text-left mb-2">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary">{artist.name}</h1>
                <p className="font-body-lg text-body-lg text-secondary-fixed mt-1">{artist.genre}</p>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex justify-center md:justify-end mb-4 md:mb-0">
              <button className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-8 py-3 rounded-lg shadow-lg hover:bg-secondary-fixed-dim transition-colors w-full md:w-auto">
                Follow
              </button>
            </div>
          </div>
          
          <div className="mt-8 max-w-3xl">
            <p className="font-body-md text-body-md text-on-primary-container">
              {artist.bio}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl border-t border-on-primary-container/20 pt-6">
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Total Streams</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.stats.streams}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Followers</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.stats.followers}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Monthly Listeners</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.stats.listeners}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Song List Section */}
      <section className="mt-12 w-full">
        <h3 className="font-h3 text-h3 text-on-background mb-6">Popular Tracks</h3>
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/30">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-outline-variant/30 text-on-surface-variant font-label-caps text-label-caps">
            <div className="w-8 text-center">#</div>
            <div>Song Title</div>
            <div className="hidden sm:block">Duration</div>
            <div className="text-right">Actions</div>
          </div>
          
          {/* Track Rows */}
          <div className="divide-y divide-outline-variant/20">
            {/* Track 1 */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-surface-container transition-colors group">
              <div className="w-8 text-center font-data-md text-data-md text-on-surface-variant">1</div>
              <div className="flex items-center space-x-4">
                <img className="w-12 h-12 rounded bg-surface-dim object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFYK9kkVrG10ofKu9MI9fGPNYpYYPxLncZBvjMIkaxPzuehBYqZkr9AheE7Fx9yIbB4-du2F853ofDaz4q3PDPQBDfMzBbsyTlwMKo9AjAhoEhB1FUWrcY_cswsMhyiYAcjj-u9LzjC29C3P5hMRE6nUxeXHbWhQx7Ar3on3v6lK-HcVx66x13hw1Ey8A7725kZUOt4mOZBvfj-0tDn3jUkGCr3wjhNpnQqXybe5AV98o6xYBdvtuEv54NiGOKQaqaM2YzBq-8qA4" alt="Album Art" />
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-background group-hover:text-primary transition-colors">Midnight in Eko</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Aisha M.</p>
                </div>
              </div>
              <div className="hidden sm:block font-data-md text-data-md text-on-surface-variant">3:42</div>
              <div className="flex items-center space-x-3 justify-end">
                <button className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <button className="flex items-center space-x-1 border border-secondary-container text-secondary-container px-3 py-1.5 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-data-md text-data-md">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>+3 <span className="material-symbols-outlined text-[14px] inline-block align-text-bottom">monetization_on</span></span>
                </button>
              </div>
            </div>

            {/* Track 2 */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-surface-container transition-colors group">
              <div className="w-8 text-center font-data-md text-data-md text-on-surface-variant">2</div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-surface-dim flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">music_note</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-background group-hover:text-primary transition-colors">Golden Hour</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Aisha M. ft. Burna Boy</p>
                </div>
              </div>
              <div className="hidden sm:block font-data-md text-data-md text-on-surface-variant">4:15</div>
              <div className="flex items-center space-x-3 justify-end">
                <button className="w-10 h-10 rounded-full border border-primary-container text-primary-container flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <button className="flex items-center space-x-1 border border-secondary-container text-secondary-container px-3 py-1.5 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-data-md text-data-md">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>+3 <span className="material-symbols-outlined text-[14px] inline-block align-text-bottom">monetization_on</span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Artists (Horizontal Scroll) */}
      <section className="mt-12 mb-12 w-full">
        <h3 className="font-h3 text-h3 text-on-background mb-6">Similar Artists</h3>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Artist Card 1 */}
          <div className="min-w-[160px] flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <img className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEKvcFHlbqY5w9ndKPjw2-eTZS6F408xVSmnI76zVdm8Tudp_uYuH7qTMAUrLQ2yAehuRDrpcL9q23ke9mdUY92hfmrj8BN7s9CUZ_yQNeJXn2S06ubKK9j8lPazkf02fenk37fwpO48fPD84LJLVtMsZqV69jnNfJL1KCeMTm9IMNFyBQ-SdM-Pxc9QvENDU4iYN6fOTqPVyB5aEgUMdFRb5arM5GdZvPGKnCvCvFQZRz-PgDp8airQ4o9FlBUvlKyg8U4PBdJII" alt="Tomiwa" />
            <p className="font-body-md text-body-md font-semibold text-center text-on-background">Tomiwa</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">Afrobeats</p>
            <button className="border border-primary-container text-primary-container font-label-caps text-label-caps px-4 py-1.5 rounded-lg hover:bg-primary-container hover:text-on-primary transition-colors w-full">Follow</button>
          </div>
          {/* Artist Card 2 */}
          <div className="min-w-[160px] flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <img className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbqajHROI9Y3HckFqvKHDO-gnz9ABDULlmQqJS9dx51zBn-k77gcEm3hhjE7EjuNxEMjgqhcmGZVFXQ4D-JjbHT3PN8BjdWHo3hJs24GQrKuOrB4U4UltF4IRk4LSbJEwwFqU4hk5jzCX_LcvPRgojaQnYG7rXC8IgqwLHDKd6SHuQWvo-pJ99Je6JPvwRR6P2VCDDjEEnlFO4uOgGPPypSZ_0axU_AiNEv2HSwAihj797cRiYZJ9IUj-hD-RV_OrGmhI7pMyVhY" alt="Zainab" />
            <p className="font-body-md text-body-md font-semibold text-center text-on-background">Zainab</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">Neo-Soul</p>
            <button className="border border-primary-container text-primary-container font-label-caps text-label-caps px-4 py-1.5 rounded-lg hover:bg-primary-container hover:text-on-primary transition-colors w-full">Follow</button>
          </div>
          {/* Artist Card 3 */}
          <div className="min-w-[160px] flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-full bg-surface-dim flex items-center justify-center text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-[32px]">person</span>
            </div>
            <p className="font-body-md text-body-md font-semibold text-center text-on-background">DJ K-Flex</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">Producer</p>
            <button className="border border-primary-container text-primary-container font-label-caps text-label-caps px-4 py-1.5 rounded-lg hover:bg-primary-container hover:text-on-primary transition-colors w-full">Follow</button>
          </div>
        </div>
      </section>
    </div>
  );
}
