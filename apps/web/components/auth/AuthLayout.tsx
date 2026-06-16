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
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface">
      <AuthHeader />

      {/* Left Side: Background Image with Text (Desktop Only) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-12"
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
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 pt-20 lg:pt-32 relative min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
        
        {/* Auth Footer */}
        <div className="w-full text-center mt-12 pb-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} CMPapp. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2 font-body-sm text-body-sm text-on-surface-variant">
            <Link href="/terms" className="hover:text-primary-container transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary-container transition-colors">Privacy Policy</Link>
            <Link href="/support" className="hover:text-primary-container transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
