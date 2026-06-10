export const dynamicParams = true;

export async function generateStaticParams() {
  return [{ artist: 'demo' }];
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data for demo
const mockArtist = {
  id: '1',
  name: 'Luna Echo',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUqFF9lPckikAP94ny0HaBsWkvy1MP4AoLDVurdEg-Tc0Ldyfvl0TjOjYZi3C9RnUVcVzLmLwUuwN-QoMbjM78h10T2eHfTW0DBgPJmt0Z8pA2_cBcIvsUUo3XLegqviMYbIgSaKKjy0uGx1bVvVMbBM8MUNulKpAr14V7_lZ1QbIT5FE78_wbF8qAl46v6ysKpc82r55TscXgIMwkRe1KSUhG1M1So4PH1pawTsvnvIUdMG5j8rx4JT-mu7PCyEHP5xwnAtISjZqy',
  coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhUxL0UWsFWGNjn8swFhtvKB0WTOt2fMRJpy7hB3GnXI9v7tF-CKMwnVz4zBgLHwmKOLvv7uiRxAOjweav5K5WcquM0iSN6da5JD_O6jtfXL1kgSbL9vyac6Hn0iwPSSkmSAAGD51Bx_VZbL2pbmP6pr8MEjvLKRuVkq6TeYaon326Zqdqb8sxrS_z6ZGGN7-jhNhSRv6G09uVgEaI4PVd5Cs6ZdVXUVVAdsTko6wQ72ldK3LjDFmK5ofvFc4nDBqWb3O6baAqXI1E',
  monthlyStreams: '2.4M',
  isVerified: true,
  isFollowing: false,
};

const topTracks = [
  { id: '1', title: 'Midnight Synthesis', duration: '3:42', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLfnKywWI7LcD-cyFOp7oh0bsk0QICoiK0fm9WSA86FgBjnEBBMoxP28QXxeFXy0t4_NSiNoE6aHpOBzsPZnYH_kz8mJwENrhGQnuz7IhDJLRq06VW0z2X4rJkq-JPAperZpKCsAKtpGkOB2P_BjduAw2BZPi4Cp5-RUcrPAEdSBSHeuNd8J7lSkBrp3KJAFp1lN6f8D6vQ9U9LwJ0W6d2Kad1_TdRTNiuxx7YDpGiCsYpUngDokinLwme_Tvrd731CeR0L4R1oyr_', plays: '450K' },
  { id: '2', title: 'Neon Echoes', duration: '4:15', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoLX4ZDuiE5hLuCvQxN6Lt10WD1SF8NtYIf69K5QkOt_8-Qo9lexyWu7UcAtbs2q8wml4HUqDrHVAeA7XrTmVUav8WDQbpf_1dCOn-nybBYJVX2oEAukTWgLRu3V0NcP2CC7C1zT1xb2DUIaApxH1qP4Rb_m47DK4tNwofzeRGzXF0PSydgn8Cw2GDY02RgwzD4JeS6eTkq2o8V-oehq1pN2_4ZQPppwaMqA7RAWpVUP2VslvhkDHDFhUSWdbj5JKrNsXUbdLg8Zw7', plays: '380K' },
  { id: '3', title: 'Digital Horizon', duration: '2:58', cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDctWobt1cCbQkcoiwuGb4tr7O0DFlRsJ2BiRuVAcMM3CYUoUwhZUQt2UIBNXh3BjtKr-CYGMOq0zajKVdr1-VzD6dqWCszTodiPJZbtkALOmBsI-YgIfFYdqdq13DCQxgo7gfXgNMqd-HGMtFJC51IJOuj2sD8oE7eRQpRlT_-g3d0alsMZy6tS80PTrDRBXPvkRvjM7yeiKsyuaTdFzFjsmtZl-b7hSGe24va33027Xvha4ugoNaw3p8XxPaMAH8b00dwMn3lhTOm', plays: '290K' },
];

const nowPlaying = {
  title: 'Midnight Synthesis',
  artist: 'Luna Echo',
  cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH4GNQCLvKvNKPCcazzogBucp41BK0-Z2Lpo_J82s-2xFti3MdQoFsmRCDKfXMTeVlhIgpIVGSwo6viRM_Q0lJyJIQgp1vQHhV6mSi4q_9Rcp0l308aUJ_tpTP7y06bDA1IjLKa1XYjb-bo9z0t1h1Q2XJ9Lp2x8STy8-KSOiqnr7St1GNBEDvZRueEXioY2QrXCGJooFw4bzlFgAlWfcB6syrxx3SBLcLjZIuoKFM1V1vHmB1GNweAhSqKadvNWGM2kFUxk83pQDU',
  progress: 33,
  currentTime: '1:24',
  totalTime: '3:42',
  isPlaying: true,
};

export default function ArtistProfilePage() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(mockArtist.isFollowing);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-surface border-b border-surface-secondary shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFRMnTMcbu8r6zY05xUUdrM9m8LmxxQ4Gm0Rd-Oyo9a9pTqLV2j5zZg5NbaQ72VPGyw5r-1OJ1kERLa-vkjBk8kmzEARO4ENFwxJrIPxkeXXpmrum6xgFGqC9OOb00u91rPPsyIdHhlll1bf-clNmYFcyRv_xmTXc63FtcfjekGu969hDTpvFSQ-wnKyZSv1ZSSmTdpOy9MbrjQncg68Ng_5mLgShtoX1bZdq3CgYvbdgKBPhIxFenXv5_2HoqVpwaEN2w6NXDt5ts" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary">CMPapp</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant hover:opacity-80">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-[60px] max-w-container-max mx-auto md:px-gutter px-margin-mobile">
        {/* Hero Section */}
        <section className="mt-4 relative rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(13,27,53,0.05)] border border-surface-secondary bg-surface-container-lowest">
          <div className="h-48 md:h-64 w-full bg-surface-variant relative">
            <img alt="Artist Cover" className="w-full h-full object-cover opacity-80" src={mockArtist.coverImage} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row md:items-end gap-6 translate-y-12 md:translate-y-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-lg flex-shrink-0 bg-surface-variant z-10 relative">
              <img alt="Artist Profile Picture" className="w-full h-full object-cover" src={mockArtist.avatar} />
            </div>
            <div className="flex-grow pb-12 md:pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div className="text-on-primary md:text-on-surface">
                <h1 className="font-headline-xl text-headline-xl text-surface-container-lowest md:text-primary drop-shadow-md md:drop-shadow-none">{mockArtist.name}</h1>
                <div className="flex items-center gap-3 mt-2 text-surface-container-highest md:text-on-surface-variant">
                  <span className="font-wallet-display text-wallet-display text-secondary-fixed md:text-secondary">{mockArtist.monthlyStreams}</span>
                  <span className="font-body-sm text-body-sm uppercase tracking-wider">Monthly Streams</span>
                </div>
              </div>
              <button
                onClick={handleFollow}
                className={`${isFollowing ? 'bg-transparent border border-primary text-primary' : 'bg-primary text-on-primary'} font-body-lg text-body-lg px-6 py-3 rounded-lg hover:opacity-80 transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-md`}
              >
                <span className="material-symbols-outlined">{isFollowing ? 'person_remove' : 'person_add'}</span>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </section>

        {/* Tracklist Section */}
        <section className="mt-24 md:mt-16 bg-surface-container-lowest rounded-xl border border-surface-secondary shadow-[0px_4px_20px_rgba(13,27,53,0.05)] p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline-md text-headline-md text-primary">Top Tracks</h2>
            <button className="text-secondary font-label-caps text-label-caps hover:text-tertiary-fixed-dim transition-colors flex items-center gap-1">
              See All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-secondary text-on-surface-variant font-label-caps text-label-caps">
                  <th className="pb-3 pl-2 w-12 text-center">#</th>
                  <th className="pb-3 pl-2">Title</th>
                  <th className="pb-3 pl-2 hidden sm:table-cell">Duration</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {topTracks.map((track, index) => (
                  <tr key={track.id} className="border-b border-surface-secondary/50 hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <td className="py-4 pl-2 text-center text-on-surface-variant font-wallet-display text-[14px]">{index + 1}</td>
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-surface-variant overflow-hidden flex-shrink-0 hidden sm:block">
                          <img alt="Album Art" className="w-full h-full object-cover" src={track.cover} />
                        </div>
                        <div>
                          <div className="font-body-lg text-body-lg text-primary group-hover:text-secondary transition-colors">{track.title}</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant sm:hidden">{track.duration}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pl-2 text-on-surface-variant hidden sm:table-cell font-wallet-display text-[14px]">{track.duration}</td>
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined fill">play_arrow</span>
                        </button>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors hidden sm:flex">
                          <span className="material-symbols-outlined">download</span>
                        </button>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* About Section */}
        <section className="mt-6 bg-surface-container-lowest rounded-xl border border-surface-secondary shadow-[0px_4px_20px_rgba(13,27,53,0.05)] p-4 md:p-6">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">About</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Luna Echo is an emerging electronic music producer known for blending synthwave, lo-fi, and ambient soundscapes.
            With over 2.4M monthly streams, she continues to captivate audiences worldwide with her unique sound.
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Verified Artist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">location_on</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Lagos, Nigeria</span>
            </div>
          </div>
        </section>
      </main>

      {/* Global Player Bar */}
      <div className="fixed bottom-[72px] md:bottom-0 left-0 w-full z-40 bg-primary-container text-on-primary shadow-[0px_-8px_30px_rgba(13,27,53,0.15)] backdrop-blur-lg border-t border-primary-fixed-dim/20">
        <div className="max-w-container-max mx-auto w-full px-4 md:px-gutter h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-1/3 min-w-[150px]">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-tint shrink-0 shadow-md">
              <img className="w-full h-full object-cover" src={nowPlaying.cover} alt="Now Playing" />
            </div>
            <div className="flex flex-col hidden sm:flex overflow-hidden">
              <span className="font-body-md text-body-md font-semibold text-on-primary truncate">{nowPlaying.title}</span>
              <span className="font-body-sm text-body-sm text-on-primary-container truncate">{nowPlaying.artist}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-6 w-1/3">
            <button className="text-on-primary-container hover:text-secondary-fixed transition-colors p-2 active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[24px]">shuffle</span>
            </button>
            <button className="text-on-primary hover:text-secondary-fixed transition-colors p-2 active:scale-95">
              <span className="material-symbols-outlined text-[32px]" data-weight="fill">skip_previous</span>
            </button>
            <button className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary-fixed hover:scale-105 active:scale-95 transition-all shadow-[0_4px_15px_rgba(253,195,77,0.3)]">
              <span className="material-symbols-outlined text-[36px]" data-weight="fill">pause</span>
            </button>
            <button className="text-on-primary hover:text-secondary-fixed transition-colors p-2 active:scale-95">
              <span className="material-symbols-outlined text-[32px]" data-weight="fill">skip_next</span>
            </button>
            <button className="text-on-primary-container hover:text-secondary-fixed transition-colors p-2 active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[24px]">repeat</span>
            </button>
          </div>
          <div className="flex items-center justify-end gap-3 w-1/3 min-w-[100px]">
            <button className="text-on-primary-container hover:text-on-primary transition-colors active:scale-95 hidden md:block">
              <span className="material-symbols-outlined text-[20px]">queue_music</span>
            </button>
            <div className="flex items-center gap-2 w-24 md:w-32 group/vol">
              <span className="material-symbols-outlined text-[20px] text-on-primary-container group-hover/vol:text-on-primary transition-colors">volume_up</span>
              <div className="w-full h-1 bg-surface-tint/50 rounded-full cursor-pointer relative">
                <div className="absolute top-0 left-0 h-full w-[75%] bg-on-primary rounded-full group-hover/vol:bg-secondary-fixed transition-colors"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 bg-primary-container shadow-[0px_-4px_20px_rgba(13,27,53,0.1)]">
        <Link href="/" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 scale-90 transition-all">
          <span className="material-symbols-outlined fill">music_note</span>
          <span className="font-label-caps text-label-caps mt-1">Music</span>
        </button>
        <Link href="/marketplace" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-secondary-fixed transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>
    </div>
  );
}