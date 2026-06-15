'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ResetPasswordSuccessPage() {
  return (
    <PageTransition className="min-h-screen bg-surface flex flex-col items-center justify-center relative bg-grid-pattern px-margin-mobile md:px-margin-desktop">
      {/* Brand Anchor */}
      <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
        <span className="font-h3 text-h3 text-primary tracking-tight">CMPapp</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <StaggerContainer stagger={0.1}>
          <StaggerItem>
            {/* Main Card Container */}
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-outline-variant/20 relative overflow-hidden flex flex-col items-center text-center">
              {/* Premium Accent: Top Border */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary-container"></div>

              {/* Success Icon */}
              <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 border border-success-verified/20 shadow-sm">
                <CheckCircle className="w-10 h-10 text-success-verified" />
              </div>

              {/* Heading */}
              <h1 className="font-h2 text-h2 text-primary mb-4">
                Password Reset Successful
              </h1>

              {/* Subtext */}
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-[280px]">
                Your password has been updated. You can now sign in with your new credentials.
              </p>

              {/* Primary Action Button */}
              <Link href="/login" className="w-full">
                <button className="w-full h-12 bg-secondary-container text-primary font-bold font-label-caps text-label-caps rounded-lg hover:bg-secondary-fixed-dim transition-all duration-200 shadow-sm border border-secondary/20 flex items-center justify-center gap-2 group">
                  Back to Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              {/* Divider */}
              <div className="w-full h-[1px] bg-outline-variant/30 my-6"></div>

              {/* Secondary Link */}
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-surface-tint hover:text-primary transition-colors duration-200"
              >
                <ShieldCheck className="w-[18px] h-[18px]" />
                Contact Support
              </Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </motion.div>
    </PageTransition>
  );
}