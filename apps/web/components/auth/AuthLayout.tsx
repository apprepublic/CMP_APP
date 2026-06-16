'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthHeader } from '@/components/auth-header';
import { Footer } from '@/components/layout/Footer';

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
      <Footer />
    </div>
  );
}
