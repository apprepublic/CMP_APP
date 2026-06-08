'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatNumber, formatDate } from '@/lib/utils';
import { Users, Copy, Share2, Gift, Loader2, Trophy, TrendingUp } from 'lucide-react';

export default function ReferralsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadReferrals();
    }
  }, [isAuthenticated]);

  const loadReferrals = async () => {
    try {
      const [refsData, allData] = await Promise.all([
        api.getL1Referrals(1, 20),
        api.getReferrals(),
      ]);
      setReferrals(refsData.referrals);
      setStats(allData.stats);
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
    }
  };

  const shareReferral = () => {
    const text = `Join CMPapp and earn free coins! Use my referral code: ${user?.referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join CMPapp',
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Share text copied to clipboard',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <Users className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Login Required</h2>
        <p className="mt-2 text-muted-foreground">Please login to view your referrals</p>
        <Button className="mt-6" onClick={() => router.push('/login')}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Referrals</h1>

      {/* Referral Code Card */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
        <p className="text-sm opacity-80">Your Referral Code</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-4xl font-bold tracking-wider">{user?.referralCode}</p>
          <Button variant="secondary" size="icon" onClick={copyReferralCode}>
            <Copy className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-4 text-sm opacity-80">
          Share your code and earn 20% of your friends' earnings!
        </p>
        <Button variant="secondary" className="mt-4 w-full" onClick={shareReferral}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Code
        </Button>
      </div>

      {/* How it works */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-2xl font-bold text-primary">20%</p>
          <p className="text-sm text-muted-foreground">L1 Referrals</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-2xl font-bold text-primary">10%</p>
          <p className="text-sm text-muted-foreground">L2 Referrals</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-2xl font-bold text-primary">5%</p>
          <p className="text-sm text-muted-foreground">L3 Referrals</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-6 rounded-lg border bg-card p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Referral Stats
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                +{formatNumber(stats.totalEarnings)} coins
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Referrals List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Referrals</h2>

        {loading ? (
          <div className="mt-4 flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : referrals.length > 0 ? (
          <div className="mt-4 space-y-2">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-bold text-primary">
                      {ref.user?.displayName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{ref.user?.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{ref.user?.username}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Joined {formatDate(ref.createdAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No referrals yet</h3>
            <p className="text-muted-foreground">
              Share your code to start earning!
            </p>
          </div>
        )}
      </div>

      {/* Bonus Info */}
      <div className="mt-8 rounded-lg border bg-muted p-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Bonus Rewards
        </h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Refer a new user: 1,000 coins (when they first earn)</p>
          <p>They get 500 signup bonus + you get rewarded!</p>
        </div>
      </div>
    </div>
  );
}