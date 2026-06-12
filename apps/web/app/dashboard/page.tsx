'use client';

import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Button } from '@/components/ui/button';
import { Wallet, Flame, ClipboardList, ArrowRight, Bell, Coins } from 'lucide-react';

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
    <PageTransition className="space-y-12">
      {/* Desktop Header Area */}
      <NeuCard padding="none" className="hidden md:block h-64 w-full relative overflow-hidden flex-shrink-0 shadow-neu-raised">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neo-secondary via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-10">
          <NeuIconBadge size="md" className="flex items-center gap-2 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-neo-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-neo-secondary">{mockUser.coinBalance.toLocaleString()} Coins</span>
          </NeuIconBadge>
          <NeuIconBadge size="md" active className="cursor-pointer relative">
            <Bell className="w-5 h-5 text-neo-text-primary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-neo-error rounded-full"></span>
          </NeuIconBadge>
          <NeuIconBadge size="md" className="cursor-pointer overflow-hidden p-0">
            <img alt="User Profile" className="w-full h-full object-cover rounded-xl" src={mockUser.avatar} />
          </NeuIconBadge>
        </div>
        <div className="absolute bottom-12 left-10 z-10">
          <h2 className="font-h1 text-h1 text-neo-text-primary mb-2">Welcome Back, {mockUser.displayName}.</h2>
          <p className="font-body-lg text-body-lg text-neo-text-secondary">Let's grow your creative enterprise today.</p>
        </div>
      </NeuCard>

      {/* Mobile Welcome */}
      <div className="md:hidden mb-6 mt-4">
        <h2 className="font-h1-mobile text-h1-mobile text-neo-text-primary">Hi, {mockUser.displayName}</h2>
        <p className="font-body-md text-body-md text-neo-text-secondary">Here is your daily summary.</p>
      </div>

      {/* Power Row (Quick Stats) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            <NeuCard padding="md" interactive>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-neo-text-secondary">Total Balance</span>
                <NeuIconBadge size="md">
                  <Wallet className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-neo-text-primary">{mockUser.coinBalance.toLocaleString()}</h3>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Coins</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-neo-success font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+450 this week</span>
              </div>
            </NeuCard>
          </StaggerItem>

          <StaggerItem>
            <NeuCard padding="md" interactive>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-neo-text-secondary">Current Streak</span>
                <NeuIconBadge size="md" active>
                  <Flame className="w-5 h-5 text-neo-secondary" />
                </NeuIconBadge>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-neo-text-primary">{mockUser.currentStreak}</h3>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Days</span>
              </div>
              <div className="mt-4">
                <NeuProgress value={80} showLabel size="sm" />
              </div>
              <p className="font-body-sm text-body-sm text-neo-text-secondary mt-2 text-xs">2 days to next milestone</p>
            </NeuCard>
          </StaggerItem>

          <StaggerItem>
            <NeuCard padding="md" interactive>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-neo-text-secondary">Tasks Remaining</span>
                <NeuIconBadge size="md">
                  <ClipboardList className="w-5 h-5 text-neo-primary" />
                </NeuIconBadge>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-neo-text-primary">{mockUser.tasksRemaining}</h3>
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Tasks</span>
              </div>
              <Link className="mt-4 inline-flex items-center gap-1 font-body-sm text-body-sm text-neo-primary hover:text-neo-secondary font-medium transition-colors" href="/dashboard/tasks">
                Complete now <ArrowRight className="w-4 h-4" />
              </Link>
            </NeuCard>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Top Artists */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-neo-text-primary">Top Artists of the Week</h3>
              <Link className="font-body-sm text-body-sm text-neo-primary hover:underline" href="/dashboard/music">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
              {topArtists.map((artist) => (
                <NeuCard key={artist.id} padding="md" interactive className="min-w-[160px] flex flex-col items-center gap-3 snap-start">
                  <img alt={artist.name} className="w-20 h-20 rounded-full object-cover shadow-neu-raised-sm" src={artist.image} />
                  <div className="text-center">
                    <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary">{artist.name}</h4>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">{artist.genre}</p>
                  </div>
                </NeuCard>
              ))}
            </div>
          </section>

          {/* Featured Business Stores */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-neo-text-primary">Featured Stores</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 h-48 rounded-2xl overflow-hidden relative group cursor-pointer shadow-neu-raised">
                <img alt="Main Store" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={featuredStores[0].image} />
                <div className="absolute inset-0 bg-gradient-to-t from-neo-primary/90 to-transparent flex flex-col justify-end p-6">
                  <span className="neo-badge-secondary px-2 py-1 rounded w-fit mb-2 font-label-caps text-label-caps text-[10px]">{featuredStores[0].badge}</span>
                  <h4 className="font-h3 text-h3 text-white">{featuredStores[0].name}</h4>
                  <p className="font-body-sm text-body-sm text-white/70 mt-1">{featuredStores[0].category}. Earn 5% cashback.</p>
                </div>
              </div>

              <NeuCard padding="none" interactive className="h-32 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-neo-primary/20 to-neo-primary/5 z-0"></div>
                <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                  <NeuIconBadge size="sm">
                    <span className="material-symbols-outlined text-neo-secondary">headphones</span>
                  </NeuIconBadge>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary">{featuredStores[1].name}</h4>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">{featuredStores[1].category}</p>
                  </div>
                </div>
              </NeuCard>

              <NeuCard padding="none" interactive className="h-32 overflow-hidden relative">
                <div className="p-4 flex flex-col h-full justify-between">
                  <NeuIconBadge size="sm">
                    <span className="material-symbols-outlined text-neo-primary">brush</span>
                  </NeuIconBadge>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-neo-text-primary">{featuredStores[2].name}</h4>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">{featuredStores[2].category}</p>
                  </div>
                </div>
              </NeuCard>
            </div>
          </section>
        </div>

        {/* Right Column: Daily Tasks */}
        <div className="lg:col-span-1">
          <NeuCard padding="md" className="sticky top-6" id="daily-tasks">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neo-bg-dark">
              <NeuIconBadge size="sm" active>
                <span className="material-symbols-outlined text-neo-secondary text-sm">task_alt</span>
              </NeuIconBadge>
              <h3 className="font-h3 text-h3 text-neo-text-primary text-lg">Daily Quick Earn</h3>
            </div>
            <div className="space-y-4">
              {quickEarnTasks.map((task) => (
                <NeuCard key={task.id} padding="sm" interactive className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <NeuIconBadge size="md" active>
                      <span className="material-symbols-outlined text-neo-primary text-sm">{task.icon}</span>
                    </NeuIconBadge>
                    <div>
                      <h4 className="font-body-md text-body-md font-medium text-neo-text-primary">{task.title}</h4>
                      <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">+{task.reward} Coins</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Start
                  </Button>
                </NeuCard>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-neo-bg-dark text-center">
              <p className="font-body-sm text-body-sm text-neo-text-secondary text-xs">Completing all tasks grants a bonus multiplier.</p>
            </div>
          </NeuCard>
        </div>
      </div>
    </PageTransition>
  );
}
