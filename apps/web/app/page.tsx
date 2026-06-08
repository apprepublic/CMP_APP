import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Coins, Music, ShoppingBag, Users, Trophy, ArrowRight, Gift, Zap } from 'lucide-react';

const features = [
  {
    icon: Coins,
    title: 'Complete Tasks',
    description: 'Read articles, watch videos, share content, and earn CMP Coins every day.',
    href: '/tasks',
  },
  {
    icon: Music,
    title: 'Stream Music',
    description: 'Upload your music, get discovered, and earn from streams and downloads.',
    href: '/music',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace',
    description: 'Create your store, list products, and reach thousands of customers.',
    href: '/marketplace',
  },
  {
    icon: Users,
    title: 'Refer Friends',
    description: 'Share your referral code and earn 20% of your friends\' earnings.',
    href: '/referrals',
  },
  {
    icon: Trophy,
    title: 'Contests',
    description: 'Vote for your favorites and win exciting prizes in our contests.',
    href: '/contests',
  },
];

const stats = [
  { value: '10,000+', label: 'Registered Users' },
  { value: '2,000+', label: 'Daily Active Users' },
  { value: '500+', label: 'Marketplace Listings' },
  { value: '200+', label: 'Active Artists' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Nigeria&apos;s #1 Earning Platform</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Earn CMP Coins,{' '}
              <span className="text-primary">Stream Music</span>,{' '}
              <span className="text-primary">Shop & More</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of Nigerians earning real income online. Complete tasks,
              stream music, sell products, and participate in contests — all in one app!
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="xl" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tasks">
                <Button size="xl" variant="outline" className="gap-2">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  Start Earning
                </Button>
              </Link>
            </div>

            {/* Sign up bonus highlight */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-900 dark:bg-yellow-900/20">
              <Gift className="h-4 w-4" />
              <span>Sign up today and get <strong>500 FREE coins</strong>!</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything in One Platform</h2>
            <p className="mt-4 text-muted-foreground">
              Discover all the ways you can earn and engage with CMPapp
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Start earning in just a few simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your free account with just your phone number and a referral code (optional).',
              },
              {
                step: '02',
                title: 'Complete Tasks',
                description: 'Read articles, watch videos, share content, and complete daily challenges to earn coins.',
              },
              {
                step: '03',
                title: 'Withdraw Earnings',
                description: 'Convert your coins to Naira and withdraw directly to your bank account or crypto wallet.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-4 text-6xl font-bold text-primary/20">{item.step}</div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Start Earning?
            </h2>
            <p className="mt-4 text-primary/80 text-lg">
              Join thousands of users already earning with CMPapp
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="xl" variant="secondary" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}