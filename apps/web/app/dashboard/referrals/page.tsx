'use client';

import { useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Landmark, TrendingUp, Copy, Check } from 'lucide-react';

const referralStats = {
  totalReferrals: 124,
  activeReferrals: 89,
  totalEarned: 14250,
  weeklyEarnings: 1200,
};

const recentActivity = [
  { id: 1, name: 'Sarah K.', username: '@sarahcreates', level: 'L1', date: 'Oct 24, 2023', earnings: 450, initials: 'SK' },
  { id: 2, name: 'Mike J.', username: '@mikebeats', level: 'L2', date: 'Oct 22, 2023', earnings: 120, initials: 'MJ' },
  { id: 3, name: 'Anna Lee', username: '@annavox', level: 'L3', date: 'Oct 18, 2023', earnings: 45, initials: 'AL' },
  { id: 4, name: 'David B.', username: '@davebass', level: 'L1', date: 'Oct 15, 2023', earnings: 310, initials: 'DB' },
];

const weeklyData = [1200, 2100, 1800, 3450];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('CMP-ALEX99');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition className="space-y-gutter">
      {/* Header */}
      <div className="py-8 md:py-12">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary mb-4">Referral Network</h1>
        <p className="font-body-lg text-body-lg text-neo-text-secondary max-w-2xl">
          Build your creative empire. Earn passive income through our 3-tier commission structure:{' '}
          <span className="font-semibold text-neo-secondary">Level 1 (20%)</span>,{' '}
          <span className="font-semibold text-neo-secondary">Level 2 (10%)</span>, and{' '}
          <span className="font-semibold text-neo-secondary">Level 3 (5%)</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Share & Stats */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* Referral Share Card */}
          <NeuCard padding="lg" className="bg-gradient-to-br from-neo-primary to-neo-primary/90 text-white relative overflow-hidden shadow-neu-raised">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-neo-secondary opacity-10 rounded-full blur-2xl"></div>
            <h2 className="font-h3 text-h3 text-white mb-2 relative z-10">Your Invite Code</h2>
            <p className="font-body-sm text-body-sm text-white/80 mb-6 relative z-10">Share this code with your network to start earning.</p>
            
            {/* Referral Code Display - neu-inset panel */}
            <div className="bg-neu-bg shadow-neu-inset rounded-lg p-4 flex items-center justify-between border border-neu-bg-dark relative z-10 group mb-6">
              <span className="font-data-lg text-data-lg text-neo-secondary tracking-wider select-all">CMP-ALEX99</span>
              <button onClick={copyCode} className="text-neo-secondary hover:text-neo-secondary/80 transition-colors bg-neo-secondary/10 p-2 rounded-md shadow-neu-raised-sm">
                {copied ? (
                  <Check className="w-5 h-5 text-neo-success" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20 relative z-10">
              <p className="font-label-caps text-label-caps text-white/80 mb-3 text-center">Quick Share</p>
              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-colors shadow-neu-flat">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2]/20 transition-colors shadow-neu-flat">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </button>
              </div>
            </div>
          </NeuCard>

          {/* Earnings Overview Bento */}
          <div className="grid grid-cols-2 gap-4">
            <StaggerContainer stagger={0.08}>
              <StaggerItem>
                <NeuCard padding="md" className="shadow-neu-flat flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-neo-text-secondary mb-3">
                    <NeuIconBadge size="sm" active>
                      <Users className="w-4 h-4 text-neo-text-primary" />
                    </NeuIconBadge>
                    <span className="font-label-caps text-label-caps">Network</span>
                  </div>
                  <div>
                    <div className="font-data-lg text-h2 text-neo-primary">{referralStats.totalReferrals}</div>
                    <div className="font-body-sm text-body-sm text-neo-text-secondary mt-1">Total Referrals</div>
                  </div>
                </NeuCard>
              </StaggerItem>
              <StaggerItem>
                <NeuCard padding="md" className="shadow-neu-flat flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-neo-success mb-3">
                    <NeuIconBadge size="sm" active className="bg-neo-success/20">
                      <CheckCircle className="w-4 h-4 text-neo-success" />
                    </NeuIconBadge>
                    <span className="font-label-caps text-label-caps">Active</span>
                  </div>
                  <div>
                    <div className="font-data-lg text-h2 text-neo-primary">{referralStats.activeReferrals}</div>
                    <div className="font-body-sm text-body-sm text-neo-text-secondary mt-1">Generating Yield</div>
                  </div>
                </NeuCard>
              </StaggerItem>
              <StaggerItem>
                <NeuCard padding="md" className="col-span-2 shadow-neu-flat relative overflow-hidden border-2 border-neo-secondary/30">
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Landmark className="w-[120px] h-[120px] text-neo-text-muted" />
                  </div>
                  <div className="flex items-center gap-2 text-neo-secondary mb-2 relative z-10">
                    <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
                      <Landmark className="w-4 h-4 text-neo-secondary" />
                    </NeuIconBadge>
                    <span className="font-label-caps text-label-caps">Total Earned</span>
                  </div>
                  <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-2xl">🪙</span>
                    <span className="font-data-lg text-h1 text-neo-primary">{referralStats.totalEarned.toLocaleString()}</span>
                  </div>
                  <div className="font-body-sm text-body-sm text-neo-success mt-2 flex items-center gap-1 relative z-10">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{referralStats.weeklyEarnings} this week</span>
                  </div>
                </NeuCard>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>

        {/* Right Column: Graph & List */}
        <div className="lg:col-span-8 space-y-gutter">
          {/* Chart Card */}
          <NeuCard padding="lg" className="shadow-neu-flat">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-neo-text-primary">Commission History</h3>
              <select className="bg-neu-bg shadow-neu-inset border border-neu-bg-dark font-body-sm text-body-sm text-neo-text-secondary px-3 py-1.5 rounded-lg">
                <option>Last 30 Days</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-64 w-full flex items-end justify-between gap-2 px-4">
              {weeklyData.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / Math.max(...weeklyData)) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-neo-secondary rounded-t-lg shadow-neu-raised-sm transition-all"
                    style={{ minHeight: '20px' }}
                  ></motion.div>
                  <span className="font-data-md text-data-md text-neo-text-secondary mt-2">{value}</span>
                  <span className="font-label-caps text-label-caps text-neo-text-muted text-[10px]">Week {index + 1}</span>
                </div>
              ))}
            </div>
          </NeuCard>

          {/* Referral List */}
          <NeuCard padding="none" className="shadow-neu-flat overflow-hidden">
            <div className="p-6 border-b border-neu-bg-dark flex justify-between items-center bg-neu-bg">
              <h3 className="font-h3 text-h3 text-neo-text-primary">Recent Network Activity</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-neo-secondary hover:text-neo-secondary/80">
                <span>View All</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neu-bg border-b border-neu-bg-dark">
                    <th className="p-4 font-label-caps text-label-caps text-neo-text-secondary">User</th>
                    <th className="p-4 font-label-caps text-label-caps text-neo-text-secondary">Level</th>
                    <th className="p-4 font-label-caps text-label-caps text-neo-text-secondary">Joined</th>
                    <th className="p-4 font-label-caps text-label-caps text-neo-text-secondary text-right">Earned</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-neu-bg-dark">
                  {recentActivity.map((referral) => (
                    <motion.tr key={referral.id} className="hover:bg-neu-bg transition-colors group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <NeuIconBadge size="sm" active>
                            <span className="w-8 h-8 rounded-full bg-neo-primary text-white flex items-center justify-center font-bold text-xs">
                              {referral.initials}
                            </span>
                          </NeuIconBadge>
                          <div>
                            <div className="font-semibold text-neo-text-primary">{referral.name}</div>
                            <div className="text-xs text-neo-text-secondary">{referral.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <NeuCard padding="none" className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shadow-neu-flat ${
                          referral.level === 'L1'
                            ? 'bg-neo-secondary/20 text-neo-secondary border border-neo-secondary/30'
                            : referral.level === 'L2'
                            ? 'bg-neu-bg text-neo-text-secondary border border-neu-bg-dark'
                            : 'bg-neu-bg text-neo-text-secondary border border-neu-bg-dark/50'
                        }`}>
                        {referral.level === 'L1' ? 'L1 (20%)' : referral.level === 'L2' ? 'L2 (10%)' : 'L3 (5%)'}
                        </NeuCard>
                      </td>
                      <td className="p-4 text-neo-text-secondary">{referral.date}</td>
                      <td className="p-4 text-right font-data-md text-data-md text-neo-primary group-hover:text-neo-secondary transition-colors">
                        +{referral.earnings} 🪙
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </NeuCard>
        </div>
      </div>
    </PageTransition>
  );
}