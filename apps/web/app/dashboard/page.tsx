'use client';

import Link from 'next/link';

const mockUser = {
  displayName: 'Alex',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw0imHdTAzGrvSMK1sdAcs0uhyqcz3mlOWN76mUYhFUP4B7T8KqTzKVvLlpUdRdnVzYz1UZK0aH3Bdp8be4B8NRrDDB1C-SxT0klW4sTc7T_N7eRAxsf9lWB4ORCDjIilWvZfA1kYo4ZSOM86vvqQ9cxdP0Eb7cRMP0qpugl4zkqRKtVUE-QqC8t7MvDMOhm6R6OJbuwKjqesTfes3nMeGDJCB_SzAC1evn2N53QEEx0lbWHL0FBAa1Dl14_puH4eYGVziXO4iGKk',
  coinBalance: 12450,
  currentStreak: 12,
  tasksRemaining: 5,
};

const topArtists = [
  { id: 1, name: 'Aisha M.', genre: 'Afrobeat', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOLiUUYH8rhyvHruWQ5qNAxD3E7ap5R7jKvKuBZiFKb6KVHvlBMC1C-Fj9LZQ-a_1MVDtyIIFkwkThDy885xLgFME-3S9MuLExPVx6NMh02uzFI9Ab-Bdr5Rpv3CNbkgLAr7RltNhRo-Z3odWT64yNyZLSU-h-u0wDBO8d3VOZWvtNBhIrWjuokIpY2x4-03muDi9zF-gU73Pq15A3btcFWZ8Tc2VUpGR3auSE5DogyhqLmEbyQCrjYGZieRoxmFX5WDGtOPrD0Lw' },
  { id: 2, name: 'DJ Tunde', genre: 'Electronic', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXzWWBIPnUl7GRkr6AZjYbag-0V9VQEo1gCldL0cY86AZCAJvzEjcoXxB9CpIcjiAGjykXhmtgcIPBKs59dIPs8juP3wgqG99q4O8Lng3glBlm98KbDWWwHUZTz2z_v86dGshiISJUSDlg-fr4l-kDvHqhMqLKE2c5go5uONJmqFX0hZO0Aq8l_FFkFrwFxjCHmRL1u9zGTqtiKKqtz3B0QxUxhAFMI3i7NoTqAaFL6Q8_3VZJX8Sf9cSzOLgX3giIf9MH2IUZ1rE' },
  { id: 3, name: 'Chioma K.', genre: 'Soul', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4T_fWKjmUQnFq5HNcynE3Pzw3sOap9AVg1oCepRdDKQchl1ddjDA_Q3KjtFsOcHHhMbq5DkywbCQGBHI0nocgskpqbS3BnqJ8QjBr7IQlsKGTp7hnJBrOSure4rt9vHuiHxeblg6glBSlNQvd2PDdwLWpcloFfPuMy8zCyWbsc8SaBZLNsopGRzJr79uA7FUYC4a6pJZyBKTtv3DaWXzxA43T7NZ4R8HqWNlTkClUDYsGTEFlFI1r1PAgKZiKy_b_Kl9R1fmf_Dk' },
  { id: 4, name: 'Eze Beats', genre: 'Producer', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Vnh4W1X-q0mqfDOXVCzrcN1ssAW8v-Y_plKQ_8xmO1IBwpLgTzTxR7CHl5Ksf1gDSDCnRt-kEtNSq07so4e1IVRrg6kkc3GiHRYGiIlmP6VU9pwlan_ELL27Y2EbneaKjnTe1Lk2IESKVZ9u8YtMl1qZsWzeAxY5HR6SATjVtkc9hPXXLplay40xDUOpSwO8id96vIZKNRqZbHT6AF6-Cpn2-PToC4muYr_d26Bzb0d6eHDwvtnE-5A139VSNbCgb4CXYL0hCYg' },
];

const featuredStores = [
  { id: 1, name: 'Lagos Threads Co.', category: 'Fashion', badge: 'HOT DEAL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIuvh94i6PnfXUwM7XTdoqJiDVLEVYUTfqxE9H7qc0DuJUTdfgXsFXFOLMKieWR_bZiN-jAUTLrbN4AjPeYF-IwSDko5aiTChqGQQbPhdWk7__k8CFf91KQv7rXicNjHnORQ74SWcUtJJMxY-p_nvBSTSyMr9g0RmlFsPnA_8o3ZI2K1v_cY5nnR0FHOVr95sqKBCCxC-WUuftXTmA-tvOhTDiRTIsRAKJuV7MF3-bNVG7k5j9cTdqO3VrL-CRpv9mK8SVVPxaeeg' },
  { id: 2, name: 'SoundGear HQ', category: 'Audio Equipment', icon: 'headphones' },
  { id: 3, name: 'Canvas & Co', category: 'Art Supplies', icon: 'brush' },
];

const quickEarnTasks = [
  { id: 1, title: 'Read Industry News', description: 'Stay updated with trends', reward: 50, icon: 'article' },
  { id: 2, title: 'Watch Sponsor Ad', description: 'View 30s promotional video', reward: 100, icon: 'play_circle' },
  { id: 3, title: 'Share Profile', description: 'Share on social media', reward: 25, icon: 'share' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Desktop Header Area (Hero background) */}
      <div className="hidden md:block h-64 bg-primary-container w-full relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-10">
          <div className="flex items-center gap-2 bg-surface-container-low/10 border-[1.5px] border-secondary-fixed rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="material-symbols-outlined text-secondary-fixed">monetization_on</span>
            <span className="font-data-md text-data-md text-secondary-fixed text-lg">{mockUser.coinBalance.toLocaleString()} Coins</span>
          </div>
          <button className="text-on-primary hover:text-secondary-fixed transition-colors relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="w-10 h-10 rounded-full border-2 border-outline overflow-hidden hover:border-secondary transition-colors">
            <img alt="User Profile" className="w-full h-full object-cover" src={mockUser.avatar} />
          </button>
        </div>
        <div className="absolute bottom-12 left-10 z-10">
          <h2 className="font-h1 text-h1 text-on-primary mb-2">Welcome Back, {mockUser.displayName}.</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container">Let's grow your creative enterprise today.</p>
        </div>
      </div>

      {/* Mobile Welcome (visible only on mobile) */}
      <div className="md:hidden mb-6 mt-4">
        <h2 className="font-h1-mobile text-h1-mobile text-on-surface">Hi, {mockUser.displayName}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Here is your daily summary.</p>
      </div>

      {/* Power Row (Quick Stats) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-surface-alt rounded-xl p-6 relative overflow-hidden group hover:border-secondary transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/5 rounded-full blur-xl group-hover:bg-secondary-fixed/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Total Balance</span>
            <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{mockUser.coinBalance.toLocaleString()}</h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Coins</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-success-verified font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+450 this week</span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-surface-alt rounded-xl p-6 relative overflow-hidden group hover:border-secondary transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Current Streak</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{mockUser.currentStreak}</h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Days</span>
          </div>
          <div className="mt-4 w-full bg-surface-variant rounded-full h-2">
            <div className="bg-secondary h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-xs">2 days to next milestone</p>
        </div>

        {/* Tasks Remaining */}
        <div className="bg-surface-alt rounded-xl p-6 relative overflow-hidden group hover:border-secondary transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Tasks Remaining</span>
            <span className="material-symbols-outlined text-on-primary-fixed-variant">checklist</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{mockUser.tasksRemaining}</h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Tasks</span>
          </div>
          <Link className="mt-4 inline-flex items-center gap-1 font-body-sm text-body-sm text-primary hover:text-secondary font-medium transition-colors" href="/dashboard/tasks">
            Complete now <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Featured & Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Top Artists (Horizontal Scroll) */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-background">Top Artists of the Week</h3>
              <Link className="font-body-sm text-body-sm text-secondary hover:underline" href="/dashboard/music">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
              {topArtists.map((artist) => (
                <div key={artist.id} className="min-w-[160px] bg-surface-alt rounded-xl p-4 flex flex-col items-center gap-3 snap-start hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-outline-variant">
                  <img alt={artist.name} className="w-20 h-20 rounded-full object-cover border-2 border-surface-container-highest" src={artist.image} />
                  <div className="text-center">
                    <h4 className="font-body-md text-body-md font-semibold text-on-background">{artist.name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">{artist.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Business Stores (Bento Style) */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-background">Featured Stores</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Large Bento Item */}
              <div className="sm:col-span-2 h-48 rounded-xl overflow-hidden relative group cursor-pointer">
                <img alt="Main Store" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={featuredStores[0].image} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6">
                  <span className="bg-secondary text-primary font-label-caps text-label-caps text-[10px] px-2 py-1 rounded w-fit mb-2">{featuredStores[0].badge}</span>
                  <h4 className="font-h3 text-h3 text-on-primary">{featuredStores[0].name}</h4>
                  <p className="font-body-sm text-body-sm text-surface-dim mt-1">{featuredStores[0].category}. Earn 5% cashback.</p>
                </div>
              </div>

              {/* Small Bento Items */}
              <div className="h-32 rounded-xl overflow-hidden relative group cursor-pointer bg-surface-alt">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary/80 opacity-90 z-0"></div>
                <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                  <span className="material-symbols-outlined text-secondary">headphones</span>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-primary">{featuredStores[1].name}</h4>
                    <p className="font-body-sm text-body-sm text-surface-dim text-xs">{featuredStores[1].category}</p>
                  </div>
                </div>
              </div>

              <div className="h-32 rounded-xl overflow-hidden relative group cursor-pointer bg-surface-alt border border-outline-variant hover:border-secondary transition-colors">
                <div className="p-4 flex flex-col h-full justify-between">
                  <span className="material-symbols-outlined text-primary">brush</span>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-background">{featuredStores[2].name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">{featuredStores[2].category}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Daily Tasks (Sidebar on Desktop) */}
        <div className="lg:col-span-1">
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 sticky top-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]" id="daily-tasks">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary">task_alt</span>
              <h3 className="font-h3 text-h3 text-on-background text-lg">Daily Quick Earn</h3>
            </div>
            <div className="space-y-4">
              {quickEarnTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-alt transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-sm">{task.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-medium text-on-background">{task.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">+{task.reward} Coins</p>
                    </div>
                  </div>
                  <button className="bg-secondary hover:bg-secondary-fixed text-primary font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors">
                    Start
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Completing all tasks grants a bonus multiplier.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}