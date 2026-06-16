'use client';

import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useReferralStats, useReferrals } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

const weeklyData = [
  { name: 'Week 1', coins: 1200 },
  { name: 'Week 2', coins: 2100 },
  { name: 'Week 3', coins: 1800 },
  { name: 'Week 4', coins: 3450 },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { user } = useUserStore();
  const { wallet } = useWallet();
  const { data: stats, isLoading: statsLoading } = useReferralStats(user?.id || '');
  const { data: referrals = [], isLoading: referralsLoading } = useReferrals(user?.id || '');

  const referralCode = wallet?.referral_code || '...';
  const totalReferrals = stats?.totalReferrals || 0;
  const activeReferrals = stats?.activeReferrals || 0;
  const totalEarned = stats?.totalEarned || 0;
  const weeklyEarnings = stats?.weeklyEarnings || 0;

  const copyCode = () => {
    if (referralCode === '...') return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full pb-24 md:pb-8">
      {/* Page Header */}
      <div className="py-8 md:py-12 max-w-container-max mx-auto px-margin-mobile lg:px-0">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary-container mb-4">Referral Network</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Build your creative empire. Earn passive income through our 3-tier commission structure:{' '}
          <span className="font-semibold text-secondary-container">Level 1 (20%)</span>,{' '}
          <span className="font-semibold text-secondary-container">Level 2 (10%)</span>, and{' '}
          <span className="font-semibold text-secondary-container">Level 3 (5%)</span>.
        </p>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-0 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Share & Stats */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* Referral Share Card */}
          <div className="bg-primary-container rounded-xl p-6 relative overflow-hidden shadow-lg border border-primary-fixed-dim/20">
            {/* Decorative background element */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container opacity-10 rounded-full blur-2xl"></div>
            <h2 className="font-h3 text-h3 text-on-primary mb-2 relative z-10">Your Invite Code</h2>
            <p className="font-body-sm text-body-sm text-on-primary-container mb-6 relative z-10">Share this code with your network to start earning.</p>
            
            <div className="bg-primary p-4 rounded-lg flex items-center justify-between border border-secondary-fixed/30 relative z-10 group">
              <span className="font-data-lg text-data-lg text-secondary-fixed tracking-wider select-all" id="referralCode">{referralCode}</span>
              <button 
                onClick={copyCode}
                aria-label="Copy code" 
                className="text-secondary-fixed hover:text-secondary-fixed-dim transition-colors bg-secondary-fixed/10 p-2 rounded-md"
              >
                {copied ? (
                  <span className="material-symbols-outlined text-success-verified" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                ) : (
                  <span className="material-symbols-outlined">content_copy</span>
                )}
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-on-primary-container/20 relative z-10">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-3 text-center">Quick Share</p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-colors">
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2]/20 transition-colors">
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Earnings Overview Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-alt rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-surface-tint mb-3">
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span className="font-label-caps text-label-caps">Network</span>
              </div>
              <div>
                <div className="font-data-lg text-h2 text-primary-container">{statsLoading ? '...' : totalReferrals}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total Referrals</div>
              </div>
            </div>
            <div className="bg-surface-alt rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-success-verified mb-3">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="font-label-caps text-label-caps">Active</span>
              </div>
              <div>
                <div className="font-data-lg text-h2 text-primary-container">{statsLoading ? '...' : activeReferrals}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Generating Yield</div>
              </div>
            </div>
            <div className="col-span-2 bg-surface-alt rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-2 border-secondary-container/50 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                <span className="material-symbols-outlined text-[120px]">savings</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-container mb-2 relative z-10">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                <span className="font-label-caps text-label-caps">Total Earned</span>
              </div>
              <div className="flex items-baseline space-x-2 relative z-10">
                <span className="text-2xl">🪙</span>
                <span className="font-data-lg text-h1 text-primary-container">{statsLoading ? '...' : totalEarned.toLocaleString()}</span>
              </div>
              <div className="font-body-sm text-body-sm text-success-verified mt-2 flex items-center space-x-1 relative z-10">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+{weeklyEarnings.toLocaleString()} this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Graph & List */}
        <div className="lg:col-span-8 space-y-gutter mt-8 lg:mt-0">
          {/* Chart Card */}
          <div className="bg-surface-alt rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-primary-container">Commission History</h3>
              <select className="bg-surface rounded-lg border border-outline-variant/50 font-body-sm text-body-sm text-on-surface-variant px-3 py-1.5 focus:ring-secondary-container focus:border-secondary-container">
                <option>Last 30 Days</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fdc34d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fdc34d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#75777e" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1b35', borderColor: '#0d1b35', color: '#fff', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="coins" stroke="#fdc34d" strokeWidth={3} fillOpacity={1} fill="url(#colorCoins)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-surface-alt rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h3 className="font-h3 text-h3 text-primary-container">Recent Network Activity</h3>
              <button className="text-secondary hover:text-secondary-fixed-dim transition-colors font-label-caps text-label-caps flex items-center space-x-1">
                <span>View All</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-highest border-b border-outline-variant/30">
                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">User</th>
                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Joined</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/20">
                  {referralsLoading ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-on-surface-variant">Loading network...</td>
                    </tr>
                  ) : referrals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-on-surface-variant">No referrals found in your network.</td>
                    </tr>
                  ) : (
                    referrals.map((referral) => {
                      const name = referral.referred_user?.full_name || referral.referred_user?.email?.split('@')[0] || 'Unknown';
                      const initials = name.slice(0, 2).toUpperCase();
                      const date = new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const level = 'L1'; // Keep at L1 for now since we don't have deeper tier modeling yet

                      return (
                        <tr key={referral.id} className="hover:bg-surface transition-colors group">
                          <td className="p-4 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs bg-primary-container">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface">{name}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              referral.status === 'ACTIVE' 
                                ? 'bg-secondary-container/20 text-secondary border border-secondary-container/30'
                                : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                            }`}>
                              {referral.status}
                            </span>
                          </td>
                          <td className="p-4 text-on-surface-variant">{date}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}