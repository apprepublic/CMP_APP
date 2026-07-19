'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthHeader } from '@/components/auth-header';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col lg:flex-row bg-surface">
        <AuthHeader />

        {/* Left Side: Background Image with Text (Desktop Only) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-12 lg:min-h-screen"
          style={{
            backgroundImage: 'url(/login.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-navy-glass mix-blend-multiply opacity-60"></div>

          <div className="relative z-10 max-w-lg text-white">
            <h2 className="font-h1 text-h1 mb-6">Unlock Your Creative Potential.</h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-12">
              Stream music, complete tasks, refer friends, and earn real rewards. Join a thriving community of creators getting paid for what they love.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 pt-20 lg:pt-32 relative min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
      
      {/* Footer from Landing Page */}
      <footer className="bg-primary text-white py-16 px-margin-mobile md:px-margin-desktop border-t border-white/10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-white/70">
              The creative economy hub empowering the global digital generation through music, tasks, and community.
            </p>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">PLATFORM</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Earn Coins</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/music">Stream Music</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/contests">Contests</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">COMMUNITY</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/referrals">Referral Program</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/articles">Articles</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">LEGAL</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/terms">Terms of Service</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-white/70 gap-4">
          <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
          <div className="flex gap-6">
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
