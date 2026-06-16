'use client';

export default function EarnMarketplacePage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      {/* Header Section */}
      <div className="mb-10 mt-6 lg:mt-0">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Task Marketplace</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Complete verified tasks to earn premium rewards and build your creative capital. Watch out for Ad-Gated premium tasks for higher payouts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-4 hide-scrollbar border-b border-outline-variant/30">
        <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-body-md text-body-md whitespace-nowrap transition-colors shadow-sm">All</button>
        <button className="px-6 py-2 rounded-full bg-surface-alt text-on-surface-variant hover:bg-surface-dim font-body-md text-body-md whitespace-nowrap transition-colors border border-outline-variant/50">News</button>
        <button className="px-6 py-2 rounded-full bg-surface-alt text-on-surface-variant hover:bg-surface-dim font-body-md text-body-md whitespace-nowrap transition-colors border border-outline-variant/50">Social</button>
        <button className="px-6 py-2 rounded-full bg-surface-alt text-on-surface-variant hover:bg-surface-dim font-body-md text-body-md whitespace-nowrap transition-colors border border-outline-variant/50">Surveys</button>
        <button className="px-6 py-2 rounded-full bg-surface-alt text-on-surface-variant hover:bg-surface-dim font-body-md text-body-md whitespace-nowrap transition-colors border border-outline-variant/50">Voting</button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Task Card 1 (Premium) */}
        <div className="bg-surface-alt rounded-xl p-6 flex flex-col h-full border-2 border-[#B8860B] relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-[#B8860B] text-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">PREMIUM</div>
          <div className="flex items-start justify-between mb-4 mt-2">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>quickreply</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
              <span className="font-data-md text-data-md text-primary">250</span>
            </div>
          </div>
          <h3 className="font-h3 text-h3 text-primary mb-2">Review New Audio Interface</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-6">Test and provide feedback on the upcoming CMPapp creator tools. Ad-Gated task.</p>
          <button className="w-full bg-primary text-on-primary font-body-md text-body-md py-3 rounded-lg hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-2 group">
            <span>Start Task</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_open</span>
          </button>
        </div>

        {/* Task Card 2 */}
        <div className="bg-surface-alt rounded-xl p-6 flex flex-col h-full border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>share</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
              <span className="font-data-md text-data-md text-primary">50</span>
            </div>
          </div>
          <h3 className="font-h3 text-h3 text-primary mb-2">Share Latest Drop</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-6">Amplify the new Afrobeat collection on your social channels to earn instant rewards.</p>
          <button className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-primary font-body-md text-body-md py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span>Start Task</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Task Card 3 */}
        <div className="bg-surface-alt rounded-xl p-6 flex flex-col h-full border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>poll</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
              <span className="font-data-md text-data-md text-primary">100</span>
            </div>
          </div>
          <h3 className="font-h3 text-h3 text-primary mb-2">Creator Economy Survey</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-6">5-minute survey about your monthly creative expenses and tool preferences.</p>
          <button className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-primary font-body-md text-body-md py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span>Start Task</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Task Card 4 */}
        <div className="bg-surface-alt rounded-xl p-6 flex flex-col h-full border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>article</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
              <span className="font-data-md text-data-md text-primary">25</span>
            </div>
          </div>
          <h3 className="font-h3 text-h3 text-primary mb-2">Read Daily News</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-6">Stay updated with the latest trends in the Nigerian digital art scene.</p>
          <button className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-primary font-body-md text-body-md py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span>Start Task</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
}