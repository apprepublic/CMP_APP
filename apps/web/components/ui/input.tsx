'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neo-text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-text-muted">
              {icon}
            </div>
          )}
          <motion.input
            type={type}
            className={cn(
              'w-full rounded-xl px-4 py-3 text-sm transition-all duration-300 outline-none bg-neu-bg text-neo-text-primary',
              'shadow-neu-inset',
              'placeholder:text-neo-text-muted',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-neu-flat',
              icon && 'pl-11',
              error && 'focus:ring-2 focus:ring-neo-error focus:ring-offset-0',
              className
            )}
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            whileHover={{ boxShadow: 'inset 6px 6px 10px rgba(0,0,0,0.4), inset -6px -6px 10px rgba(255,255,255,0.05)' }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 17 }}
            disabled={disabled}
            {...props}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xs text-neo-error"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };