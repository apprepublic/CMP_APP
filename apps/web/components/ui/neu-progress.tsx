'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface NeuProgressProps extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'className'> {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const NeuProgress = React.forwardRef<HTMLDivElement, NeuProgressProps>(
  ({ className, size = 'md', showLabel = false, label, value = 0, max = 100, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-1.5',
      md: 'h-3',
      lg: 'h-5',
    };
    
    const numericValue = typeof value === 'number' ? value : 0;
    const numericMax = typeof max === 'number' ? max : 100;
    const percentage = numericMax > 0 ? Math.min(100, (numericValue / numericMax) * 100) : 0;

    return (
      <div className={cn('w-full', className)}>
        {(label || showLabel) && (
          <div className="flex items-center justify-between mb-2">
            {label && <span className="text-sm font-semibold text-neo-text-primary">{label}</span>}
            {showLabel && (
              <span className="text-sm font-mono text-neo-text-secondary bg-neu-bg px-2 py-1 rounded-lg shadow-neu-inset">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          value={numericValue}
          max={numericMax}
          className={cn(
            'relative w-full overflow-hidden rounded-full',
            'bg-neu-bg',
            'shadow-neu-inset',
            sizeStyles[size]
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              'h-full w-0 rounded-full transition-all duration-500 ease-out',
              'bg-gradient-to-r from-neo-primary to-neo-primary-hover',
              'shadow-neu-raised-sm',
              'data-[state=indeterminate]:animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full"
            />
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>
      </div>
    );
  }
);
NeuProgress.displayName = 'NeuProgress';

export { NeuProgress };