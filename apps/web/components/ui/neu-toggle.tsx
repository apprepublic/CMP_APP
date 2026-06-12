'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface NeuToggleProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  size?: 'sm' | 'md' | 'lg';
}

const NeuToggle = React.forwardRef<HTMLButtonElement, NeuToggleProps>(
  ({ className, size = 'md', disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-13',
    };
    
    const thumbStyles = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };
    
    const translateStyles = {
      sm: { unchecked: 0, checked: 16 },
      md: { unchecked: 0, checked: 20 },
      lg: { unchecked: 0, checked: 24 },
    };

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-300',
          'bg-neu-bg',
          'shadow-neu-inset',
          'data-[state=checked]:bg-neo-primary',
          'data-[state=checked]:shadow-neu-raised',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            'pointer-events-none flex items-center justify-center transition-all duration-200',
            thumbStyles[size],
            'rounded-full bg-white',
            'shadow-neu-raised',
            'data-[state=unchecked]:translate-x-0',
            'data-[state=checked]:translate-x-full',
            'data-[state=unchecked]:text-transparent',
            'data-[state=checked]:text-neo-primary'
          )}
        >
          <motion.div
            initial={false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <CheckIcon className="h-3 w-3" strokeWidth={3} />
          </motion.div>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
NeuToggle.displayName = 'NeuToggle';

export { NeuToggle };