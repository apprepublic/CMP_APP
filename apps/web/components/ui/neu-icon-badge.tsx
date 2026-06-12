'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NeuIconBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const sizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const NeuIconBadge = React.forwardRef<HTMLDivElement, NeuIconBadgeProps>(
  ({ className, active = false, interactive = false, size = 'md', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    return (
      <Comp ref={ref} {...props}>
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-xl transition-all duration-200',
            'bg-neu-bg',
            sizeStyles[size],
            interactive ? 'cursor-pointer hover:shadow-neu-raised-sm' : '',
            active
              ? 'shadow-neu-inset'
              : 'shadow-neu-raised',
            className
          )}
        >
          {children}
        </div>
      </Comp>
    );
  }
);
NeuIconBadge.displayName = 'NeuIconBadge';

export { NeuIconBadge };