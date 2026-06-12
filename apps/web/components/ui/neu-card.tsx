'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ className, interactive = false, padding = 'md', children, ...props }, ref) => {
    const Comp = interactive ? motion.div : 'div';
    
    return (
      <Comp
        ref={ref}
        className={cn(
          'bg-neu-bg rounded-2xl shadow-neu-flat transition-all duration-300',
          paddingStyles[padding],
          className
        )}
        whileHover={interactive ? { y: -2, boxShadow: '8px 8px 16px rgba(174,174,192,0.4), -8px -8px 16px rgba(255,255,255,0.7)' } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
NeuCard.displayName = 'NeuCard';

export { NeuCard };