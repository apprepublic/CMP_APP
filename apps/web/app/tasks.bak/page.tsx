'use client';

import Link from 'next/link';

const tasks = [
  {
    id: 'featured',
    title: 'Watch Premium Trailer',
    description: "View the new 60s teaser for upcoming content to claim your massive reward.",
    reward: 500,
    icon: 'play_circle',
    featured: true,
  },
  {
    id: '1',
    title: 'Read Daily Article',
    description: 'Stay updated with the latest fintech news.',
    reward: 50,
    icon: 'newspaper',
  },
  {
    id: '2',
    title: 'Social Repost',
    description: 'Share our latest update on your feed.',
    reward: 100,
    icon: 'share',
  },
  {
    id: '3',
    title: 'User Feedback',
    description: 'Complete a 2-minute survey about the app.',
    reward: 250,
    icon: 'assignment',
  },
  {
    id: '4',
    title: 'Feature Vote',
    description: 'Help us decide what to build next.',
    reward: 75,
    icon: 'how_to_vote',
  },
];

const filters = ['All', 'News', 'Social', 'Surveys', 'Voting'];

export default function TasksPage() {
  const triggerAdGate = () => {
    const modal = document.getElementById('adGateModal');
    if (modal) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md pb-24 md:pb-8 flex flex-col">
      {/* TopAppBar - Mobile */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 py-2 bg-surface shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">U</div>
          <span className="font-headline-md text-headline-md font-bold text-primary">CMPapp</span>
        </div>
        <button className="text-on-surface-variant hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Desktop Navigation Cluster (Hidden on mobile) */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-40 bg-surface shadow-sm px-gutter py-4 justify-between items-center max-w-container-max mx-auto left-1/2 -translate-x-1/2">
        <span className="font-headline-md text-headline-md font-bold text-primary">CMPapp</span>
        <div className="flex gap-8">
          <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2" href="/">
            <span className="material-symbols-outlined">home</span> Home
          </Link>
          <Link className="font-label-caps text-label-caps text-primary font-bold flex items-center gap-2" href="/tasks">
            <span className="material-symbols-outlined">payments</span> Earn
          </Link>
          <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2" href="/music">
            <span className="material-symbols-outlined">music_note</span> Music
          </Link>
          <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2" href="/marketplace">
            <span className="material-symbols-outlined">storefront</span> Market
          </Link>
          <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2" href="/wallet">
            <span className="material-symbols-outlined">account_balance_wallet</span> Wallet
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">U</div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-[80px] md:pt-[120px] md:pb-stack-lg">
        {/* Header & Balance */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Task Marketplace</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Complete missions to earn rewards.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-lg border border-surface-secondary shadow-sm px-4 py-3 flex items-center gap-4 shrink-0">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Available</span>
            <span className="inline-flex items-center gap-1 border border-tertiary-fixed bg-tertiary-fixed-dim/10 rounded-full px-3 py-1 font-wallet-display text-wallet-display text-on-surface">
              <span className="text-[16px]">🪙</span> 1,250
            </span>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-stack-md">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`shrink-0 px-4 py-2 rounded-full font-label-caps text-label-caps transition-transform active:scale-95 ${
                  index === 0
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container border border-surface-variant text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid Tasks */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className={`cursor-pointer group ${
                task.featured
                  ? 'col-span-1 md:col-span-2 bg-primary-container rounded-xl p-6 relative overflow-hidden transition-transform hover:-translate-y-1 shadow-[0px_4px_20px_rgba(13,27,53,0.1)]'
                  : 'bg-surface-container-lowest rounded-xl border border-surface-secondary shadow-sm p-4 flex flex-col justify-between hover:shadow-[0px_4px_20px_rgba(13,27,53,0.05)] transition-all'
              }`}
              onClick={triggerAdGate}
            >
              {task.featured && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[120px] text-on-primary">play_circle</span>
                </div>
              )}
              <div className={`relative z-10 flex flex-col ${task.featured ? 'h-full justify-between gap-stack-lg' : ''}`}>
                <div className="flex justify-between items-start">
                  {task.featured && (
                    <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-2 py-1 rounded-sm">FEATURED</span>
                  )}
                  <span className={`inline-flex items-center gap-1 border border-tertiary-fixed ${task.featured ? 'bg-surface/10' : 'bg-tertiary-fixed/5'} rounded-full px-2 py-0.5 font-wallet-display text-wallet-display ${task.featured ? 'text-on-primary' : 'text-on-surface'}`}>
                    <span className="text-[14px]">🪙</span> {task.reward}
                  </span>
                </div>
                <div>
                  <div className={`w-12 h-12 rounded-full ${task.featured ? 'bg-surface/20' : 'bg-surface-container'} flex items-center justify-center ${task.featured ? 'text-on-primary' : 'text-primary'} mb-4 ${!task.featured && 'mb-4'}`}>
                    <span className="material-symbols-outlined">{task.icon}</span>
                  </div>
                  <h2 className={`font-headline-md text-headline-md ${task.featured ? 'text-on-primary mb-2 group-hover:text-tertiary-fixed' : 'text-primary mb-1'} ${!task.featured && 'font-body-lg text-body-lg'}`}>
                    {task.title}
                  </h2>
                  <p className={`font-body-sm text-body-sm ${task.featured ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-primary-container shadow-[0px_-4px_20px_rgba(13,27,53,0.1)]">
        <Link href="/" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-tertiary-fixed transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 scale-90 transition-all shadow-sm">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-caps text-label-caps mt-1">Earn</span>
        </button>
        <Link href="/music" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-tertiary-fixed transition-colors">
          <span className="material-symbols-outlined">music_note</span>
          <span className="font-label-caps text-label-caps mt-1">Music</span>
        </Link>
        <Link href="/marketplace" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-tertiary-fixed transition-colors">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Market</span>
        </Link>
        <Link href="/wallet" className="flex flex-col items-center justify-center text-on-primary-fixed-variant px-3 py-1 hover:text-tertiary-fixed transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-caps text-label-caps mt-1">Wallet</span>
        </Link>
      </nav>

      {/* Ad-Gate Overlay Modal */}
      <div className="fixed inset-0 z-[100] hidden items-center justify-center bg-primary-container/90 backdrop-blur-md transition-opacity opacity-0" id="adGateModal">
        <div className="bg-surface-container-lowest border border-surface-secondary rounded-xl shadow-[0px_10px_30px_rgba(13,27,53,0.2)] p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center transform scale-95 transition-transform duration-300" id="adGateContent">
          <div className="w-16 h-16 rounded-full border-4 border-surface-container border-t-tertiary-fixed-dim animate-spin mb-6"></div>
          <h2 className="font-headline-md text-headline-md text-primary mb-2">Simulating Ad</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">Please wait while we verify your activity. Do not close this window.</p>
          <button className="w-full bg-surface-container-highest text-on-surface-variant font-label-caps text-label-caps py-3 rounded-lg hover:bg-surface-variant transition-colors" onClick={() => document.getElementById('adGateModal')?.classList.add('hidden')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}