'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neo-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'text-white bg-gradient-to-br from-neo-primary to-neo-primary-hover shadow-neu-raised hover:shadow-neu-raised-sm',
        destructive:
          'text-white bg-gradient-to-br from-neo-error to-red-600 shadow-neu-raised hover:shadow-neu-raised-sm',
        outline:
          'bg-neu-bg text-neo-text-primary border-2 border-neo-base-dark shadow-neu-flat hover:shadow-neu-raised',
        secondary:
          'text-neo-text-primary bg-gradient-to-br from-neo-secondary to-amber-500 shadow-neu-raised hover:shadow-neu-raised-sm',
        ghost:
          'bg-transparent text-neo-text-primary hover:bg-neu-bg hover:shadow-neu-inset',
        link: 'text-neo-primary underline-offset-4 hover:underline',
        success:
          'text-white bg-gradient-to-br from-neo-success to-emerald-600 shadow-neu-raised hover:shadow-neu-raised-sm',
        neumorphic:
          'text-neo-text-primary bg-neu-bg shadow-neu-raised hover:shadow-neu-raised-sm',
      },
      size: {
        default: 'h-11 px-6 py-3 text-sm',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-14 rounded-xl px-8 text-base',
        xl: 'h-16 rounded-2xl px-10 text-lg',
        icon: 'h-11 w-11 rounded-xl',
        'icon-sm': 'h-9 w-9 rounded-lg',
        'icon-lg': 'h-14 w-14 rounded-2xl',
      },
      shadow: {
        outer: 'shadow-neu-raised',
        'outer-lg': 'shadow-neu-raised',
        inner: 'shadow-neu-inset',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shadow: 'outer',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onTap?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shadow, asChild = false, onTap, disabled: disabledProp, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    
    const isDisabled = Boolean(disabledProp);
    const effectiveShadow = isDisabled ? 'none' : shadow;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shadow: effectiveShadow, className }))}
        ref={ref}
        whileTap={!isDisabled ? { 
          scale: 0.97,
          boxShadow: 'inset 6px 6px 12px rgba(0,0,0,0.4), inset -6px -6px 12px rgba(255,255,255,0.05)'
        } : undefined}
        whileHover={!isDisabled && (variant === 'neumorphic' || variant === 'outline') ? { scale: 1.02 } : undefined}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
        onTap={onTap}
        disabled={isDisabled}
        style={{
          ...props.style,
          opacity: isDisabled ? 0.5 : 1,
        }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };