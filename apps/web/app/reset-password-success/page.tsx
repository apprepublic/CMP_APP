'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function ResetPasswordSuccessPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 border border-success-verified/20 shadow-sm">
          <CheckCircle className="w-10 h-10 text-success-verified" />
        </div>

        {/* Heading */}
        <h1 className="font-h2 text-h2 text-primary-container mb-4">
          Password Reset Successful
        </h1>

        {/* Subtext */}
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-[280px]">
          Your password has been updated. You can now sign in with your new credentials.
        </p>

        {/* Primary Action Button */}
        <Link href="/login" className="w-full">
          <button className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group">
            Back to Sign In
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

        {/* Divider */}
        <div className="w-full h-[1px] bg-outline-variant/30 my-6"></div>

        {/* Secondary Link */}
        <Link
          href="/support"
          className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors duration-200"
        >
          <ShieldCheck className="w-[18px] h-[18px]" />
          Contact Support
        </Link>
      </div>
    </AuthLayout>
  );
}