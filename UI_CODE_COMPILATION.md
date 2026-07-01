# CMP App - Complete UI Code Compilation

**Generated:** 2026-07-01 10:39:36

**Project:** @cmpapp/web v1.0.0
**Framework:** Next.js 14.2.35 (static export, output: 'export', trailingSlash: true)
**Styling:** Tailwind CSS 3.4 + class-variance-authority + tailwind-merge
**State Management:** TanStack React Query v5 + Zustand v4.5
**Animations:** Framer Motion v12.42
**UI Primitives:** Radix UI (accordion, dialog, dropdown, select, tabs, toast, tooltip, etc.)
**Icons:** Lucide React v0.316 + Google Material Symbols
**Forms:** react-hook-form + zod
**Auth:** Supabase Auth (@supabase/supabase-js v2.108)
**Music:** Howler.js
**Charts:** Recharts v2.12
**Monorepo:** Turborepo with apps/web, packages/types, packages/utils

---



## Configuration Files


### File: apps/web/package.json

```tsx
{
  "name": "@cmpapp/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:static": "next build",
    "preview": "npx serve out",
    "deploy": "wrangler pages deploy out --project-name=cmpapp-web",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@cmpapp/types": "*",
    "@cmpapp/utils": "*",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@supabase/supabase-js": "^2.108.1",
    "@tanstack/react-query": "^5.22.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "crypto-js": "^4.2.0",
    "framer-motion": "^12.42.0",
    "howler": "^2.2.4",
    "lucide-react": "^0.316.0",
    "next": "^14.2.35",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.0",
    "recharts": "^2.12.0",
    "resend": "^6.12.4",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@types/crypto-js": "^4.2.2",
    "@types/howler": "^2.2.11",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.17",
    "caniuse-lite": "^1.0.30001600",
    "eslint": "^9.0.0",
    "eslint-config-next": "^14.2.35",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
```
---


### File: apps/web/next.config.js

```tsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  transpilePackages: ['@cmpapp/types', '@cmpapp/utils'],
  output: 'export',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
```
---


### File: apps/web/postcss.config.js

```tsx
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
---


### File: apps/web/tsconfig.json

```tsx
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": [],
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@cmpapp/types": ["../../packages/types/src"],
      "@cmpapp/utils": ["../../packages/utils/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
---



## Root Layout & Providers


### File: apps/web/app/layout.tsx

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ConditionalChrome } from '@/components/layout/ConditionalChrome';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CMPapp - Complete Tasks, Stream Music, Shop & More',
  description: 'Nigeria\'s premier earning platform. Complete tasks, stream music, sell products, and earn CMP Coins!',
  keywords: ['earn money', 'online earning', 'Nigeria', 'music streaming', 'marketplace', 'CMP Coin'],
  authors: [{ name: 'CMPapp Team' }],
  icons: {
    icon: '/coin.png',
  },
  openGraph: {
title: 'CMPapp - Complete Tasks, Stream Music, Shop & More',
    description: 'Nigeria\'s premier earning platform',
    url: 'https://cmpapp.ng',
    siteName: 'CMPapp',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ConditionalChrome>{children}</ConditionalChrome>
        </Providers>
      </body>
    </html>
  );
}
```
---


### File: apps/web/app/providers.tsx

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { PlayerProvider } from '@/components/music/PlayerProvider';
import { PlayerBar } from '@/components/music/PlayerBar';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        {children}
        <PlayerBar />
        <Toaster />
      </PlayerProvider>
    </QueryClientProvider>
  );
}
```
---


### File: apps/web/app/(app)/layout.tsx

```tsx
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
```
---



## UI Components


### File: apps/web/components/ui/button.tsx

```tsx
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
```
---


### File: apps/web/components/ui/input.tsx

```tsx
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
```
---


### File: apps/web/components/ui/neu-card.tsx

```tsx
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
```
---


### File: apps/web/components/ui/neu-icon-badge.tsx

```tsx
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
```
---


### File: apps/web/components/ui/page-transition.tsx

```tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageTransition({ children, className = '', delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', stagger = 0.08 }: { children: ReactNode; className?: string; stagger?: number }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: stagger },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className={className}
      {...({ variants: containerVariants } as HTMLMotionProps<"div">)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```
---


### File: apps/web/components/ui/toast.tsx

```tsx
import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-600 bg-green-50 text-green-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<ToastProps, typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
};
```
---


### File: apps/web/components/ui/toaster.tsx

```tsx
import { useToast } from '@/components/ui/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
```
---


### File: apps/web/components/auth-header.tsx

```tsx
'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';

export function AuthHeader() {
  const { isAuthenticated, user } = useUserStore();
  const { wallet } = useWallet();

  return (
    <nav className="hidden md:flex fixed top-0 w-full z-50 bg-primary backdrop-blur-lg border-b border-white/10 shadow-md h-20 justify-between items-center px-margin-desktop">
      <Link href="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
      </Link>
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-white/10 backdrop-blur-md">
              <span className="material-symbols-outlined text-secondary-fixed text-xl">paid</span>
              <span className="font-data-md text-data-md text-secondary-fixed">
                {wallet?.balance?.toLocaleString() || 0}
              </span>
            </div>
            <button className="text-white hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <Link href="/profile">
              <span className="material-symbols-outlined text-2xl text-white hover:text-secondary-fixed transition-colors cursor-pointer">account_circle</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="text-white hover:text-secondary-fixed font-medium transition-colors">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-body-md text-body-md px-6 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)]">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
```
---


### File: apps/web/components/auth/AuthLayout.tsx

```tsx
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
      
      {/* Footer from Landing Page */}
      <footer className="bg-primary text-white py-16 px-margin-mobile md:px-margin-desktop border-t border-white/10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-white/70">
              The creative economy hub empowering the global digital generation through music, tasks, and community.
            </p>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">PLATFORM</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">How it Works</Link></li>

              <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Earn Coins</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/wallet">Store</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">COMMUNITY</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Discord Hub</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/referrals">Referral Program</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Creator Perks</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/contests">Leaderboards</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">LEGAL</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-white/70 gap-4">
          <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
          <div className="flex gap-6">
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
```
---



## Layout Components


### File: apps/web/components/layout/DashboardLayout.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import BottomNavBar from './BottomNavBar';
import AnnouncementsBanner from './AnnouncementsBanner';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * AuthGuard — checks the live Supabase session before rendering any
 * protected content. This runs on the client because the app is a static
 * export (output: 'export') and Next.js middleware is not available.
 *
 * Flow:
 *  1. Mount → show loading spinner, call supabase.auth.getSession()
 *  2. No session → redirect to /login immediately
 *  3. Session exists → render children (DashboardLayout content)
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { fetchUser } = useUserStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // getSession() reads from local storage — fast, no network request
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        // No active session — redirect to login, preserving the intended destination
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`/login?returnTo=${returnTo}`);
        return;
      }

      // Valid session — fetch the user profile into the store
      await fetchUser();
      if (mounted) setAuthChecked(true);
    };

    checkAuth();

    // Also listen for auth state changes (e.g. session expiry while page is open)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show a minimal full-screen spinner while auth is being verified
  // This prevents any flash of protected content to guest users
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#B8860B]" />
          <p className="text-on-surface-variant text-sm font-body-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <AuthGuard>
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex">
        <SideNavBar />

        <div
          className={clsx(
            "flex-1 flex flex-col min-h-screen w-full relative transition-all duration-300 ease-in-out",
            isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
          )}
        >
          <TopNavBar />
          <AnnouncementsBanner />
          {children}
        </div>

        <BottomNavBar />
      </div>
    </AuthGuard>
  );
}
```
---


### File: apps/web/components/layout/ConditionalChrome.tsx

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/**
 * Renders the global marketing Header + Footer ONLY on routes that do not
 * already provide their own navigation chrome.
 *
 * Previously the root layout rendered <Header/> + <Footer/> on EVERY route,
 * while the landing page, the dashboard layout, and most feature pages each
 * draw their own fixed nav — producing stacked/duplicate headers. The prefixes
 * below all render their own chrome, so the global chrome is suppressed there.
 */
const selfChromedPrefixes = [
  '/wallet',
  '/dashboard',
  '/settings',
  '/login',
  '/register',
  '/verify',
  '/tasks',
  '/music',
  '/marketplace',
  '/referrals',
  '/contests',
  '/articles',
  '/', // Landing page has its own premium nav
];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  const hasOwnChrome =
    selfChromedPrefixes.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    );

  if (hasOwnChrome) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```
---


### File: apps/web/components/layout/SideNavBar.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabase';

export default function SideNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggle } = useSidebarStore();
  const { logout } = useUserStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/tasks', label: 'Tasks', icon: 'task' },
    { href: '/music', label: 'Music', icon: 'library_music' },
    { href: '/articles', label: 'Articles', icon: 'article' },
    { href: '/referrals', label: 'Referrals', icon: 'groups' },
    { href: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  ];

  return (
    <nav
      className={clsx(
        "hidden lg:flex flex-col h-full border-r border-outline-variant bg-primary dark:bg-primary-container fixed left-0 z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo + Collapse Toggle */}
      <div className={clsx("flex items-center", isCollapsed ? "p-4 justify-center" : "p-6 justify-between")}>
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="CMPapp"
            className={clsx("h-10 w-auto transition-all duration-300 shrink-0 object-contain", isCollapsed && "h-8")}
          />
        </Link>
      </div>

      {/* Toggle Button */}
      <div className={clsx("px-2 mb-2", isCollapsed ? "flex justify-center" : "flex justify-end pr-4")}>
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-primary-container hover:bg-on-primary-fixed-variant hover:text-secondary-fixed transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-1 mt-2 flex-1 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : undefined}
              className={clsx(
                "flex items-center gap-3 py-3 rounded-lg font-label-caps text-label-caps transition-all duration-200",
                isCollapsed ? "justify-center px-0 mx-1" : "px-4 mx-2",
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-primary-container hover:bg-on-primary-fixed-variant"
              )}
            >
              <span className={clsx("material-symbols-outlined shrink-0", isActive && "text-on-secondary-container")}>
                {link.icon}
              </span>
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden">{link.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-2 mt-auto">
        <div className={clsx("flex flex-col gap-1", isCollapsed ? "px-0" : "px-2")}>
          <Link
            href="/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={clsx(
              "flex items-center gap-3 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps",
              isCollapsed ? "justify-center px-0 mx-1" : "px-4 mx-2"
            )}
          >
            <span className="material-symbols-outlined shrink-0">settings</span>
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={clsx(
              "flex items-center gap-3 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant transition-colors rounded-lg font-label-caps text-label-caps w-full text-left",
              isCollapsed ? "justify-center px-0 mx-1" : "px-4 mx-2"
            )}
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
```
---


### File: apps/web/components/layout/TopNavBar.tsx

```tsx
'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';

export default function TopNavBar() {
  const { user } = useUserStore();
  const { wallet, loading: walletLoading } = useWallet();

  const displayBalance = walletLoading 
    ? '...' 
    : (wallet?.balance ?? 0).toLocaleString();

  return (
    <header className="sticky top-0 w-full z-40 bg-primary shadow-md flex justify-between items-center px-margin-mobile lg:px-margin-desktop h-20">
      <div className="flex items-center gap-6">
        <Link href="/" className="lg:hidden">
          <img src="/logo.png" alt="CMPapp" className="h-8 w-auto" />
        </Link>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center bg-[#1A1A1A] lg:bg-secondary-container lg:text-on-secondary-container rounded-lg lg:px-4 lg:py-2 px-3 py-1.5 border lg:border-none border-secondary/30 transition-colors">
          <img src="/coin.png" alt="CMP" className="w-5 h-5 object-contain mr-1.5" />
          <span className="font-data-md text-data-md text-secondary-fixed lg:text-on-secondary-container">
            {displayBalance}
          </span>
        </div>
        
        <NotificationDropdown />
        <UserMenuDropdown />
      </div>
    </header>
  );
}
```
---


### File: apps/web/components/layout/BottomNavBar.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function BottomNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Home', icon: 'home' },
    { href: '/tasks', label: 'Tasks', icon: 'task' },
    { href: '/music', label: 'Music', icon: 'music_note' },
    { href: '/articles', label: 'Articles', icon: 'article' },
    { href: '/referrals', label: 'Refer', icon: 'groups' },
    { href: '/wallet', label: 'Wallet', icon: 'wallet' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-3 pb-safe px-4 bg-navy-glass backdrop-blur-md shadow-lg z-50 border-t border-white/10">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-col items-center justify-center scale-110 transition-transform active:opacity-80",
              isActive ? "text-secondary-fixed" : "text-on-primary-container opacity-70"
            )}
          >
            <span 
              className="material-symbols-outlined mb-1"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {link.icon}
            </span>
            <span className="font-label-caps text-label-caps uppercase text-[10px] md:text-[12px]">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```
---


### File: apps/web/components/layout/Header.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import { cn } from '@/lib/utils';
import {
  Coins,
  Music,
  ShoppingBag,
  Users,
  Trophy,
  Wallet,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';

const publicNavItems = [
  { href: '/', label: 'Home', icon: Coins },

  { href: '/contests', label: 'Contests', icon: Trophy },
];

const authenticatedNavItems = [
  { href: '/tasks', label: 'Tasks', icon: Coins },
  { href: '/music', label: 'Music', icon: Music },

  { href: '/referrals', label: 'Refer', icon: Users },
  { href: '/contests', label: 'Contests', icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useUserStore();
  const { wallet } = useWallet();

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-neu-bg shadow-neu-flat">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href) ?? false;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2">
                <NeuIconBadge size="sm" active={isActive}>
                  <Icon className={cn('h-4 w-4', isActive ? 'text-neo-primary' : 'text-neo-text-secondary')} />
                </NeuIconBadge>
                <span className={cn(
                  'font-body-sm text-body-sm',
                  isActive ? 'text-neo-primary font-semibold' : 'text-neo-text-secondary'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Link href="/wallet" className="hidden sm:flex">
                <Button variant="neumorphic" size="sm" className="gap-2">
                  <Wallet className="h-4 w-4 text-neo-secondary" />
                  <span className="font-semibold text-neo-text-primary">
                    {new Intl.NumberFormat('en-NG').format(wallet?.balance || 0)}
                  </span>
                </Button>
              </Link>
              <Link href="/profile">
                <NeuIconBadge size="sm">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-neo-primary flex items-center justify-center text-white text-sm font-bold">
                      {(() => {
                        const name = user.displayName || user.email || 'U';
                        const parts = name.trim().split(/\s+/);
                        return parts.length >= 2
                          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                          : name[0].toUpperCase();
                      })()}
                    </span>
                  )}
                </NeuIconBadge>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2 text-neo-text-secondary">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <NeuIconBadge
            size="sm"
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-neo-text-primary" /> : <Menu className="h-5 w-5 text-neo-text-primary" />}
          </NeuIconBadge>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neu-bg-dark bg-neu-bg">
          <nav className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href) ?? false;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <button
                    className={cn(
                      'w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all',
                      isActive ? 'shadow-neu-inset text-neo-primary' : 'shadow-neu-flat text-neo-text-secondary'
                    )}
                  >
                    <NeuIconBadge size="sm" active={isActive}>
                      <Icon className="h-4 w-4" />
                    </NeuIconBadge>
                    <span className={cn(
                      'font-body-md text-body-md',
                      isActive && 'font-semibold'
                    )}>
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl shadow-neu-flat text-neo-text-secondary">
                  <NeuIconBadge size="sm">
                    <Wallet className="h-4 w-4 text-neo-secondary" />
                  </NeuIconBadge>
                  <span className="font-body-md text-body-md">
                    Wallet ({new Intl.NumberFormat('en-NG').format(wallet?.balance || 0)})
                  </span>
                </button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
```
---


### File: apps/web/components/layout/Footer.tsx

```tsx
import Link from 'next/link';
import { Music, ShoppingBag, Coins, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  platform: [
    { href: '/tasks', label: 'Earn Coins' },
    { href: '/music', label: 'Stream Music' },

    { href: '/contests', label: 'Contests' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/kyc', label: 'KYC Policy' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nigeria&apos;s premier earning platform. Complete tasks, stream music, sell products, and earn CMP Coins!
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.468c2.452 0 2.784.011 3.807.058.975.045 1.504.207 1.857.344.466.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041v.08c0 2.453-.011 2.784-.058 3.807-.045.975-.207 1.504-.344 1.857a4.902 4.902 0 01-.748 1.15 4.902 4.902 0 01-1.15.748c-.353.137-.882.3-1.857.344-1.055.048-1.37.058-4.041.058h-.453c-2.433 0-2.784-.011-3.806-.058-.975-.045-1.504-.207-1.857-.344-.466-.182-.8-.398-1.15-.748a4.902 4.902 0 01-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@cmpapp.ng</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+234 800 CMP APP</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CMPapp. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```
---


### File: apps/web/components/layout/UserMenuDropdown.tsx

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

export default function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const nameParts = displayName.trim().split(/\s+/);
  const initials = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : displayName.substring(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-bold text-sm border-2 border-transparent hover:border-secondary transition-all active:scale-95 overflow-hidden"
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
            <p className="font-bold text-on-surface truncate">{displayName}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-surface-variant px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              {user?.role || 'USER'}
            </div>
          </div>
          
          <div className="py-2">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface hover:text-primary-container transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Settings
            </Link>
            <Link 
              href="/wallet" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface hover:text-primary-container transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              Wallet
            </Link>
          </div>
          
          <div className="border-t border-outline-variant/30 py-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/50 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```
---


### File: apps/web/components/layout/NotificationDropdown.tsx

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/lib/hooks';
import { markNotificationRead, markAllNotificationsRead, AppNotification } from '@/lib/queries';
import { useUserStore } from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useNotifications(user?.id || '');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Real-time subscription for notifications
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationRead(id);
    queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
  };

  const handleMarkAllRead = async () => {
    if (user?.id) {
      await markAllNotificationsRead(user.id);
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TRANSACTION': return 'payments';
      case 'SOCIAL': return 'group';
      case 'SYSTEM': return 'info';
      default: return 'notifications';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-on-primary lg:text-on-primary-container hover:text-secondary transition-colors scale-95 active:duration-100 flex items-center justify-center p-2"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-primary lg:border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
            <h3 className="font-h3 text-h3 text-primary-container">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-secondary hover:text-secondary-fixed-dim transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-on-surface-variant text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">notifications_paused</span>
                <p className="text-on-surface-variant font-body-sm text-body-sm">You have no notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {notifications.map((n: AppNotification) => (
                  <div 
                    key={n.id} 
                    className={`p-4 flex gap-4 transition-colors hover:bg-surface-alt cursor-pointer ${!n.is_read ? 'bg-primary-fixed/10' : ''}`}
                    onClick={() => { if (!n.is_read) handleMarkAsRead(n.id); }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-variant text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {getIconForType(n.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!n.is_read ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-outline mt-2 font-data-md uppercase tracking-wider">
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="w-2 h-2 rounded-full bg-secondary self-center shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```
---


### File: apps/web/components/layout/AnnouncementsBanner.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLatestAnnouncement } from '@/lib/hooks';

export default function AnnouncementsBanner() {
  const [isClient, setIsClient] = useState(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setDismissedId(localStorage.getItem('dismissedTaskBannerId'));
  }, []);

  // Only run the query if we are on the client.
  // We can't really skip the query purely based on dismissedId because a NEW announcement might have a DIFFERENT id.
  // But by using React Query, this fetch is cached for 1 hour, so we don't spam Supabase on every route change!
  const { data: latestTask } = useLatestAnnouncement(isClient);

  if (!isClient || !latestTask) return null;
  if (dismissedId === latestTask.id) return null;

  const handleDismiss = () => {
    localStorage.setItem('dismissedTaskBannerId', latestTask.id);
    setDismissedId(latestTask.id);
  };

  return (
    <div className="bg-secondary-container/90 backdrop-blur-sm border-b border-outline-variant/30 text-on-secondary-container px-4 py-3 flex items-center justify-between shadow-sm relative z-40 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
        </div>
        <p className="font-body-sm text-sm">
          <strong>New Task!</strong> Earn <span className="font-bold text-primary">{latestTask.coin_reward} coins</span> by completing: 
          <Link href={`/tasks`} className="ml-1 underline hover:text-primary font-medium transition-colors">
            {latestTask.title}
          </Link>
        </p>
      </div>
      <button 
        onClick={handleDismiss}
        className="p-1.5 hover:bg-on-secondary-container/10 rounded-full transition-colors flex items-center justify-center text-on-surface-variant hover:text-on-surface"
        aria-label="Dismiss announcement"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
```
---



## Music Components


### File: apps/web/components/music/PlayerProvider.tsx

```tsx
'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Song } from '@/lib/queries';
import { logSongPlay } from '@/lib/queries';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';

type RepeatMode = 'none' | 'all' | 'one';

interface PlayerState {
  current: Song | null;
  queue: Song[];
  index: number;
  isPlaying: boolean;
  progress: number; // seconds
  duration: number; // seconds
  volume: number; // 0..1
  isShuffled: boolean;
  repeatMode: RepeatMode;
  play: (song: Song, queue?: Song[], taskInfo?: { id: string; isPosted: boolean; coinReward: number }) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider>');
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loggedRef = useRef(false); // ensures one reward log per track play
  const queryClient = useQueryClient();

  const [current, setCurrent] = useState<Song | null>(null);
  const [activeTask, setActiveTask] = useState<{ id: string; isPosted: boolean; coinReward: number } | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledQueue, setShuffledQueue] = useState<Song[]>([]);
  const [shuffledIndex, setShuffledIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const currentRef = useRef<Song | null>(null);
  const activeTaskRef = useRef<{ id: string; isPosted: boolean; coinReward: number } | null>(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    activeTaskRef.current = activeTask;
  }, [activeTask]);

  const isAuthenticated = useUserStore((state: any) => state.isAuthenticated);

  // Stop music and reset player state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      setCurrent(null);
      setQueue([]);
      setIndex(0);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      setActiveTask(null);
      loggedRef.current = false;
    }
  }, [isAuthenticated]);

  // Create the audio element once (client only).
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTime = () => {
      setProgress(audio.currentTime);
      const curSong = currentRef.current;
      const actTask = activeTaskRef.current;
      // Stream-to-earn: log a qualifying play once we cross 30s.
      if (!loggedRef.current && audio.currentTime >= 30 && curSong) {
        loggedRef.current = true;
        logSongPlay(curSong.id, audio.currentTime).catch(() => {});

        // Complete the task!
        if (actTask) {
          const completePromise = actTask.isPosted
            ? api.completePostedTask(actTask.id, {
                platform: 'STREAM_MUSIC',
                submittedAt: new Date().toISOString(),
                comment: 'Automated stream completion'
              })
            : api.completeTask(actTask.id, false);

          completePromise
            .then(async () => {
              toast({
                title: 'Task Completed!',
                description: `Successfully streamed and earned ${actTask.coinReward} coins.`,
                variant: 'success',
              });
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.id) {
                  await api.updateTaskCompletionStreak(session.user.id);
                }
              } catch (e) {
                console.warn('[PlayerProvider] Failed to update streak:', e);
              }
              // Refresh wallet and streak everywhere in the app immediately
              queryClient.invalidateQueries({ queryKey: ['wallet'] });
              queryClient.invalidateQueries({ queryKey: ['streak'] });
            })
            .catch((err: any) => {
              console.error('Failed to complete streaming task:', err);
              toast({
                title: 'Task Completion Failed',
                description: err.message || 'Failed to complete streaming task.',
                variant: 'destructive',
              });
            });

          setActiveTask(null); // prevent duplicate submissions
        }
      }
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      // Repeat one: replay the same song
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
        return;
      }
      nextRef.current();
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playIndex = useCallback((q: Song[], i: number) => {
    const audio = audioRef.current;
    const song = q[i];
    if (!audio || !song) return;
    loggedRef.current = false;
    audio.src = song.audio_url;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    setCurrent(song);
    setIndex(i);
    setProgress(0);
  }, []);

  const play = useCallback(
    (song: Song, q?: Song[], taskInfo?: { id: string; isPosted: boolean; coinReward: number }) => {
      const list = q && q.length ? q : [song];
      const i = Math.max(0, list.findIndex((s) => s.id === song.id));
      setQueue(list);
      playIndex(list, i === -1 ? 0 : i);
      setActiveTask(taskInfo || null);
    },
    [playIndex]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [current]);

  const next = useCallback(() => {
    if (!queue.length) return;
    if (isShuffled && shuffledQueue.length) {
      const nextIdx = shuffledIndex + 1;
      if (nextIdx >= shuffledQueue.length) {
        if (repeatMode === 'all' || repeatMode === 'one') {
          setShuffledIndex(0);
          playIndex(shuffledQueue, 0);
        }
        return;
      }
      setShuffledIndex(nextIdx);
      playIndex(shuffledQueue, nextIdx);
    } else {
      if (repeatMode === 'none' && index >= queue.length - 1) return;
      playIndex(queue, (index + 1) % queue.length);
    }
  }, [queue, index, playIndex, isShuffled, shuffledQueue, shuffledIndex, repeatMode]);

  const prev = useCallback(() => {
    if (!queue.length) return;
    if (isShuffled && shuffledQueue.length) {
      const prevIdx = (shuffledIndex - 1 + shuffledQueue.length) % shuffledQueue.length;
      setShuffledIndex(prevIdx);
      playIndex(shuffledQueue, prevIdx);
    } else {
      playIndex(queue, (index - 1 + queue.length) % queue.length);
    }
  }, [queue, index, playIndex, isShuffled, shuffledQueue, shuffledIndex]);

  // keep stable refs for the 'ended' listener
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  const repeatModeRef = useRef(repeatMode);
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    const clamped = Math.min(1, Math.max(0, v));
    if (audio) audio.volume = clamped;
    setVolumeState(clamped);
  }, []);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      setIsShuffled(false);
    } else if (current && queue.length > 1) {
      const rest = queue.filter((s) => s.id !== current.id);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      setShuffledQueue([current, ...rest]);
      setShuffledIndex(0);
      setIsShuffled(true);
    }
  }, [isShuffled, current, queue]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none'));
  }, []);

  return (
    <PlayerContext.Provider
      value={{ current, queue, index, isPlaying, progress, duration, volume, isShuffled, repeatMode, play, toggle, next, prev, seek, setVolume, toggleShuffle, cycleRepeat }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
```
---


### File: apps/web/components/music/PlayerBar.tsx

```tsx
'use client';

import { usePlayer } from './PlayerProvider';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { Shuffle, Repeat } from 'lucide-react';

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerBar() {
  const { current, isPlaying, progress, duration, volume, isShuffled, repeatMode, toggle, next, prev, seek, setVolume, toggleShuffle, cycleRepeat } = usePlayer();
  const { isCollapsed } = useSidebarStore();
  const isAuthenticated = useUserStore((state: any) => state.isAuthenticated);

  if (!isAuthenticated || !current) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-16 lg:bottom-0 z-30 bg-primary-container text-on-primary border-t border-outline/20 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ${
        isCollapsed
          ? 'w-full lg:w-[calc(100%-72px)] lg:left-[72px]'
          : 'w-full lg:w-[calc(100%-16rem)] lg:left-64'
      }`}
    >
      {/* Progress Bar — scoped to its own container, does NOT span the full bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant/20">
        <div className="h-full bg-secondary-container relative" style={{ width: `${pct}%` }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary-fixed rounded-full shadow-md pointer-events-none"></div>
        </div>
        {/* Seek input overlaid only on the 1px progress track */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
      </div>

      <div className="h-[72px] px-4 md:px-6 flex items-center justify-between">
        {/* Now Playing Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
          <div className="w-12 h-12 rounded bg-surface-variant overflow-hidden shrink-0 shadow-sm border border-outline/10">
            {current.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="w-full h-full object-cover" src={current.cover_url} alt={current.title} />
            )}
          </div>
          <div className="truncate hidden sm:block">
            <h5 className="font-body-md text-body-md font-semibold text-on-primary truncate">{current.title}</h5>
            <p className="font-body-sm text-body-sm text-on-primary-container truncate">{current.artist?.stage_name ?? 'Unknown artist'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 w-1/3">
          <button onClick={toggleShuffle} className={`transition-colors hidden md:block ${isShuffled ? 'text-secondary-fixed' : 'text-on-primary-container hover:text-secondary'}`} aria-label="Shuffle">
            <Shuffle className="w-5 h-5" />
          </button>
          <button onClick={prev} className="text-on-primary hover:text-secondary transition-colors" aria-label="Previous">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>skip_previous</span>
          </button>
          <button 
            onClick={toggle}
            className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary transition-colors hover:scale-105 shadow-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            )}
          </button>
          <button onClick={next} className="text-on-primary hover:text-secondary transition-colors" aria-label="Next">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>skip_next</span>
          </button>
          <button onClick={cycleRepeat} className={`transition-colors hidden md:block ${repeatMode !== 'none' ? 'text-secondary-fixed' : 'text-on-primary-container hover:text-secondary'}`} aria-label="Repeat">
            {repeatMode === 'one' ? (
              <span className="relative">
                <Repeat className="w-5 h-5" />
                <span className="absolute -top-1 -right-1.5 text-[9px] font-bold">1</span>
              </span>
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-end gap-4 w-1/3 text-on-primary-container hidden md:flex">
          <span className="font-data-md text-data-md tabular-nums">{fmt(progress)} / {fmt(duration)}</span>
          {/* Download button — only enabled when song permits download */}
          {current?.is_download_enabled ? (
            <a
              href={current.audio_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
              aria-label="Download song"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </a>
          ) : (
            <button
              disabled
              className="opacity-30 cursor-not-allowed"
              title="Download not available for this track"
              aria-label="Download unavailable"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
          )}
          <div className="flex items-center gap-2 w-24 relative">
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-1 bg-surface-variant/30 rounded-full w-full pointer-events-none">
              <div className="h-full bg-secondary-container rounded-full" style={{ width: `${volume * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
---



## Task Components


### File: apps/web/components/tasks/ArticleReader.tsx

```tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useArticle, useClaimArticle, useArticles, useStreak } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';

function createConfetti() {
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '100vh';
    confetti.style.backgroundColor = i % 2 === 0 ? '#B8860B' : '#FDC34D';
    confetti.style.animation = `float-up ${1.5 + Math.random() * 2}s linear forwards`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

function renderArticleContent(content: string) {
  const paragraphs = content.split('\n\n');
  return paragraphs.map((paragraph: string, index: number) => {
    const imgMatch = paragraph.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      return (
        <div key={`img-${index}`} className="my-8">
          <img src={src} alt={alt || 'Article image'} className="w-full max-w-3xl mx-auto rounded-xl object-cover shadow-md" />
          {alt && <p className="text-center text-on-surface-variant text-sm mt-2 font-body-sm">{alt}</p>}
        </div>
      );
    }
    const htmlImgMatch = paragraph.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (htmlImgMatch) {
      const src = htmlImgMatch[1];
      return (
        <div key={`img-${index}`} className="my-8">
          <img src={src} alt="Article image" className="w-full max-w-3xl mx-auto rounded-xl object-cover shadow-md" />
        </div>
      );
    }
    return (
      <p key={index} className="font-body-lg text-body-lg text-on-surface mb-6 leading-relaxed">{paragraph}</p>
    );
  });
}

export default function ArticleReader({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: article, isLoading } = useArticle(slug);
  const claimArticle = useClaimArticle();

  const [readingProgress, setReadingProgress] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);
  const [adGateDone, setAdGateDone] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const unlocked = readingProgress >= 95;
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
      setUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (!userId || !article?.id) return;
    supabase
      .from('coin_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'earn')
      .eq('metadata->>article_id', article.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setClaimed(true); });
  }, [userId, article?.id]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    setReadingProgress(0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      setReadingProgress(Math.min((window.scrollY / scrollableHeight) * 100, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (unlocked && !adGateDone && !claimed) {
      setShowAdGate(true);
    }
  }, [unlocked, adGateDone, claimed]);

  useEffect(() => {
    if (!showAdGate || adGateDone) return;
    if (adTimer > 0) {
      const t = setTimeout(() => setAdTimer(p => p - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setAdGateDone(true);
      setShowAdGate(false);
    }
  }, [showAdGate, adGateDone, adTimer]);

  const handleClaim = useCallback(async () => {
    if (!article || claimed || claiming || !isAuthenticated) return;
    setClaiming(true);
    setClaimError(null);
    try {
      await claimArticle.mutateAsync({ articleId: article.id });
      setClaimed(true);
      setShowSuccessModal(true);
      createConfetti();
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim coins');
      setTimeout(() => setClaimError(null), 4000);
    } finally {
      setClaiming(false);
    }
  }, [article, claimed, claiming, isAuthenticated, claimArticle]);

  const coinReward: number = (article as any)?.coin_reward ?? 50;
  const circumference = 126;
  const strokeOffset = circumference - (readingProgress / 100) * circumference;
  const { data: allArticles } = useArticles();
  const nextArticleSlug = useMemo(() => {
    if (!allArticles || !slug) return null;
    const idx = allArticles.findIndex((a: any) => a.slug === slug);
    if (idx < 0 || idx >= allArticles.length - 1) return null;
    return allArticles[idx + 1].slug;
  }, [allArticles, slug]);
  const { data: streakData } = useStreak();
  const streak = streakData?.streak;
  const currentDay = Math.min(streak?.currentStreak ?? 0, 7);
  const streakPct = Math.min((currentDay / 7) * 100, 100);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <header className="fixed top-0 left-0 w-full z-50 h-20 bg-primary shadow-md flex items-center px-6">
          <div className="h-6 w-32 bg-primary-fixed-dim/20 rounded animate-pulse" />
        </header>
        <main className="pt-20 max-w-4xl mx-auto px-6 py-12 space-y-6">
          <div className="h-10 w-3/4 bg-surface-container rounded-lg animate-pulse" />
          <div className="h-64 w-full bg-surface-container rounded-xl animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-surface-container rounded animate-pulse" style={{ width: `${80 + Math.random() * 20}%` }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">article</span>
          <p className="font-h3 text-h3 text-primary mb-2">Article Not Found</p>
          <Link href="/articles" className="text-secondary underline font-body-md">Browse Articles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">

      {/* ── STICKY HEADER with progress bar ─────────────── */}
      <header
        className="fixed top-0 w-full z-50 shadow-md h-20 flex justify-between items-center px-6 lg:px-[40px]"
        style={{ backdropFilter: 'blur(12px)', background: 'rgba(13, 27, 53, 0.95)' }}
      >
        <div className="flex items-center gap-4">
          <Link href="/articles" className="text-white hover:text-[#ffdea6] transition-colors">
            <span className="material-symbols-outlined text-[32px]">arrow_back</span>
          </Link>
          <div className="flex flex-col">
            <span className="font-h3 text-[20px] font-bold text-white">CMPapp</span>
            <span className="text-[10px] text-[#fdc34d] tracking-widest uppercase font-bold">
              {article.category || 'Article'}
            </span>
          </div>
        </div>

        {/* Desktop progress tracker */}
        <div className="hidden md:flex flex-1 mx-12 flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7784a3]">Reading Progress</span>
            <span className="font-data-md text-data-md text-[#ffdea6]">{Math.round(readingProgress)}%</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${readingProgress}%`,
                background: '#ffdea6',
                boxShadow: '0 0 8px rgba(253,195,77,0.5)',
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 border border-[#7b5800] rounded-lg bg-white/5">
            <span className="material-symbols-outlined text-[#7b5800] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-[#ffdea6]">{coinReward} CMP</span>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] md:hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${readingProgress}%`, background: '#ffdea6' }}
          />
        </div>
      </header>

      {/* ── MAIN ARTICLE CONTENT ────────────────────────── */}
      <main className="pt-20 pb-48 max-w-4xl mx-auto px-6 lg:px-0">

        {/* Hero */}
        <section className="mt-12 mb-16">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-lg font-label-caps text-[10px]">
                {article.category?.toUpperCase() || 'ARTICLE'}
              </span>
              <span className="text-on-surface-variant font-body-sm">• {article.read_time_minutes ?? '5'} Min Read</span>
            </div>
            <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary leading-tight">{article.title}</h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">person</span>
                {article.author?.display_name || 'Admin'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            {article.excerpt && (
              <p className="font-body-lg text-body-lg text-on-surface-variant">{article.excerpt}</p>
            )}
          </div>

          {article.cover_image_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={article.cover_image_url}
                alt={article.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
        </section>

        {/* Article body */}
        <article className="max-w-3xl mx-auto">
          <div>{renderArticleContent(article.content)}</div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reward Claim Section */}
          <div
            className={`mt-20 relative p-8 md:p-12 rounded-2xl overflow-hidden text-center border-2 transition-all duration-700 ${
              unlocked
                ? 'border-[#fdc34d] shadow-[0_0_40px_rgba(253,195,77,0.2)]'
                : 'border-outline-variant'
            }`}
            style={{ background: '#F0EDE8' }}
          >
            {unlocked && (
              <div className="absolute inset-0 coin-shimmer opacity-30 pointer-events-none" />
            )}
            {unlocked && (
              <div className="absolute top-3 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                Completed ✓
              </div>
            )}

            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-secondary-container rounded-full mb-6 ${unlocked ? 'glow-gold' : 'opacity-50'}`}>
                <span
                  className="material-symbols-outlined text-on-secondary-container text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >monetization_on</span>
              </div>

              <h3 className="font-h2 text-h2 text-primary mb-2">Knowledge is Profitable</h3>
              <p className="font-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
                {claimed
                  ? 'Coins have been added to your wallet. Keep learning to earn more!'
                  : unlocked
                    ? "You've completed the article. Claim your reward."
                    : 'Keep reading to unlock your coin reward.'}
              </p>

              {claimError && (
                <div className="mb-4 px-4 py-2 bg-error-container text-error rounded-lg text-sm font-body-sm max-w-sm mx-auto">
                  {claimError}
                </div>
              )}

              <button
                onClick={() => { if (!isAuthenticated) { router.push(`/login?redirect=/articles/${slug}`); return; } handleClaim(); }}
                disabled={!unlocked || !adGateDone || claimed || claiming}
                className={`group relative px-10 py-5 rounded-xl font-h3 text-h3 transition-all duration-300 active:scale-95 shadow-xl overflow-hidden ${
                  claimed
                    ? 'bg-[#2E7D32] text-white cursor-default'
                    : unlocked && adGateDone && !claiming
                      ? 'bg-secondary hover:bg-on-secondary-fixed-variant text-on-primary cursor-pointer'
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60'
                }`}
              >
                <span className="relative z-10">
                  {claimed
                    ? `✓ Claimed ${coinReward} CMP Coins`
                    : claiming
                      ? 'Claiming...'
                      : unlocked && adGateDone
                        ? `Claim Your ${coinReward} CMP Coins`
                        : unlocked && !adGateDone
                          ? 'Ad loading...'
                          : `Read ${Math.round(100 - readingProgress)}% more to unlock`}
                </span>
                {unlocked && adGateDone && !claimed && !claiming && (
                  <>
                    <div className="absolute inset-0 bg-secondary-container scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl opacity-20" />
                    <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all material-symbols-outlined">celebration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </article>
      </main>

      {/* ── FLOATING EARNINGS WIDGET ────────────────────── */}
      <div className="fixed bottom-24 right-6 lg:bottom-12 lg:right-10 z-40 earnings-float">
        <div
          className="bg-primary-container text-on-primary p-4 rounded-xl shadow-xl flex items-center gap-4 cursor-pointer transition-all hover:scale-105"
          style={{ border: `1.5px solid rgba(123,88,0,${unlocked ? '1' : '0.3'})` }}
          onClick={unlocked && adGateDone && !claimed ? handleClaim : undefined}
          title={claimed ? 'Reward claimed' : unlocked && adGateDone ? 'Click to claim' : unlocked ? 'Ad loading...' : 'Keep reading to unlock'}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" fill="transparent" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="24" cy="24" fill="transparent" r="20"
                stroke="#fdc34d"
                strokeDasharray="126"
                strokeDashoffset={strokeOffset}
                strokeWidth="4"
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
            </svg>
            <span
              className={`material-symbols-outlined text-[18px] transition-colors ${unlocked && adGateDone ? 'text-[#2E7D32]' : 'text-[#ffdea6]'}`}
              style={{ fontVariationSettings: unlocked && adGateDone ? "'FILL' 1" : "'FILL' 0" }}
            >
              {claimed ? 'check_circle' : unlocked && adGateDone ? 'lock_open' : unlocked && !adGateDone ? 'hourglass_top' : 'lock'}
            </span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] text-on-primary-container uppercase tracking-wider">
              {claimed ? 'Earned' : 'Reward'}
            </div>
            <div className="font-data-lg text-[#ffdea6] flex items-center gap-1">
              {coinReward} <span className="text-sm font-label-caps">CMP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── AD-GATE OVERLAY ─────────────────────────────── */}
      {showAdGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0" style={{ background: 'rgba(13,27,53,0.85)', backdropFilter: 'blur(20px)' }} />
          <div className="relative bg-[#0D1B35] border border-[#fdc34d]/20 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#fdc34d] text-2xl">ads_click</span>
              <span className="text-[#fdc34d] font-bold uppercase text-sm tracking-widest">Ad Supported Content</span>
            </div>

            {adGateDone ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2E7D32]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#2E7D32]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Content Unlocked!</h3>
                <p className="text-white/60 text-sm mb-8">Your reward is ready. Click below to claim your coins.</p>
                <button
                  onClick={() => setShowAdGate(false)}
                  className="w-full bg-[#fdc34d] text-[#0D1B35] py-4 rounded-xl font-bold text-lg hover:bg-[#e6b138] transition-colors active:scale-[0.98]"
                >
                  Continue to Claim
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#fdc34d]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#fdc34d]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="48" cy="48" r="42" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <circle
                      cx="48" cy="48" r="42" fill="transparent"
                      stroke="#fdc34d" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * (5 - adTimer) / 5)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#fdc34d]">{adTimer}</span>
                </div>
                <p className="text-white/60 text-sm mb-6">Please wait while we prepare your reward...</p>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fdc34d]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#fdc34d] text-lg">spa</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white/80 text-sm font-semibold">Supported by CMP Community</p>
                      <p className="text-white/40 text-xs">Empowering creative minds</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-[#fdc34d]">
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Unlocking in {adTimer}s...</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ───────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0" style={{ background: 'rgba(13,27,53,0.85)', backdropFilter: 'blur(12px)' }} />
          <div className="relative bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #B8860B, #FDC34D)' }}>
              <span className="text-white material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </div>
            <h2 className="font-h1 text-h2 text-primary mb-2">{coinReward} CMP Coins Added!</h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              Coins credited to your creative wallet. Keep learning to earn more!
            </p>
            <div className="bg-secondary-container/20 rounded-xl p-5 mb-8 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Streak Progress</span>
                <span className="font-data-md text-data-md text-secondary">Day {currentDay}/7</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(184,134,11,0.15)' }}>
                <div className="h-full rounded-full" style={{ width: `${streakPct}%`, background: 'linear-gradient(90deg, #B8860B, #FDC34D)' }} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">Level up your creative journey</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(nextArticleSlug ? `/articles/${nextArticleSlug}` : '/articles')}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-h3 text-h3 hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                Next Article
              </button>
              <button
                onClick={() => router.push('/tasks')}
                className="w-full border-2 border-secondary text-secondary py-4 rounded-xl font-h3 text-h3 hover:bg-secondary/5 transition-colors active:scale-[0.98]"
              >
                Back to Earn Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```
---


### File: apps/web/components/tasks/AdGateModal.tsx

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface AdGateModalProps {
  duration?: number; // seconds
  coinReward: number;
  onComplete: () => void;
}

export default function AdGateModal({ duration = 15, coinReward, onComplete }: AdGateModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canSkip, setCanSkip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    if (timeLeft <= 0) {
      setCanSkip(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, dismissed]);

  const handleComplete = useCallback(() => {
    setDismissed(true);
    onComplete();
  }, [onComplete]);

  // SVG circle: circumference = 2*pi*16 ≈ 100.53 (approximated to 100 in design)
  const circumference = 100;
  const progress = ((duration - timeLeft) / duration) * circumference;
  const strokeDashoffset = circumference - progress;

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13, 27, 53, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      {/* Blurred content hint behind modal handled by parent */}
      <div className="bg-surface-container-lowest w-full max-w-[600px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="px-8 pt-8 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="font-h3 text-primary tracking-tighter">CMPapp</span>
            <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Premium</span>
          </div>

          {/* SVG Countdown Timer */}
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
              <circle className="stroke-surface-container-high" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
              <circle
                cx="18" cy="18" fill="none" r="16"
                stroke="#7b5800"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="3"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="font-data-md text-data-md text-primary text-sm font-bold relative z-10">
              {timeLeft > 0 ? timeLeft : '✓'}
            </span>
          </div>
        </div>

        {/* Ad Placeholder */}
        <div className="mx-6 mb-6 rounded-xl overflow-hidden bg-surface-container-high flex flex-col items-center justify-center min-h-[200px] border border-outline-variant/40 relative">
          <div className="absolute top-2 right-3 font-label-caps text-[9px] text-on-surface-variant/50 uppercase tracking-widest">Advertisement</div>
          <span className="material-symbols-outlined text-5xl text-secondary-container mb-3">campaign</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant text-center px-4">
            Support CMP App by watching this short ad
          </p>
          <p className="text-xs text-on-surface-variant/60 mt-1">Your reward will unlock immediately after</p>
        </div>

        {/* Reward Preview */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center glow-gold">
              <span
                className="material-symbols-outlined text-on-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >monetization_on</span>
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Your Reward</p>
              <p className="font-data-lg text-data-lg text-secondary">{coinReward} <span className="text-sm font-label-caps">CMP</span></p>
            </div>
          </div>

          <button
            onClick={canSkip ? handleComplete : undefined}
            disabled={!canSkip}
            className={`px-6 py-3 rounded-xl font-h3 text-[16px] font-bold transition-all duration-300 flex items-center gap-2 ${
              canSkip
                ? 'bg-secondary text-on-primary hover:bg-on-secondary-fixed-variant active:scale-95 shadow-lg cursor-pointer'
                : 'bg-surface-container text-on-surface-variant cursor-not-allowed animate-pulse-gold'
            }`}
          >
            {canSkip ? (
              <>
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                Unlock Task
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Wait {timeLeft}s
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
```
---



## Auth Pages


### File: apps/web/app/page.tsx

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useUserStore();
  const { wallet } = useWallet();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ email } as any);

      if (error) throw error;

      setEmail('');
      alert('Thank you! You\'ve been added to our waitlist.');
    } catch (err) {
      console.error('Error adding to waitlist:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Navigation Shell - Desktop/Tablet Only */}
<nav className="hidden md:flex fixed top-0 w-full z-50 bg-primary backdrop-blur-lg border-b border-white/10 shadow-md h-20 justify-between items-center px-margin-desktop">
  <Link href="/" className="flex items-center gap-3">
    <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
  </Link>
  {isAuthenticated && (
    <div className="flex items-center gap-x-8">
      <Link className="font-body-md text-body-md text-secondary-fixed border-b-2 border-secondary-fixed pb-1" href="/dashboard">
        Dashboard
      </Link>
      <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/tasks">
        Earn
      </Link>
      <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/music">
        Music
      </Link>

      <Link className="font-body-md text-body-md text-white/90 hover:text-secondary-fixed transition-colors" href="/wallet">
        Wallet
      </Link>
    </div>
  )}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <div className="premium-border-gold rounded-full px-4 py-1 flex items-center gap-2 bg-white/10 backdrop-blur-md">
                <span className="material-symbols-outlined text-secondary-fixed text-xl">paid</span>
                <span className="font-data-md text-data-md text-secondary-fixed">
                  {wallet?.balance?.toLocaleString() || 0}
                </span>
              </div>
              <button className="text-white hover:text-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              <Link href="/profile">
                <span className="material-symbols-outlined text-2xl text-white hover:text-secondary-fixed transition-colors cursor-pointer">account_circle</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-white hover:text-secondary-fixed font-medium transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-body-md text-body-md px-6 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)]">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex flex-col justify-center overflow-hidden bg-primary">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 opacity-50">
          <img
            alt="Abstract fluid background"
            className="w-full h-full object-cover mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfcs8Eu4e4-pkMRvNodpKydY50KxK09NPYZ82AnxzqyG4Lj-m7Hm6RT7aReU5oC6E9TwiQsb4zJppJg9fGkFRB6wtdKfisaleLjC6GYSD6SA4Era6QYnHpNE4mo8jLT8c30C2CidhMtkh0L8uHbhvMm4bzgJjZx3x72ufRHzCTPIkG9pXFVvcQ6FgU8rlGa5CoHP6bW_8D_pVNiT44QVTR7k7OQKQ4fgUGQaiTQAiNHk6QBYyl4Jplm-wKX_HeG9bJg4gTBokqErQ"
          />
        </div>

        {/* Hero Image Layer - Between Background and Text (Desktop Only) */}
        <div className="hidden md:block absolute top-0 left-0 w-full h-full z-10 pointer-events-none overflow-visible">
          <img
            alt="Hero visual"
            className="absolute bottom-[0px] left-[550px] w-[900px] h-auto object-contain"
            src="/hero.png"
          />
        </div>

        <div className="relative z-20 w-full px-4 md:px-8 lg:px-16 text-left">
          <div>
            <h1 className="font-h1 text-h1 text-white max-w-4xl mb-6">
              Empower Your Creativity. <br/>
              <span className="text-secondary-fixed">Monetize Your Passion.</span>
            </h1>
          </div>
          <div>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mb-10">
              The first creative economy hub where every stream, task, and referral builds your wealth. Join thousands of creators in the global digital revolution.
            </p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
                <Link
                  href={isAuthenticated ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center gap-3 bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed font-bold font-h3 text-h3 px-8 py-4 rounded-lg transition-all scale-100 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,222,166,0.3)]"
                >
                  Join the Economy
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </Link>
              </div>
          </div>
        </div>


      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-surface px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-h2 text-h2 text-primary mb-4">Multiple Paths to Prosperity</h2>
            <div className="h-1 w-24 bg-secondary-fixed mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-surface-alt/80 backdrop-blur-md p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group shadow-sm">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-secondary-fixed text-4xl">headphones</span>
              </div>
              <h3 className="font-h3 text-h3 mb-4">Stream to Earn</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Earn coins by discovering and listening to emerging African artists. Your ears are assets—get paid for every minute you spend on premium audio.
              </p>
              <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/music">
                Start Listening <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-surface-alt/80 backdrop-blur-md p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group shadow-sm">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-secondary-fixed text-4xl">task_alt</span>
              </div>
              <h3 className="font-h3 text-h3 mb-4">Micro-Task Market</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Complete simple digital tasks for global brands. From survey participation to content tagging, leverage your downtime for steady growth.
              </p>
              <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/tasks">
                Browse Tasks <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-surface-alt/80 backdrop-blur-md p-8 rounded-xl border-b-4 border-secondary hover:border-secondary-fixed transition-all group shadow-sm">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-secondary-fixed text-4xl">groups</span>
              </div>
              <h3 className="font-h3 text-h3 mb-4">Referral Network</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Build your tribe and earn 3-tier passive commissions. Empower your circle to earn and watch your ecosystem rewards scale indefinitely.
              </p>
              <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="/referrals">
                Invite Friends <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Coin Economy */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            alt="Abstract fluid background"
            className="w-full h-full object-cover mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-djhaqbFQ24bTIjgMfdOIK7jXca0r5lqLrYgkl3hiceKMMiflWANi7RTkK27dtByG_Qy8fPkGiT34KLkFKB103_twCy2r2Aam2x5gPiMps1TuiTPv58MoHSEVjWvAZqxf-3lDDw2qUis_0pL93VdQHeuJcqg6LRvfWFUGSiV1zy7WU2ruCxmVbmcyS5kOtMZx1FJebjA352LxQuf5hgjbkLXtXC9cP95lsL--TEfqNFyv92ZdW5Bz1scNkI256Hv1CK3t5ZAJFRg"
          />
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-white">
            <h2 className="font-h2 text-h2 mb-6">The Coin Economy</h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-8">
              CMP Coins are the heart of our creative hub. We've built a stable, transparent conversion model that bridges the gap between digital effort and real-world value.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 glass-dark p-4 rounded-xl w-max">
                <div className="w-12 h-12 rounded-full border border-secondary-fixed/50 flex items-center justify-center bg-primary-container/50">
                  <span className="font-data-lg text-data-lg text-secondary-fixed">1</span>
                </div>
                <div>
                  <div className="font-h3 text-h3 text-white">100 Coins : 1 USD</div>
                  <div className="font-body-sm text-body-sm text-white/70">Guaranteed conversion rate for liquidity.</div>
                </div>
              </div>
              <div className="flex items-center gap-4 glass-dark p-4 rounded-xl w-max">
                <div className="w-12 h-12 rounded-full border border-secondary-fixed/50 flex items-center justify-center bg-primary-container/50">
                  <span className="font-data-lg text-data-lg text-secondary-fixed">2</span>
                </div>
                <div>
                  <div className="font-h3 text-h3 text-white">Global Utilities</div>
                  <div className="font-body-sm text-body-sm text-white/70">Pay subscriptions, digital goods, and services directly with coins.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md">
            <div className="aspect-square glass-dark rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="mb-6 relative">
                <div className="w-32 h-32 flex items-center justify-center animate-pulse shadow-lg">
                  <img src="/coin.png" alt="CMP Coin" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full font-data-md text-data-md shadow-xl">
                  Live Value
                </div>
              </div>
              <div className="font-data-lg text-data-lg text-white mb-2">Current Balance Value</div>
              <div className="font-h1 text-h1 text-secondary-fixed">$ 12,500.00</div>
              <div className="font-body-sm text-body-sm text-white/70 mt-4">1,250,000 CMP COINS</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            alt="Abstract fluid background"
            className="w-full h-full object-cover mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwoEjE5iweugLps_wKqXR1uLh0kjNtpWVTWQJhXL2YbXWnNu_WRCTSnrffQlL5yLdUykpacu6IJUrnjcC5lr2vCeseIZCA-5xMCyuQqjcAEre04gx7us8jK8aZp2so2Oq3tR3imxoqoMZvAUQLnsJoxXbl7E13hGhdjgMid4eNHxvzZs_jhgXgOkNG_P38FpsGx3576-mArpwqM-_XB-R7PzEuuxV8xiaFWHqtMIg47dwpwG5jm_eKLlw-57ldpeSrnDxumFoMaEQ"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 glass-dark p-12 rounded-3xl border border-white/20">
          <h2 className="font-h1 text-h1 text-white mb-6">Ready to Build Your Wealth?</h2>
          <p className="font-body-lg text-body-lg text-white/90 mb-12">
            Start Your Journey with <span className="text-secondary-fixed font-bold">500 Bonus Coins</span>. It takes less than 60 seconds to join the hub and begin monetizing your tasks.
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-fixed backdrop-blur-sm"
              required
            />
            <button
              type="submit"
              className="bg-secondary-fixed hover:bg-secondary text-primary font-bold font-body-md text-body-md px-16 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(255,222,166,0.3)] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto whitespace-nowrap"
            >
              {isSubmitting ? 'Submitting...' : 'Get Started'}
            </button>
          </form>
          <div className="flex items-center justify-center gap-8 text-white/80 font-label-caps text-label-caps flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary-fixed" />
              No Fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary-fixed" />
              Instant Withdraw
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary-fixed" />
              Global Community
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 px-margin-mobile md:px-margin-desktop border-t border-white/10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-white/70">
              The creative economy hub empowering the global digital generation through music, tasks, and community.
            </p>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">PLATFORM</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">How it Works</Link></li>

              <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Tasks</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/wallet">Store</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">COMMUNITY</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Discord Hub</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/referrals">Referral Program</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Creator Perks</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/contests">Leaderboards</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">LEGAL</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-white/70 gap-4">
          <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
          <div className="flex gap-6">
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
```
---


### File: apps/web/app/login/page.tsx

```tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect already-authenticated users away from the login page
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const returnTo = searchParams?.get('returnTo');
        router.replace(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      if (data.user) {
        try {
          const { user: userProfile, accessToken, refreshToken } = await api.login({ email, password });
          api.setToken(accessToken);
          if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', refreshToken);
          }
        } catch {
          // API server may be down — Supabase auth is the source of truth
        }

        await login({ email, password });

        // Redirect to the page the user was trying to access, or dashboard
        const returnTo = searchParams?.get('returnTo');
        router.push(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Welcome Back</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Secure access to your creative enterprise.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">
            Email Address
          </label>
          <div className="relative rounded-lg transition-shadow duration-200">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
              <Mail className="w-5 h-5" />
            </span>
            <input
              className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
              id="email"
              name="email"
              placeholder="name@company.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="password">
            Password
          </label>
          <div className="relative rounded-lg transition-shadow duration-200">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
              <Lock className="w-5 h-5" />
            </span>
            <input
              className="block w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface transition-colors"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              className="h-4 w-4 rounded border-outline-variant bg-surface-alt text-primary-container focus:ring-2 focus:ring-primary-container"
              id="remember-me"
              name="remember-me"
              type="checkbox"
            />
            <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
              Remember Me
            </label>
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="font-body-sm text-body-sm text-[#B8860B] hover:text-[#8B6914] font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-primary-container hover:underline transition-colors">
          Create an Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B8860B]"></div>
          <p className="mt-4 text-on-surface-variant text-sm font-body-sm">Loading...</p>
        </div>
      }>
        <LoginPageContent />
      </Suspense>
    </AuthLayout>
  );
}
```
---


### File: apps/web/app/register/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, User, Smartphone, ArrowRight, Coins } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  const router = useRouter();
  const [referredBy, setReferredBy] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referralCode: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferredBy(ref);
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, []);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('You must accept the terms of service');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('register-user', {
        body: {
          email: formData.email,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          referralCode: formData.referralCode || undefined,
        },
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to register');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Registration failed');
      }

      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      const msg = err?.message || '';
      if (msg.includes('duplicate key') && msg.includes('users_email_key')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please check your inbox and confirm your email address before signing in.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {/* Incentive Badge */}
        <div className="absolute -top-4 -right-4 md:-right-6 bg-surface-container-lowest border-[1.5px] border-[#B8860B] rounded-full py-2 px-4 shadow-lg flex items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform cursor-default z-20">
          <Coins className="text-[#B8860B] w-5 h-5" />
          <span className="font-data-md text-data-md text-[#B8860B]">500 Bonus Coins</span>
        </div>

        <div className="space-y-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Create Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Start building your secure financial future.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="firstName">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                    id="firstName"
                    name="firstName"
                    placeholder="Alex"
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="lastName">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                    id="lastName"
                    name="lastName"
                    placeholder="Carter"
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                  id="email"
                  name="email"
                  placeholder="alex@creativehub.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                  id="phone"
                  name="phone"
                  placeholder="+2348012345678"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase" htmlFor="referralCode">
                Referral Code {referredBy && <span className="text-[#B8860B] font-semibold">(from invite link)</span>}
              </label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                  id="referralCode"
                  name="referralCode"
                  placeholder="Enter code"
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => {
                    if (!referredBy) setFormData({ ...formData, referralCode: e.target.value });
                  }}
                  disabled={isLoading}
                  readOnly={!!referredBy}
                />
              </div>
              {referredBy && (
                <p className="font-body-sm text-body-sm text-[#B8860B] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Invited by a friend — code locked. Sign up to earn them a reward!
                </p>
              )}
            </div>

            {/* TOS Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <input
                  className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container focus:ring-2 bg-surface-alt"
                  id="terms"
                  name="terms"
                  required
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                />
              </div>
              <label className="font-body-sm text-body-sm text-on-surface-variant leading-tight" htmlFor="terms">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-container hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-container hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!acceptTerms || isLoading}
              className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Join the Economy
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-container font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
```
---


### File: apps/web/app/forgot-password/page.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('rate_limit') || msg.includes('429') || msg.includes('too many')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else if (msg.includes('Email not found') || msg.includes('user_not_found')) {
        // Don't reveal whether the email exists (security best practice)
        setSuccess(true);
      } else {
        setError(msg || 'Failed to send recovery email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {success ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/30">
              <Mail className="w-10 h-10 text-success-verified" />
            </div>
            <h2 className="font-h3 text-h3 text-primary-container mb-4">Check Your Email</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              We've sent a password reset link to <span className="font-semibold text-[#B8860B]">{email}</span>
            </p>
            <Link href="/login">
              <button className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors duration-200">
                Back to Login
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                <Lock className="text-[#B8860B] w-8 h-8" />
              </div>
              <h1 className="font-h2 text-h1-mobile md:text-h2 text-primary-container mb-2">Recover Access</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your email address to receive a secure recovery link.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email">
                  Email Address
                </label>
                <div className="relative rounded-lg transition-shadow duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-outline" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? 'Sending...' : 'Send Recovery Link'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors group"
              >
                <ArrowRight className="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </>
        )}
        
        {/* Support Note */}
        <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
          Need further assistance?{' '}
          <Link href="/support" className="text-primary-container hover:underline font-medium">
            Contact Support
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
```
---


### File: apps/web/app/reset-password/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

type PageState = 'checking' | 'invalid' | 'ready';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('checking');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate recovery session on mount
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (!cancelled) setPageState('ready');
      }
    });

    const init = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!sessionError && data.session?.user) {
        setPageState('ready');
        return;
      }

      // No session yet — give the hash parser 3 seconds
      timeoutId = setTimeout(() => {
        if (!cancelled) setPageState('invalid');
      }, 3000);
    };

    init();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      router.push('/reset-password-success');
    } catch (err: any) {
      const msg = err?.message || '';
      setError(
        msg.includes('session') || msg.includes('not authenticated')
          ? 'Your recovery link has expired. Please request a new one.'
          : msg || 'Failed to update password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {pageState === 'checking' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B8860B] mb-6" />
            <p className="font-body-md text-body-md text-on-surface-variant">Verifying your recovery link...</p>
          </div>
        )}

        {pageState === 'invalid' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6 border border-error/30">
              <AlertTriangle className="text-error w-8 h-8" />
            </div>
            <h1 className="font-h3 text-h3 text-primary-container mb-3">Invalid or Expired Link</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/forgot-password">
              <button className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors px-8">
                Request New Link
              </button>
            </Link>
          </div>
        )}

        {pageState === 'ready' && (
          <>
            {/* Icon Header */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border-2 border-[#B8860B]/30">
                <Lock className="text-[#B8860B] w-8 h-8" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center mb-8">
              <h1 className="font-h2 text-h2 text-primary-container mb-2">Set New Password</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Please enter your new secure password.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm">
                  {error}
                </div>
              )}

              {/* New Password Input */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative rounded-lg transition-shadow duration-200">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="new-password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <div className="relative rounded-lg transition-shadow duration-200">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="confirm-password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
```
---


### File: apps/web/app/reset-password-success/page.tsx

```tsx
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
```
---


### File: apps/web/app/verify/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function VerifyPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'loading' | 'code' | 'password'>('loading');
  const [email, setEmail] = useState('');
  // verificationToken is preserved from the URL link so the password step can re-use it
  const [verificationToken, setVerificationToken] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const urlEmail = params.get('email');

    if (urlEmail) setEmail(decodeURIComponent(urlEmail));

    if (token) {
      // Token from email link — verify it immediately; password is then collected in mode='password'
      setVerificationToken(token);
      verifyWithToken(token);
    } else {
      setMode('code');
    }
  }, []);

  /** Step 1a: Verify via email-link token. Returns requiresPassword — we then collect the password. */
  const verifyWithToken = async (token: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: { token },
      });

      if (funcError) throw new Error(funcError.message || 'Verification failed');
      if (data?.error) throw new Error(data.error);

      if (data?.requiresPassword) {
        setEmail(data.email || '');
        setMode('password');
      } else if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try entering the code manually.');
      setMode('code');
    } finally {
      setIsLoading(false);
    }
  };

  /** Step 1b: Verify via 6-digit code entered manually. Returns requiresPassword. */
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    if (!email) {
      setError('Email address is required. Please go back to registration.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: { code, email },
      });

      if (funcError) throw new Error(funcError.message || 'Verification failed');
      if (data?.error) throw new Error(data.error);

      if (data?.requiresPassword) {
        setEmail(data.email || email);
        setMode('password');
      } else if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.includes('Invalid code') ? 'The verification code is invalid or has expired. Please try registering again.' : msg || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Set password and create the account.
   *
   * CRITICAL: The edge function needs to look up the pending_registrations row.
   * - If the user came via EMAIL LINK → we have `verificationToken`, send { token, email, password }
   * - If the user came via CODE ENTRY → we have `code` + `email`, send { code, email, password }
   *
   * Without this, token-flow users send { code: "", email, password } which fails the
   * CODE_RE test in the edge function and returns "Token or code+email required".
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setIsLoading(true);

    try {
      // Build the lookup payload — prefer token if available (came via email link)
      const lookupPayload = verificationToken
        ? { token: verificationToken, email, password }
        : { code, email, password };

      const { data, error: funcError } = await supabase.functions.invoke('verify-registration', {
        body: lookupPayload,
      });

      if (funcError) throw new Error(funcError.message || 'Failed to create account');
      if (data?.error) {
        const errMsg = data.error;
        if (errMsg.includes('duplicate key') || errMsg.includes('already exists')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        throw new Error(errMsg);
      }

      if (data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        throw new Error('Account creation failed. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      setError(
        msg.includes('duplicate key') || msg.includes('already exists')
          ? 'An account with this email already exists. Please sign in instead.'
          : msg || 'Failed to create account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
          <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/20">
            <CheckCircle className="w-10 h-10 text-success-verified" />
          </div>
          <h2 className="font-h3 text-h3 text-primary-container mb-4">Account Created!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Your account has been successfully created. Redirecting to login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        {mode === 'loading' ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-[#B8860B] mx-auto mb-4" />
            <p className="text-on-surface-variant">Verifying your email...</p>
          </div>
        ) : mode === 'code' ? (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                <Mail className="text-[#B8860B] w-8 h-8" />
              </div>
              <h2 className="font-h3 text-h3 text-primary-container mb-2">Verify Your Email</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter the 6-digit code sent to{' '}
                <span className="text-[#B8860B] font-semibold">{email || 'your email'}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field — shown when email is missing from URL params */}
            {!email && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="email-field">
                  Email Address
                </label>
                <div className="relative rounded-lg">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                    id="email-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="code">
                Verification Code
              </label>
              <div className="relative rounded-lg transition-shadow duration-200">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors text-center font-data-lg text-data-lg tracking-widest"
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <div className="text-center mt-4">
              <Link href="/register" className="text-on-surface-variant hover:text-primary-container text-sm transition-colors">
                ← Back to registration
              </Link>
            </div>
          </form>
        ) : (
          /* mode === 'password' */
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
                <Lock className="text-[#B8860B] w-8 h-8" />
              </div>
              <h2 className="font-h3 text-h3 text-primary-container mb-2">Create Password</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Almost done! Create a secure password for{' '}
                <span className="text-[#B8860B] font-semibold">{email}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="password">
                Password
              </label>
              <div className="relative rounded-lg transition-shadow duration-200">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">Must be at least 8 characters long.</p>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative rounded-lg transition-shadow duration-200">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors"
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
```
---


### File: apps/web/app/verify-email/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOtp = params.get('otp');
    const urlEmail = params.get('email');
    if (urlOtp) setOtp(urlOtp);
    if (urlEmail) setEmail(urlEmail);
    else if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      if (!email) {
        throw new Error('Email not found. Please login again.');
      }

      await api.verifyEmail(otp, email);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsResending(true);

    try {
      if (!email) {
        throw new Error('Email not found. Please login again.');
      }

      await api.resendVerification(email);
      setError('VERIFICATION_SENT');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
          <div className="w-20 h-20 bg-success-verified/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-success-verified/20">
            <CheckCircle className="w-10 h-10 text-success-verified" />
          </div>
          <h2 className="font-h3 text-h3 text-primary-container mb-4">Email Verified!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Your email has been successfully verified. Redirecting to dashboard...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#B8860B]/30 mb-4">
            <Mail className="text-[#B8860B] w-8 h-8" />
          </div>
          <h2 className="font-h3 text-h3 text-primary-container mb-2">Verify Your Email</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && error !== 'VERIFICATION_SENT' && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {error === 'VERIFICATION_SENT' && (
            <div className="p-3 rounded-lg bg-success-verified/10 border border-success-verified/30 text-success-verified text-sm font-body-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Verification email sent! Please check your inbox.</span>
            </div>
          )}

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase" htmlFor="otp">
              Verification Code
            </label>
            <div className="relative rounded-lg transition-shadow duration-200">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input
                className="block w-full pl-10 pr-3 py-3 bg-surface-alt border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-colors text-center font-data-lg text-data-lg tracking-widest"
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full h-12 bg-[#B8860B] hover:bg-[#8B6914] text-primary-container font-bold font-body-md text-body-md rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full text-on-surface-variant hover:text-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              <>
                <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant/30">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-primary-container hover:underline font-body-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
```
---



## Dashboard & Settings


### File: apps/web/app/(app)/dashboard/page.tsx

```tsx
'use client';

import Link from 'next/link';
import { useFeaturedSongs, useTasks, useStreak, useBuyStreakFreeze } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { data: songs = [], isLoading: songsLoading } = useFeaturedSongs();
  const { data: tasksResp, isLoading: tasksLoading } = useTasks();
  const tasks = tasksResp?.tasks ?? [];
  const { wallet, loading: walletLoading } = useWallet();
  const { user } = useUserStore();
  
  const { data: streakResp, isLoading: streakLoading } = useStreak();
  const currentStreak = streakResp?.streak?.currentStreak ?? 0;
  const coinBalance = wallet?.balance ?? 0;

  const buyFreeze = useBuyStreakFreeze();
  const longestStreak = streakResp?.streak?.longestStreak ?? 0;
  const freezesOwned = streakResp?.streak?.freezesOwned ?? 0;
  const tasksCompletedToday = streakResp?.streak?.tasksCompletedToday ?? 0;

  const weekDays = useMemo(() => {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const jsDay = today.getDay();
    const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;
    const history = streakResp?.streak?.dailyHistory ?? [];
    return dayLabels.map((label, index) => {
      const isMilestoneDay = index === 6;
      const isToday = index === mondayBasedToday;
      const isCompleted = history[index]?.completed ?? false;
      return {
        day: label,
        completed: isCompleted && !isToday,
        current: isToday,
        milestone: isMilestoneDay && !isCompleted && !isToday,
      };
    });
  }, [streakResp?.streak?.dailyHistory]);

  const daysCompletedThisWeek = weekDays.filter(d => d.completed).length;
  const progressPercent = Math.round((daysCompletedThisWeek / 7) * 100);
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 60 ? 60 : null;
  const daysToMilestone = nextMilestone ? nextMilestone - currentStreak : 0;

  const [firstName, setFirstName] = useState(
    user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const authUser = data.user;
      if (authUser) {
        const meta = authUser.user_metadata;
        const name = meta?.full_name || meta?.displayName || authUser.email?.split('@')[0] || 'User';
        if (name && name !== 'User') {
          setFirstName(name.split(' ')[0]);
        }
      }
    });
  }, [user]);

  return (
    <div className="flex-1 w-full pb-24 md:pb-0 min-h-screen relative z-0">
      {/* Desktop Header Area (Hero background) */}
      <div className="hidden lg:block h-64 bg-primary-container w-full relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-10 z-10">
          <h2 className="font-h1 text-h1 text-on-primary mb-2">Welcome Back, {firstName}.</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container">Let's grow your creative enterprise today.</p>
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop py-8 lg:-mt-16 relative z-20 max-w-container-max mx-auto space-y-12">
        {/* Mobile Welcome */}
        <div className="lg:hidden mb-6 mt-4">
          <h2 className="font-h1-mobile text-h1-mobile text-on-surface">Hi, {firstName}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Here is your daily summary.</p>
        </div>

        {/* Power Row (Quick Stats) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/5 rounded-full blur-xl group-hover:bg-[#B8860B]/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Total Balance</span>
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            {walletLoading ? (
               <div className="h-10 w-32 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{coinBalance.toLocaleString()}</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Coins</span>
              </div>
            )}
            <div className="mt-4 flex items-center gap-1 text-success-verified font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>Keep earning today</span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Current Streak</span>
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            {streakLoading ? (
              <div className="h-10 w-24 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{currentStreak}</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{currentStreak === 1 ? 'Day' : 'Days'}</span>
              </div>
            )}
            <div className="mt-4 w-full bg-surface-variant rounded-full h-2">
              <div className="bg-[#B8860B] h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}></div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-xs">
              {7 - (currentStreak % 7)} days to next milestone
            </p>
          </div>

          {/* Tasks Remaining */}
          <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden group hover:border-[#B8860B] border border-transparent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Tasks Remaining</span>
              <span className="material-symbols-outlined text-on-primary-fixed-variant">checklist</span>
            </div>
            {tasksLoading ? (
              <div className="h-10 w-24 bg-surface-dim animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="font-data-lg text-data-lg text-h2 text-on-background">{tasks.length}</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tasks</span>
              </div>
            )}
            <Link className="mt-4 inline-flex items-center gap-1 font-body-sm text-body-sm text-primary hover:text-[#B8860B] font-medium transition-colors" href="/tasks">
              Complete now <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Daily Streak & Rewards */}
        <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <h3 className="font-h3 text-h3 text-on-background">Daily Streak & Rewards</h3>
            </div>
            <Link href="/tasks/streak" className="text-sm text-secondary hover:underline font-body-md">View Details</Link>
          </div>

          {streakLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-surface-dim rounded-lg" />
              <div className="h-6 bg-surface-dim rounded-lg w-1/3" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-4 py-2 bg-[#B8860B]/10 rounded-lg border border-[#B8860B]/20">
                    <span className="material-symbols-outlined text-[#B8860B] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    <span>
                      <span className="font-h2 text-h2 text-[#B8860B]">{currentStreak}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">{currentStreak === 1 ? 'Day' : 'Days'}</span>
                    </span>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    <span className="font-body-sm">Best: {longestStreak} days</span>
                    {freezesOwned > 0 && <span className="ml-3">❄️ {freezesOwned} freeze{freezesOwned > 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{tasksCompletedToday} today</span>
              </div>

              <div className="flex justify-between items-center relative mb-6">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-high -z-10 -translate-y-1/2 rounded-full" />
                <div className="absolute top-1/2 left-0 h-1 bg-[#B8860B] -z-10 -translate-y-1/2 rounded-full" style={{ width: `${progressPercent}%` }} />
                {weekDays.map((day) => (
                  <div key={day.day} className="flex flex-col items-center gap-2 z-10">
                    {day.completed ? (
                      <div className="w-10 h-10 rounded-full bg-[#B8860B] flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    ) : day.current ? (
                      <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-[#B8860B] flex items-center justify-center shadow-md relative">
                        <span className="material-symbols-outlined text-[#B8860B] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-alert rounded-full border border-surface-container-lowest" />
                      </div>
                    ) : day.milestone ? (
                      <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center border-dashed border-[#B8860B]/50">
                        <img src="/coin.png" alt="Coin" className="w-4 h-4 object-contain opacity-50" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-surface-container-lowest">
                        <span className="font-data-md text-data-md text-on-surface-variant text-xs">50</span>
                      </div>
                    )}
                    <span className={`font-label-caps text-label-caps ${day.current ? 'text-on-surface font-bold' : day.completed ? 'text-on-surface-variant' : 'text-outline'}`}>{day.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
                <div className="text-sm text-on-surface-variant">
                  {nextMilestone ? (
                    <span><strong className="text-on-surface">{daysToMilestone} day{daysToMilestone > 1 ? 's' : ''}</strong> to {nextMilestone}-day milestone 🪙</span>
                  ) : (
                    <span className="text-success-verified">All milestones completed! 🎉</span>
                  )}
                </div>
                <button
                  onClick={() => { try { buyFreeze.mutateAsync(); } catch {} }}
                  disabled={buyFreeze.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">ac_unit</span>
                  Buy Freeze 🪙 500
                </button>
              </div>
            </>
          )}
        </section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Featured & Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Top Artists of the Week */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-h3 text-on-background">Top Artists of the Week</h3>
                <Link className="font-body-sm text-body-sm text-[#B8860B] hover:underline" href="/music">View All</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {songsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[160px] bg-surface-container-lowest rounded-xl p-4 flex flex-col items-center gap-3 border border-outline-variant/30">
                      <div className="w-20 h-20 rounded-full bg-surface-dim animate-pulse" />
                      <div className="w-24 h-4 bg-surface-dim animate-pulse rounded" />
                    </div>
                  ))
                ) : songs.length === 0 ? (
                  <div className="w-full text-center py-8 text-on-surface-variant">No top artists yet.</div>
                ) : (
                  songs.slice(0, 4).map((song: any, i: number) => (
                    <Link href={`/music/artist/${song.artist?.slug || song.artist?.id || i}`} key={song.id || i} className="min-w-[160px] bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-xl p-4 flex flex-col items-center gap-3 snap-start hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-outline-variant">
                      <div className="w-20 h-20 rounded-full border-2 border-surface-container-highest overflow-hidden flex items-center justify-center bg-surface-dim">
                        {song.artist?.avatar_url ? (
                           <img src={song.artist.avatar_url} alt={song.artist.stage_name} className="w-full h-full object-cover" />
                        ) : (
                           <span className="material-symbols-outlined text-[32px] text-on-surface-variant">music_note</span>
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="font-body-md text-body-md font-semibold text-on-background">{song.artist?.stage_name || 'Unknown Artist'}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">{song.genre || 'Music'}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Daily Tasks */}
          <div className="lg:col-span-1">
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 sticky top-24 shadow-[0_4px_20px_rgba(0,0,0,0.02)]" id="daily-tasks">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                <h3 className="font-h3 text-h3 text-on-background text-lg">Daily Quick Tasks</h3>
              </div>
              <div className="space-y-4">
                {tasksLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-surface-dim animate-pulse rounded-lg" />
                  ))
                ) : tasks.length === 0 ? (
                  <div className="text-center py-4 text-on-surface-variant">
                    <p>No tasks available right now.</p>
                  </div>
                ) : (
                  tasks.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-alt transition-colors group border border-transparent hover:border-outline-variant/30">
<div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">
                              {task.type === 'WATCH_VIDEO' ? 'play_circle' : task.type === 'COMPLETE_SURVEY' ? 'poll' : task.type === 'SHARE_SOCIAL' ? 'share' : 'quickreply'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-medium text-on-background line-clamp-1">{task.title}</h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">+{task.coinReward} Coins</p>
                          </div>
                        </div>
                      <Link href="/tasks" className="bg-[#B8860B] hover:bg-[#8B6914] text-primary font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors shadow-sm ml-2 shrink-0">
                        Start
                      </Link>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Completing all tasks grants a bonus multiplier.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
```
---


### File: apps/web/app/(app)/settings/page.tsx

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import { supabase } from '@/lib/supabase';
import { uploadFile, STORAGE_BUCKETS } from '@/lib/storage';
import { useRouter } from 'next/navigation';

type SettingsTab = 'profile' | 'security' | 'notifications';

const SETTINGS_DEFAULTS = {
  transactionAlerts: true,
  marketingPromos: false,
};

function parseSettings(settings: any) {
  if (!settings || typeof settings !== 'object') return SETTINGS_DEFAULTS;
  return {
    transactionAlerts: typeof settings.transactionAlerts === 'boolean' ? settings.transactionAlerts : SETTINGS_DEFAULTS.transactionAlerts,
    marketingPromos: typeof settings.marketingPromos === 'boolean' ? settings.marketingPromos : SETTINGS_DEFAULTS.marketingPromos,
  };
}

export default function SettingsPage() {
  const { user, logout } = useUserStore();
  const { wallet } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Profile fields
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('NG');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState<'success' | 'error'>('success');

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState<'success' | 'error'>('success');

  // Notification prefs
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [marketingPromos, setMarketingPromos] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showMessage = (setter: (m: string) => void, msg: string, duration = 3000) => {
    setter(msg);
    setTimeout(() => setter(''), duration);
  };

  // Load profile from Supabase
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || cancelled) { setIsLoadingProfile(false); return; }

      const { data: profile } = await supabase
        .from('users' as any)
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile && !cancelled) {
        const p = profile as Record<string, any>;
        setFullName(p.full_name || '');
        setUsername(p.username || '');
        setBio(p.bio || '');
        setCountry(p.country || 'NG');
        setAvatarUrl(p.avatar_url || null);

        const s = parseSettings(p.settings);
        setTransactionAlerts(s.transactionAlerts ?? true);
        setMarketingPromos(s.marketingPromos ?? false);
      }
      setIsLoadingProfile(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const saveSettingsField = async (patch: Record<string, any>) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    // Merge with existing settings
    const { data: existing } = await supabase
      .from('users' as any)
      .select('settings')
      .eq('id', authUser.id)
      .single();

    const current = parseSettings((existing as any)?.settings);
    const merged = { ...current, ...patch };

    const { error } = await supabase
      .from('users' as any)
      .update({ settings: merged } as any)
      .eq('id', authUser.id);

    if (error) throw error;
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setSaveMessageType('error');
      setSaveMessage('Image must be under 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setSaveMessageType('error');
      setSaveMessage('Only image files are allowed');
      return;
    }

    setIsUploadingAvatar(true);
    setSaveMessage('');

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const result = await uploadFile(STORAGE_BUCKETS.PROFILE_PHOTOS, file, authUser.id);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }

      const { error: updateError } = await supabase
        .from('users' as any)
        .update({ avatar_url: result.url } as any)
        .eq('id', authUser.id);

      if (updateError) throw updateError;

      setAvatarUrl(result.url);
      useUserStore.getState().updateAvatar(result.url);
      setSaveMessageType('success');
      setSaveMessage('Profile picture updated');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      setSaveMessageType('error');
      setSaveMessage(err?.message || 'Failed to upload image');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setSaveMessageType('error');
      setSaveMessage('Full name is required');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // Check username uniqueness if changed
      if (username.trim()) {
        const { data: existing } = await supabase
          .from('users' as any)
          .select('id')
          .eq('username', username.trim())
          .neq('id', authUser.id)
          .maybeSingle();

        if (existing) {
          throw new Error('Username is already taken. Please choose another one.');
        }
      }

      const { error } = await supabase
        .from('users' as any)
        .update({
          full_name: fullName.trim(),
          username: username.trim() || null,
          bio: bio.trim() || null,
          country,
        } as any)
        .eq('id', authUser.id);

      if (error) throw error;
      setSaveMessageType('success');
      setSaveMessage('Profile updated successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      const msg = err?.message || '';
      setSaveMessageType('error');
      setSaveMessage(
        msg.includes('unique') || msg.includes('already taken')
          ? 'Username is already taken. Please choose another one.'
          : msg || 'Failed to save changes'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      setPasswordMessageType('error');
      setPasswordMessage('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessageType('error');
      setPasswordMessage('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessageType('error');
      setPasswordMessage('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.email) throw new Error('Not authenticated');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('Current password is incorrect');

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordMessageType('success');
      setPasswordMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err: any) {
      const msg = err?.message || '';
      setPasswordMessageType('error');
      setPasswordMessage(
        msg.includes('incorrect') || msg.includes('Invalid') ? 'Current password is incorrect' :
        msg.includes('same') ? 'New password must be different from your current password' :
        msg.includes('session') ? 'Session expired. Please sign out and sign in again.' :
        msg || 'Failed to update password'
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Save notification prefs
  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    setNotificationMessage('');
    try {
      await saveSettingsField({ transactionAlerts, marketingPromos });
      showMessage(setNotificationMessage, 'Notification preferences saved');
    } catch (err: any) {
      showMessage(setNotificationMessage, err?.message || 'Failed to save');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account and all associated data? This cannot be undone.'
    );
    if (!confirmed) return;

    try {
      const { error } = await supabase.functions.invoke('delete-user');
      if (error) throw error;
      await supabase.auth.signOut();
      logout();
      router.push('/login');
    } catch (err: any) {
      const msg = err?.message || '';
      alert(msg.includes('function') ? 'Account deletion is not available yet. Please contact support.' : msg || 'Failed to delete account');
    }
  };

  const settingsTabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: 'account_circle' },
    { id: 'security' as SettingsTab, label: 'Security', icon: 'shield' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: 'notifications' },
  ];

  if (isLoadingProfile) {
    return (
      <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-48 bg-surface-variant rounded-lg" />
          <div className="h-96 bg-surface-variant rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Settings Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-primary-container rounded-xl p-6 sticky top-28 border border-outline-variant/20 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/10 rounded-full blur-2xl" />

              <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/20 flex items-center justify-center border-2 border-secondary-fixed/50 text-secondary-fixed font-bold text-lg overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  (() => {
                      const name = user?.displayName || 'User';
                      const parts = name.trim().split(/\s+/);
                      return parts.length >= 2
                        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                        : name[0].toUpperCase();
                    })()
                )}
              </div>
              <div>
                <h3 className="font-body-md text-body-md font-bold text-white">{user?.displayName || 'User'}</h3>
                <p className="font-body-sm text-body-sm text-on-primary-container">@{user?.username || 'user'}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 relative z-10">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg font-label-caps text-label-caps transition-all duration-200 text-left w-full ${
                    activeTab === tab.id
                      ? 'text-secondary-fixed font-bold border-r-2 border-secondary-fixed bg-navy-glass'
                      : 'text-on-primary-container opacity-80 hover:bg-navy-glass hover:text-secondary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-label-caps text-label-caps transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-gutter">

          {/* ===== PROFILE ===== */}
          {activeTab === 'profile' && (
            <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
                <h3 className="font-h3 text-h3 text-white">Profile Information</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10">
                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                  <div className="relative group cursor-pointer">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        onClick={() => setShowAvatarPreview(true)}
                        className="w-32 h-32 rounded-full object-cover border-2 border-secondary-fixed/50 group-hover:border-secondary-fixed transition-colors"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center border-2 border-secondary-fixed/50 group-hover:border-secondary-fixed transition-colors text-secondary-fixed">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>account_circle</span>
                      </div>
                    )}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="font-body-sm text-body-sm text-on-primary-container hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isUploadingAvatar ? 'Uploading...' : 'Change Picture'}
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Email Address</label>
                    <input type="email" value={user?.email || ''} disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white/50 cursor-not-allowed" />
                    <p className="font-body-sm text-body-sm text-on-primary-container text-xs">Email cannot be changed from settings.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-primary-container">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..." rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-primary-container">Country / Region</label>
                  <div className="relative">
                    <select value={country} onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white appearance-none focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors">
                      <option value="NG" className="bg-primary-container text-white">Nigeria</option>
                      <option value="US" className="bg-primary-container text-white">United States</option>
                      <option value="UK" className="bg-primary-container text-white">United Kingdom</option>
                      <option value="CA" className="bg-primary-container text-white">Canada</option>
                      <option value="GH" className="bg-primary-container text-white">Ghana</option>
                      <option value="KE" className="bg-primary-container text-white">Kenya</option>
                      <option value="OTHER" className="bg-primary-container text-white">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-primary-container">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-4 relative z-10">
                {saveMessage && (
                  <p className={`font-body-sm text-body-sm ${saveMessageType === 'success' ? 'text-success-verified' : 'text-error'}`}>
                    {saveMessage}
                  </p>
                )}
                <button onClick={handleSaveProfile} disabled={isSaving}
                  className="bg-[#d4af37] text-[#0d1b35] font-body-md text-body-md font-bold py-2.5 px-6 rounded-lg hover:bg-[#b8860b] transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>
          )}

          {/* ===== SECURITY ===== */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-gutter">
              <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl" />

                <div className="mb-6 border-b border-white/10 pb-4 relative z-10">
                  <h3 className="font-h3 text-h3 text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d4af37]">lock</span>
                    Security
                  </h3>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <h4 className="font-body-md text-body-md font-semibold text-white">Change Password</h4>
                    <div className="space-y-3">
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                    </div>
                    {passwordMessage && (
                      <p className={`font-body-sm text-body-sm ${passwordMessageType === 'success' ? 'text-success-verified' : 'text-error'}`}>
                        {passwordMessage}
                      </p>
                    )}
                    <button onClick={handleUpdatePassword} disabled={isUpdatingPassword}
                      className="w-full bg-white/10 text-white font-body-sm text-body-sm py-2.5 rounded-lg hover:bg-white/20 border border-white/10 transition-colors mt-2 disabled:opacity-50">
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="font-body-md text-body-md font-semibold text-red-400 mb-1">Danger Zone</h4>
                      <p className="font-body-sm text-body-sm text-on-primary-container mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <button onClick={handleDeleteAccount}
                        className="text-red-400 text-body-sm font-body-sm font-semibold hover:text-red-300 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeTab === 'notifications' && (
            <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl" />

              <div className="mb-6 border-b border-white/10 pb-4 relative z-10">
                <h3 className="font-h3 text-h3 text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d4af37]">notifications</span>
                  Notification Preferences
                </h3>
              </div>

              <div className="space-y-4 relative z-10">
                <ToggleRow label="Transaction Alerts" desc="Email notifications for deposits and withdrawals" checked={transactionAlerts} onChange={setTransactionAlerts} />
                <ToggleRow label="Marketing Promos" desc="Special offers and partner deals" checked={marketingPromos} onChange={setMarketingPromos} />
              </div>

              {notificationMessage && (
                <p className={`font-body-sm text-body-sm mt-4 relative z-10 ${notificationMessage.includes('saved') ? 'text-success-verified' : 'text-error'}`}>
                  {notificationMessage}
                </p>
              )}
              <button onClick={handleSaveNotifications} disabled={isSavingNotifications}
                className="mt-4 bg-[#d4af37] text-[#0d1b35] font-body-md text-body-md font-bold py-2.5 px-6 rounded-lg hover:bg-[#b8860b] transition-colors disabled:opacity-50 relative z-10">
                {isSavingNotifications ? 'Saving...' : 'Save Preferences'}
              </button>
            </section>
          )}

          {/* ===== LOGOUT ===== */}
          <div className="flex justify-center pt-4">
            <button onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white/10 text-white font-body-md text-body-md font-semibold py-3 px-8 rounded-lg hover:bg-white/20 border border-white/10 transition-colors">
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* Avatar preview lightbox */}
      {showAvatarPreview && avatarUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setShowAvatarPreview(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={avatarUrl} alt="Profile picture" className="max-w-full max-h-[85vh] rounded-lg" />
            <button
              onClick={() => setShowAvatarPreview(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
      <div>
        <p className="font-body-md text-body-md text-white">{label}</p>
        <p className="font-body-sm text-body-sm text-on-primary-container">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
      </label>
    </div>
  );
}
```
---


### File: apps/web/app/(app)/referrals/page.tsx

```tsx
'use client';

import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useReferralStats, useReferrals } from '@/lib/hooks';
import { useUserStore } from '@/stores/userStore';



export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { user } = useUserStore();
  const { data: stats, isLoading: statsLoading } = useReferralStats(user?.id || '');
  const { data: referrals = [], isLoading: referralsLoading } = useReferrals(user?.id || '');

  // Referral code lives in profiles table, available via userStore
  const referralCode = user?.referralCode || '...';
  const totalReferrals = stats?.totalReferrals || 0;
  const activeReferrals = stats?.activeReferrals || 0;
  const totalEarned = stats?.referralEarnings || 0;
  const weeklyEarnings = stats?.weeklyEarnings || 0;
  const chartData = stats?.weeklyData || [
    { name: 'Week 1', coins: 0 },
    { name: 'Week 2', coins: 0 },
    { name: 'Week 3', coins: 0 },
    { name: 'Week 4', coins: 0 },
  ];
  
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${referralCode}` : '';
  const shareText = `Join me on CMP App and earn rewards! Use my invite code: ${referralCode}`;

  const copyCode = () => {
    if (referralCode === '...') return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full pb-24 md:pb-8">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter pt-8">
        {/* Left Column: Share & Stats */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* Referral Share Card */}
          <div className="bg-primary-container rounded-xl p-6 relative overflow-hidden shadow-lg border border-primary-fixed-dim/20">
            {/* Decorative background element */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container opacity-10 rounded-full blur-2xl"></div>
            <h2 className="font-h3 text-h3 text-on-primary mb-2 relative z-10">Your Invite Code</h2>
            <p className="font-body-sm text-body-sm text-on-primary-container mb-6 relative z-10">Share this code with your network to start earning.</p>
            
            <div className="bg-primary p-4 rounded-lg flex items-center justify-between border border-secondary-fixed/30 relative z-10 group">
              <span className="font-data-lg text-data-lg text-secondary-fixed tracking-wider select-all" id="referralCode">{referralCode}</span>
              <button 
                onClick={copyCode}
                aria-label="Copy code" 
                className="text-secondary-fixed hover:text-secondary-fixed-dim transition-colors bg-secondary-fixed/10 p-2 rounded-md"
              >
                {copied ? (
                  <span className="material-symbols-outlined text-success-verified" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                ) : (
                  <span className="material-symbols-outlined">content_copy</span>
                )}
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-on-primary-container/20 relative z-10">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-3 text-center">Quick Share</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')}
                  className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-colors"
                >
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                  className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2]/20 transition-colors"
                >
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Earnings Overview Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-alt rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-surface-tint mb-3">
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span className="font-label-caps text-label-caps">Network</span>
              </div>
              <div>
                <div className="font-data-lg text-h2 text-primary-container">{statsLoading ? '...' : totalReferrals}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total Referrals</div>
              </div>
            </div>
            <div className="bg-surface-alt rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-success-verified mb-3">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="font-label-caps text-label-caps">Active</span>
              </div>
              <div>
                <div className="font-data-lg text-h2 text-primary-container">{statsLoading ? '...' : activeReferrals}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Generating Yield</div>
              </div>
            </div>
            <div className="col-span-2 bg-surface-alt rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-2 border-secondary-container/50 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                <span className="material-symbols-outlined text-[120px]">savings</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-container mb-2 relative z-10">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                <span className="font-label-caps text-label-caps">Total Earned</span>
              </div>
              <div className="flex items-baseline space-x-2 relative z-10">
                <span className="text-2xl">🪙</span>
                <span className="font-data-lg text-h1 text-primary-container">{statsLoading ? '...' : totalEarned.toLocaleString()}</span>
              </div>
              <div className="font-body-sm text-body-sm text-success-verified mt-2 flex items-center space-x-1 relative z-10">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+{weeklyEarnings.toLocaleString()} this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Graph & List */}
        <div className="lg:col-span-8 space-y-gutter mt-8 lg:mt-0">
          {/* Chart Card */}
          <div className="bg-surface-alt rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-primary-container">Commission History</h3>
              <select className="bg-surface rounded-lg border border-outline-variant/50 font-body-sm text-body-sm text-on-surface-variant px-3 py-1.5 focus:ring-secondary-container focus:border-secondary-container">
                <option>Last 30 Days</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fdc34d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fdc34d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#75777e" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1b35', borderColor: '#0d1b35', color: '#fff', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="coins" stroke="#fdc34d" strokeWidth={3} fillOpacity={1} fill="url(#colorCoins)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-surface-alt rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h3 className="font-h3 text-h3 text-primary-container">Recent Network Activity</h3>
              <button className="text-secondary hover:text-secondary-fixed-dim transition-colors font-label-caps text-label-caps flex items-center space-x-1">
                <span>View All</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-highest border-b border-outline-variant/30">
                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">User</th>
                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Joined</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/20">
                  {referralsLoading ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-on-surface-variant">Loading network...</td>
                    </tr>
                  ) : referrals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-on-surface-variant">No referrals found in your network.</td>
                    </tr>
                  ) : (
                    referrals.map((referral) => {
                      const name = referral.referred_user?.full_name || referral.referred_user?.email?.split('@')[0] || 'Unknown';
                      const initials = name.slice(0, 2).toUpperCase();
                      const date = new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const level = 'L1'; // Keep at L1 for now since we don't have deeper tier modeling yet

                      return (
                        <tr key={referral.id} className="hover:bg-surface transition-colors group">
                          <td className="p-4 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs bg-primary-container">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface">{name}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              referral.status === 'ACTIVE' 
                                ? 'bg-secondary-container/20 text-secondary border border-secondary-container/30'
                                : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                            }`}>
                              {referral.status}
                            </span>
                          </td>
                          <td className="p-4 text-on-surface-variant">{date}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
---


### File: apps/web/app/(app)/contests/page.tsx

```tsx
'use client';

import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Users } from 'lucide-react';
import { useContests } from '@/lib/hooks';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return (
        <NeuCard
          padding="none"
          className="bg-neo-secondary text-neo-primary font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm"
        >
          LIVE
        </NeuCard>
      );
    case 'UPCOMING':
      return (
        <NeuCard
          padding="none"
          className="bg-neo-success/20 text-neo-success font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm"
        >
          UPCOMING
        </NeuCard>
      );
    case 'COMPLETED':
      return (
        <NeuCard
          padding="none"
          className="bg-neo-text-muted/20 text-neo-text-muted font-label-caps text-label-caps px-3 py-1 rounded-full font-semibold shadow-neu-raised-sm"
        >
          ENDED
        </NeuCard>
      );
    default:
      return null;
  }
}

export default function ContestsPage() {
  const { data: contests = [], isLoading } = useContests();

  return (
    <PageTransition className="container py-8 space-y-gutter">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-neo-primary mb-4">Contests</h1>
        <p className="font-body-lg text-body-lg text-neo-text-secondary">
          Vote for your favorites and win prizes!
        </p>
      </div>

      {/* Earn Info */}
      <NeuCard padding="md" className="bg-gradient-to-r from-neo-secondary/20 to-neo-secondary/10 border border-neo-secondary/30 shadow-neu-flat">
        <div className="flex items-center gap-3">
          <NeuIconBadge size="md" active className="bg-neo-secondary/20">
            <Trophy className="w-5 h-5 text-neo-secondary" />
          </NeuIconBadge>
          <p className="font-body-md text-body-md text-neo-text-primary">
            <span className="font-semibold">🎉 Earn 20 coins</span> for every vote!
          </p>
        </div>
      </NeuCard>

      {/* Contests List */}
      <div className="mt-8">
        <h2 className="font-h3 text-h3 text-neo-text-primary flex items-center gap-2 mb-6">
          <NeuIconBadge size="md" active className="bg-neo-secondary/20">
            <Trophy className="w-5 h-5 text-neo-secondary" />
          </NeuIconBadge>
          All Contests
        </h2>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-64 rounded-neo neo-skeleton" />
            ))}
          </div>
        ) : contests.length === 0 ? (
          <NeuCard padding="lg" className="text-center py-12 shadow-neu-flat">
            <NeuIconBadge size="lg" active className="mx-auto mb-4 bg-neo-text-muted/20">
              <Trophy className="w-8 h-8 text-neo-text-muted" />
            </NeuIconBadge>
            <h3 className="font-h3 text-h3 text-neo-text-primary mb-2">No contests right now</h3>
            <p className="font-body-md text-body-md text-neo-text-secondary">Check back soon for new contests!</p>
          </NeuCard>
        ) : (
          <div className="space-y-6">
            <StaggerContainer stagger={0.1}>
              {contests.map((contest) => (
                <StaggerItem key={contest.id}>
                  <NeuCard padding="none" interactive className="overflow-hidden shadow-neu-flat">
                    {/* Contest Header */}
                    <div className="bg-gradient-to-r from-neo-primary to-neo-primary/80 p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                      <div className="relative z-10 flex items-start justify-between">
                        <div>
                          <h3 className="font-h3 text-h3 text-white mb-2">{contest.title}</h3>
                          {contest.description && (
                            <p className="font-body-sm text-body-sm text-white/80 mb-4">{contest.description}</p>
                          )}
                        </div>
                        {getStatusBadge(contest.status)}
                      </div>
                      {contest.prize_pool_coins && (
                        <div className="flex items-center gap-2 mt-4 text-white/90">
                          <NeuIconBadge size="sm" active className="bg-white/20">
                            <Crown className="w-4 h-4 text-neo-secondary" />
                          </NeuIconBadge>
                          <p className="font-body-sm text-body-sm">{contest.prize_pool_coins.toLocaleString()} Coins</p>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="font-label-caps text-label-caps text-white/70">
                          Ends: {formatDate(contest.end_date)}
                        </p>
                      </div>
                    </div>

                    {/* Contest Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-neo-text-secondary">
                        <Users className="w-4 h-4" />
                        <span className="font-body-sm text-body-sm">Category: {contest.category}</span>
                      </div>
                    </div>
                  </NeuCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
```
---



## Wallet Pages


### File: apps/web/app/(app)/wallet/page.tsx

```tsx
'use client';

import Link from 'next/link';
import { useWallet } from '@/lib/useWallet';
import { useTransactions } from '@/lib/hooks';
import { useCurrency } from '@/lib/useCurrency';

const TX_LABELS: Record<string, string> = {
  earn: 'Task Earn',
  spend: 'Spend',
  TOPUP: 'Top Up',
  WITHDRAWAL: 'Withdrawal',
  REFUND: 'Refund',
  TASK_EARN: 'Task Earn',
  READ_ARTICLE: 'Read Article',
  WATCH_AD: 'Watch Ad',
  REFERRAL_REWARD: 'Referral Reward',
  REFERRAL_SIGNUP: 'Referral Signup',
  STREAK_BONUS: 'Streak Bonus',
  AIRTIME_PURCHASE: 'Airtime',
  DATA_PURCHASE: 'Data',
  ELECTRICITY_PURCHASE: 'Electricity',
  VOTE: 'Vote',
  MUSIC_STREAM: 'Music Stream',
  bonus: 'Bonus',
};

const TX_ICONS: Record<string, string> = {
  earn: 'play_circle',
  spend: 'remove_circle',
  TOPUP: 'add_circle',
  WITHDRAWAL: 'account_balance',
  REFUND: 'undo',
  TASK_EARN: 'play_circle',
  READ_ARTICLE: 'menu_book',
  WATCH_AD: 'tv',
  REFERRAL_REWARD: 'groups',
  REFERRAL_SIGNUP: 'group_add',
  STREAK_BONUS: 'local_fire_department',
  AIRTIME_PURCHASE: 'call',
  DATA_PURCHASE: 'wifi',
  ELECTRICITY_PURCHASE: 'bolt',
  VOTE: 'how_to_vote',
  MUSIC_STREAM: 'headphones',
  bonus: 'card_giftcard',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function WalletPage() {
  const { wallet, loading: walletLoading } = useWallet();
  const { data: transactions = [], isLoading: txLoading, isError: txError } = useTransactions(wallet?.id || '');
  const { formatFiat, loadingLocation } = useCurrency();

  const coinBalance = wallet?.balance ?? 0;

  return (
    <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
      {/* Balance Hero Section */}
      <section className="bg-primary-container rounded-xl p-8 relative overflow-hidden shadow-lg border border-outline-variant/20">
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-body-md text-body-md text-inverse-primary mb-2 opacity-80">Total Balance</h2>
          <div className="flex items-baseline space-x-3 mb-1">
            <img src="/coin.png" alt="Coin" className="w-10 h-10 object-contain" />
            <span className="font-h1 text-h1 text-secondary-fixed tracking-tight">
              {walletLoading ? '...' : coinBalance.toLocaleString()}
            </span>
          </div>
          <p className="font-data-md text-data-md text-on-primary-container bg-on-primary-fixed/50 inline-block px-3 py-1 rounded-full border border-outline/30">
            {loadingLocation ? 'Detecting currency...' : `≈ ${formatFiat(coinBalance)}`}
          </p>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Up (Primary Action) */}
        <Link href="/wallet/topup" className="flex flex-col items-center justify-center p-6 bg-secondary-container rounded-lg hover:bg-secondary transition-colors group shadow-sm">
          <span className="material-symbols-outlined text-on-secondary-container group-hover:text-on-secondary mb-2 text-3xl transition-colors">add_circle</span>
          <span className="font-body-md text-body-md font-semibold text-on-secondary-container group-hover:text-on-secondary transition-colors">Top Up</span>
        </Link>
        {/* Withdraw */}
        <Link href="/wallet/withdraw" className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">account_balance</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">Withdraw</span>
        </Link>
        {/* Send Coins */}
        <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">send</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">Send Coins</span>
        </button>
      </section>

      {/* Transaction History */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-on-surface">Recent Transactions</h3>
          <button className="font-body-sm text-body-sm text-surface-tint hover:text-primary transition-colors">View All</button>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {txLoading ? (
             <div className="p-8 flex justify-center text-on-surface-variant">
               <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
             </div>
          ) : txError ? (
             <div className="p-8 text-center text-error">
               Failed to load transactions. Please try again.
             </div>
          ) : transactions.length === 0 ? (
             <div className="p-8 text-center text-on-surface-variant">
               No recent transactions found.
             </div>
          ) : (
            transactions.map((tx) => {
              const isPositive = !['WITHDRAWAL','spend'].includes(tx.type);
              return (
                <div key={tx.id} className="p-4 hover:bg-surface-bright transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPositive ? 'bg-secondary-fixed/20 text-secondary-container' : 'bg-error-container/50 text-error'}`}>
                      <span className="material-symbols-outlined">
                        {TX_ICONS[tx.type] || 'toll'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-medium text-on-surface">{TX_LABELS[tx.type] || tx.type}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-data-md text-data-md ${isPositive ? 'text-success-verified' : 'text-error'}`}>
                      {isPositive ? '+' : '-'} {Number(tx.amount).toLocaleString()}
                    </p>
                    {tx.description && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{tx.description}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/wallet/topup/page.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopUpSelectMethodPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedMethod) {
      router.push(`/wallet/topup/amount?method=${selectedMethod}`);
    }
  };

  return (
    <main className="flex-1 pb-24 md:pb-12 min-h-screen">
      {/* Hero Branding Section */}
      <section className="relative bg-primary-container h-64 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="relative z-10 px-margin-mobile">
          <h1 className="font-h1 text-h1 text-on-primary mb-2">Fund Your Account</h1>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl">Secure and instant top-ups to power your creative enterprise.</p>
        </div>
      </section>

      {/* Selection Container */}
      <section className="max-w-4xl mx-auto -mt-16 px-margin-mobile relative z-20">
        <div className="bg-surface-container-lowest rounded-xl shadow-xl p-8 border border-outline-variant/30">
          <div className="mb-10 text-center">
            <h2 className="font-h2 text-h2 text-primary-container mb-2">Select Top-up Method</h2>
            <p className="text-on-surface-variant font-body-md">Choose your preferred provider to proceed with the transaction.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Paystack Card */}
            <button
              onClick={() => setSelectedMethod('paystack')}
              className={`cursor-pointer group relative p-6 rounded-xl border-2 bg-surface-alt text-left transition-all duration-300 ease-in-out ${
                selectedMethod === 'paystack'
                  ? 'border-[#B8860B] bg-[#B8860B]/5'
                  : 'border-transparent hover:border-secondary-fixed'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden p-2">
                  <span className="material-symbols-outlined text-primary-container text-3xl">credit_card</span>
                </div>
                <span className={`material-symbols-outlined text-secondary-fixed transition-opacity ${selectedMethod === 'paystack' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary-container mb-2">Paystack</h3>
              <p className="text-on-surface-variant text-body-sm mb-4">Cards, Bank Transfer, Mobile Money</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-label-caps font-label-caps px-2 py-1 bg-primary-container/5 text-primary-container rounded border border-primary-container/10">VISA</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-primary-container/5 text-primary-container rounded border border-primary-container/10">MASTERCARD</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-primary-container/5 text-primary-container rounded border border-primary-container/10">NGN</span>
              </div>
            </button>

            {/* NowPayments Card */}
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`cursor-pointer group relative p-6 rounded-xl border-2 bg-surface-alt text-left transition-all duration-300 ease-in-out ${
                selectedMethod === 'crypto'
                  ? 'border-[#B8860B] bg-[#B8860B]/5'
                  : 'border-transparent hover:border-secondary-fixed'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden p-2">
                  <span className="material-symbols-outlined text-secondary text-3xl">currency_bitcoin</span>
                </div>
                <span className={`material-symbols-outlined text-secondary-fixed transition-opacity ${selectedMethod === 'crypto' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary-container mb-2">NowPayments</h3>
              <p className="text-on-surface-variant text-body-sm mb-4">Crypto: BTC, ETH, USDT (ERC20/TRC20)</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-label-caps font-label-caps px-2 py-1 bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">BITCOIN</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">ETHEREUM</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">USDT</span>
              </div>
            </button>
          </div>

          {/* CTA Area */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className="w-full max-w-sm py-4 rounded-lg bg-secondary-container text-primary-container font-h3 text-h3 font-bold shadow-md hover:bg-on-secondary-container/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
            >
              Continue to Payment
            </button>
            <p className="text-body-sm font-body-sm text-on-surface-variant/70 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              Secure 256-bit encrypted transaction
            </p>
          </div>
        </div>

        {/* Contextual Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-alt p-4 rounded-lg border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">speed</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim">PROCESSING</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Instant for Paystack. Crypto requires network confirmations.</p>
          </div>
          <div className="bg-surface-alt p-4 rounded-lg border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">payments</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim">LIMITS</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Min: $10 (₦15,000) / Max: $10,000 per transaction.</p>
          </div>
          <div className="bg-surface-alt p-4 rounded-lg border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">support_agent</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim">SUPPORT</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Dedicated 24/7 priority support for premium creative members.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/wallet/topup/amount/page.tsx

```tsx
'use client';

import { useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/lib/useWallet';
import { useCurrency } from '@/lib/useCurrency';

function TopUpAmountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams?.get('method') || 'paystack';
  const { wallet } = useWallet();
  const { currency, activeRate, formatFiat, getCoinsFromFiat, loadingLocation } = useCurrency();

  const [mode, setMode] = useState<'cmp' | 'fiat'>('fiat');
  const [cmpAmount, setCmpAmount] = useState<string>('');
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const numFiat = parseFloat(fiatAmount) || 0;
  const numCmp = parseInt(cmpAmount) || 0;

  const processingFee = mode === 'fiat' ? (currency === 'USD' ? 0.45 : 50) : 2;
  const serviceFee = numFiat * 0.005;
  const totalPayable = numFiat + processingFee + serviceFee;

  const handleCmpChange = (val: string) => {
    setCmpAmount(val);
    const n = parseInt(val) || 0;
    setFiatAmount(n > 0 ? (n * activeRate.ratePerCmp).toFixed(2) : '');
    setMode('cmp');
  };

  const handleFiatChange = (val: string) => {
    setFiatAmount(val);
    const n = parseFloat(val) || 0;
    setCmpAmount(n > 0 ? Math.round(n / activeRate.ratePerCmp).toString() : '');
    setMode('fiat');
  };

  const handleQuickSelect = (val: number) => {
    setFiatAmount(val.toString());
    setCmpAmount(Math.round(val / activeRate.ratePerCmp).toString());
    setMode('fiat');
  };

  const handleConfirm = async () => {
    if (numFiat <= 0 || numCmp <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      router.push(`/wallet/topup/checkout?amount=${numFiat}&method=${method}&cmp=${numCmp}&currency=${currency}`);
    }, 500);
  };

  const quickOptions = useMemo(() => {
    if (currency === 'NGN') return [1000, 5000, 10000, 50000];
    return [10, 25, 50, 100];
  }, [currency]);

  return (
    <main className="flex-1 flex-grow flex items-center justify-center pt-8 pb-24 md:pb-12 px-margin-mobile md:px-margin-desktop relative min-h-[calc(100vh-80px)]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl"></div>
      </div>

      <section className="relative z-10 w-full max-w-xl">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-primary-container p-8 text-center relative">
            <Link href="/wallet/topup" className="absolute left-4 top-4 text-on-primary-container hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="font-h2 text-h3 md:text-h2 text-white mb-2">Top-up Wallet</h1>
            <p className="text-on-primary-container font-body-sm">
              Enter the amount you wish to add. All top-ups are credited as CMP coins.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-surface-tint/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline/20">
              <span className="material-symbols-outlined text-secondary-fixed text-sm">{method === 'paystack' ? 'credit_card' : 'currency_bitcoin'}</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed uppercase">{method === 'paystack' ? 'Paystack' : 'NowPayments'}</span>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            <div className="space-y-3">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">Amount in CMP Coins</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <img src="/coin.png" alt="" className="w-6 h-6 object-contain" />
                </div>
                <input
                  type="number"
                  value={cmpAmount}
                  onChange={(e) => handleCmpChange(e.target.value)}
                  placeholder="0"
                  className="w-full bg-surface-alt border-none py-6 pl-14 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-outline-variant/30"></div>
              <span className="text-on-surface-variant font-body-sm bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/20">equivalent to</span>
              <div className="h-px flex-1 bg-outline-variant/30"></div>
            </div>

            <div className="space-y-3">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">
                Amount in {loadingLocation ? '...' : currency}
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <span className="font-h2 text-h3 text-on-surface-variant">{activeRate.symbol}</span>
                </div>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => handleFiatChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-surface-alt border-none py-6 pl-12 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>
              <p className="text-body-sm text-on-surface-variant text-right">
                1 CMP = {activeRate.symbol}{activeRate.ratePerCmp} {activeRate.code}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickOptions.map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickSelect(val)}
                  className={`py-3 rounded-lg border text-on-surface font-semibold hover:border-secondary transition-colors focus:bg-secondary-fixed focus:border-secondary-container ${
                    parseFloat(fiatAmount) === val ? 'border-secondary bg-secondary-fixed/20' : 'border-outline-variant'
                  }`}
                >
                  +{activeRate.symbol}{val.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="bg-surface-alt rounded-lg p-6 space-y-3">
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>You will receive</span>
                <span className="font-data-lg text-data-lg text-primary font-bold">{numCmp.toLocaleString()} CMP</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>Network Processing Fee</span>
                <span className="font-data-md text-data-md">{mode === 'fiat' ? `${activeRate.symbol}${processingFee.toFixed(2)}` : `${processingFee} CMP`}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>Platform Service Fee (0.5%)</span>
                <span className="font-data-md text-data-md">{activeRate.symbol}{serviceFee.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-outline-variant flex justify-between items-center text-on-surface">
                <span className="font-bold">Total Charge</span>
                <span className="font-data-lg text-data-lg text-primary">{activeRate.symbol}{totalPayable.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleConfirm}
                disabled={numFiat <= 0 || numCmp <= 0 || isProcessing}
                className="w-full bg-secondary-container text-on-secondary-fixed py-5 rounded-lg font-h3 text-body-lg font-bold shadow-lg shadow-secondary-container/20 hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
                ) : (
                  <>Continue to Payment <span className="material-symbols-outlined">arrow_forward</span></>
                )}
              </button>
              <p className="text-center text-body-sm font-body-sm text-on-surface-variant/60 mt-4 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                Secure 256-bit encrypted transaction
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function TopUpAmountPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <TopUpAmountContent />
    </Suspense>
  );
}
```
---


### File: apps/web/app/(app)/wallet/topup/checkout/page.tsx

```tsx
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: Record<string, any>;
        callback: (response: { reference: string; trxref?: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

function generateReference(): string {
  return `CMP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fiatAmount = parseFloat(searchParams?.get('amount') || '0');
  const method = searchParams?.get('method') || 'paystack';
  const cmpAmount = parseInt(searchParams?.get('cmp') || '0');
  const currency = searchParams?.get('currency') || 'USD';
  const { wallet } = useWallet();
  const { user } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const providerName = method === 'crypto' ? 'NowPayments' : 'Paystack';
  const providerIcon = method === 'crypto' ? 'currency_bitcoin' : 'account_balance';
  const providerColor = method === 'crypto' ? 'text-secondary' : 'text-primary-container';

  // Load Paystack inline script
  useEffect(() => {
    if (method !== 'paystack') return;

    const existing = document.getElementById('paystack-script');
    if (existing) {
      if (typeof window.PaystackPop !== 'undefined') {
        setScriptLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load payment gateway. Please refresh and try again.');
    document.body.appendChild(script);
  }, [method]);

  const handlePaystackPayment = useCallback(() => {
    if (!user?.email || !scriptLoaded) return;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError('Payment not configured. Please contact support.');
      return;
    }

    if (typeof window.PaystackPop === 'undefined') {
      setError('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);

    const amountInKobo = Math.round(fiatAmount * 100);
    const reference = generateReference();

    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: amountInKobo,
        currency,
        ref: reference,
        metadata: {
          userId: user.id,
          cmpAmount,
          walletId: wallet?.id,
        },
        callback: function (response) {
          supabase.functions.invoke('payments-paystack-verify', {
            body: {
              reference: response.reference,
              cmpAmount,
            },
          })
            .then(function (result) {
              if (result.error) {
                throw new Error(result.error);
              }
              if (!result.data?.success) {
                throw new Error(result.data?.error || 'Verification failed');
              }
              router.push(
                '/wallet/topup/success?amount=' + fiatAmount + '&method=paystack&coins=' + result.data.coinsCredited + '&ref=' + response.reference
              );
            })
            .catch(function (err) {
              setError(err.message || 'Payment verification failed. Your wallet may not be credited.');
              setIsProcessing(false);
            });
        },
        onClose: function () {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err.message || 'Failed to open payment popup.');
      setIsProcessing(false);
    }
  }, [user, scriptLoaded, fiatAmount, currency, cmpAmount, wallet, router]);

  const handleCryptoPayment = useCallback(async () => {
    setIsProcessing(true);
    try {
      if (wallet && user) {
        const newBalance = (wallet.balance || 0) + cmpAmount;
        const { error: walletError } = await supabase
          .from('wallets')
          .update({ coin_balance: newBalance.toString() } as any)
          .eq('id', wallet.id);

        if (!walletError) {
          await supabase.from('coin_transactions').insert({
            wallet_id: wallet.id,
            user_id: user.id,
            type: 'TOPUP',
            amount: cmpAmount,
            balance_after: newBalance.toString(),
            description: `Top-up ${cmpAmount} CMP via ${providerName}`,
          } as any);
        }
      }
    } catch (error) {
      console.error('Top-up error:', error);
    }
    setTimeout(() => {
      router.push(`/wallet/topup/success?amount=${fiatAmount}&method=${method}&coins=${cmpAmount}`);
    }, 2000);
  }, [wallet, user, cmpAmount, providerName, fiatAmount, router]);

  const handleProceed = async () => {
    setError('');
    if (method === 'crypto') {
      await handleCryptoPayment();
    } else {
      await handlePaystackPayment();
    }
  };

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center relative overflow-hidden bg-surface">
      <div className="max-w-2xl w-full mx-margin-mobile z-10 my-12">
        <div className="bg-primary-container rounded-xl shadow-xl overflow-hidden border border-white/10">
          <div className="bg-white/5 p-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  <span className="text-secondary-fixed-dim font-label-caps text-label-caps tracking-widest uppercase">SECURE CHECKOUT</span>
                </div>
                <h2 className="text-white font-h2 text-h2 mb-1">Finalizing Transaction</h2>
                <p className="text-on-primary-container font-body-sm text-body-sm max-w-sm">
                  You are about to add <strong>{cmpAmount.toLocaleString()} CMP</strong> to your wallet.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/10 flex flex-col items-end">
                <span className="text-on-primary-container font-label-caps text-label-caps mb-1 uppercase">AMOUNT</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-data-lg text-data-lg">
                    {currency === 'NGN' ? '₦' : '$'}{fiatAmount.toFixed(2)}
                  </span>
                </div>
                <span className="text-secondary-fixed-dim font-body-sm">{cmpAmount.toLocaleString()} CMP</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-white text-center">
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-surface-alt flex items-center justify-center border-2 border-outline-variant/30">
                  <span className={`material-symbols-outlined text-4xl ${providerColor}`}>{providerIcon}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-success-verified text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-primary-container font-h3 text-h3 mb-3">
                  {method === 'crypto' ? `Redirecting to ${providerName}` : `Pay with ${providerName}`}
                </h3>
                <p className="text-on-surface-variant font-body-md text-body-md max-w-md mx-auto">
                  {method === 'crypto' ? (
                    <>You will be securely connected to <span className="font-bold text-primary">{providerName}</span> to complete payment of <strong>{currency === 'NGN' ? '₦' : '$'}{fiatAmount.toFixed(2)}</strong> for <strong>{cmpAmount.toLocaleString()} CMP</strong>.</>
                  ) : (
                    <>A secure <span className="font-bold text-primary">Paystack</span> popup will open to complete your payment of <strong>{currency === 'NGN' ? '₦' : '$'}{fiatAmount.toFixed(2)}</strong> for <strong>{cmpAmount.toLocaleString()} CMP</strong>.</>
                  )}
                </p>
              </div>

              {error && (
                <div className="w-full mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm text-left">
                  {error}
                </div>
              )}

              <button
                onClick={handleProceed}
                disabled={isProcessing || (method === 'paystack' && (!scriptLoaded || !user?.email))}
                className={`w-full md:w-auto px-12 py-5 bg-secondary-container hover:bg-secondary transition-all duration-300 rounded-lg text-on-secondary-fixed font-bold text-body-lg shadow-lg flex items-center justify-center gap-3 group ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {isProcessing ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
                ) : method === 'paystack' && !scriptLoaded ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Loading payment gateway...</>
                ) : (
                  <><span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock_open</span> Proceed to Secure Payment</>
                )}
              </button>

              <p className="mt-6 text-on-surface-variant/60 font-body-sm text-body-sm italic">
                {method === 'paystack'
                  ? 'A popup will open to complete your payment. Please disable popup blockers.'
                  : 'Click above if you are not redirected automatically within 5 seconds.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
```
---


### File: apps/web/app/(app)/wallet/topup/success/page.tsx

```tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const coins = searchParams?.get('coins') || '0';
  const method = searchParams?.get('method') || 'paystack';
  const { user } = useUserStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const transactionId = `TXN-${Math.floor(1000 + Math.random() * 9000)}-XAL-001`;
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    // Set timestamp
    const now = new Date();
    setTimestamp(now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
    
    // Trigger confetti
    setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    
    // Hide confetti particles after animation finishes
    const cleanup = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    
    return () => clearTimeout(cleanup);
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 50);
  };

  const getCardMask = () => {
    if (method === 'crypto') return 'NowPayments Wallet';
    return 'Creative Card •••• 4421';
  };

  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile pt-16 pb-12 relative z-10 bg-surface min-h-screen">
      {/* Transaction Canvas Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ['#f7bd48', '#ffdea6', '#fdc34d', '#0d1b35'];
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const duration = Math.random() * 2 + 1;
            const delay = Math.random() * 0.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div
                key={i}
                className="absolute top-[-10px] rounded-full pointer-events-none"
                style={{
                  left: `${left}vw`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `fall ${duration}s linear ${delay}s forwards`,
                }}
              />
            );
          })}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}} />
        </div>
      )}

      <div className="max-w-md w-full my-8">
        {/* Success Card */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[24px] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Visual Section */}
          <div className="relative bg-primary-container h-48 flex items-center justify-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <button 
                onClick={triggerConfetti}
                className="w-20 h-20 bg-success-verified rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105 active:scale-95"
                style={{
                  animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </button>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse-ring {
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.7); }
                  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(46, 125, 50, 0); }
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
                }
              `}} />
              <h1 className="font-h3 text-h3 text-white text-center">Top-up Successful</h1>
            </div>
          </div>
          
          {/* Details Content */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-on-surface-variant font-label-caps uppercase mb-2">Amount Added</p>
              <div className="inline-flex items-center gap-2 bg-surface-alt px-4 py-2 rounded-full border-[1.5px] border-secondary">
                <img src="/coin.png" alt="Coin" className="w-6 h-6 object-contain" />
                <span className="font-data-lg text-data-lg text-primary">{parseFloat(coins).toLocaleString()} CMP</span>
              </div>
            </div>
            
            {/* Transaction Info */}
            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Transaction ID</span>
                <span className="font-data-md text-data-md text-primary select-all">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Payment Method</span>
                <span className="text-on-surface font-semibold">{getCardMask()}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Timestamp</span>
                <span className="text-on-surface">{timestamp}</span>
              </div>
            </div>
            
            {/* Success Message */}
            <p className="text-body-sm font-body-sm text-on-surface-variant text-center leading-relaxed">
              Your CMP Coins are now available in your wallet. You can use them to fund projects, pay creators, or upgrade your membership.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Link href="/wallet" className="w-full bg-primary-container text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                Back to Wallet
              </Link>
              <button className="w-full bg-transparent border border-outline text-on-surface-variant py-3 rounded-lg font-medium hover:bg-surface-alt transition-colors active:scale-[0.98]">
                Download Receipt
              </button>
            </div>
          </div>
          
          {/* Ad-Gate Style Reward Promo */}
          <div className="border-t border-outline-variant/20 p-6 bg-secondary-fixed/10">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-fixed">workspace_premium</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-on-surface text-sm">Earn 5% CMP Bonus</h4>
                <p className="text-xs text-on-surface-variant">Upgrade to Pro to earn bonus coins on every top-up.</p>
              </div>
              <button className="bg-secondary-container text-on-secondary-fixed px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-secondary transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
        
        {/* Support Link */}
        <p className="text-center mt-8 text-body-sm font-body-sm text-on-surface-variant">
          Need help? <Link href="#" className="text-primary font-semibold underline underline-offset-4">Contact Support</Link>
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
```
---


### File: apps/web/app/(app)/wallet/withdraw/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@/lib/useWallet';
import { useWithdrawStore, SettlementAccount } from '@/stores/withdrawStore';
import { useCurrency } from '@/lib/useCurrency';

export default function WithdrawAmountPage() {
  const router = useRouter();
  const { wallet, loading: isLoading } = useWallet();
  const availableBalance = wallet ? wallet.balance : 0;
  const { setAmountCoins } = useWithdrawStore();
  const [coins, setCoins] = useState<string>('');
  const { activeRate, formatFiat, loadingLocation } = useCurrency();
  const [accounts, setAccounts] = useState<SettlementAccount[]>([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from('settlement_accounts')
      .select('*')
      .order('is_default', { ascending: false })
      .then(({ data }) => {
        setAccounts((data as SettlementAccount[]) || []);
        setAccountsLoaded(true);
      });
  }, []);

  const parsedCoins = parseInt(coins) || 0;
  const isOverBalance = parsedCoins > availableBalance;
  const isUnderMin = parsedCoins < 100 && parsedCoins > 0;
  const hasAccounts = accounts.length > 0;
  const isValid = hasAccounts && parsedCoins >= 100 && parsedCoins <= availableBalance;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setAmountCoins(parsedCoins);
      router.push('/wallet/withdraw/bank');
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] pb-24 md:pb-12 px-margin-mobile relative">
      <div className="bg-surface-container-lowest rounded-xl w-full max-w-lg p-6 md:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] mt-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/wallet" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-outline-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h2 className="font-h3 text-h3 text-on-surface m-0">Withdraw Funds</h2>
            <p className="text-on-surface-variant font-body-sm mt-1">Step 1 of 3: Amount Selection</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-[#B8860B]">1</div>
            <span className="font-label-caps text-label-caps text-on-surface">Amount</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">2</div>
            <span className="font-label-caps text-label-caps text-outline">Account</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">3</div>
            <span className="font-label-caps text-label-caps text-outline">Confirm</span>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/30 rounded-lg p-4 mb-8 flex justify-between items-center">
          <span className="font-body-md text-on-surface-variant">Available Balance</span>
          <div className="flex items-center gap-2">
            <img src="/coin.png" alt="Coin" className="w-5 h-5 object-contain" />
            <span className="font-data-lg text-data-lg text-on-surface">
              {isLoading ? '...' : availableBalance.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface" htmlFor="withdrawAmount">Amount to Withdraw (Coins)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <img src="/coin.png" alt="Coin" className="w-5 h-5 object-contain" />
              </div>
              <input
                id="withdrawAmount"
                type="number"
                min="100"
                max={availableBalance}
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                placeholder="0"
                className={`block w-full pl-12 pr-4 py-4 bg-surface border rounded-lg text-on-surface font-data-lg text-data-lg focus:ring-primary focus:border-primary transition-colors focus:outline-none ${isOverBalance ? 'border-error-alert focus:border-error-alert' : 'border-outline-variant focus:border-primary'}`}
              />
            </div>
            {isOverBalance && <p className="text-error-alert font-body-sm mt-1">Amount exceeds available balance.</p>}
            {isUnderMin && <p className="text-error-alert font-body-sm mt-1">Minimum withdrawal amount is 100 coins.</p>}
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body-sm text-on-surface-variant">Conversion Rate</span>
              <span className="font-data-md text-data-md text-on-surface-variant">
                {loadingLocation ? '...' : `1 CMP = ${activeRate.symbol}${activeRate.ratePerCmp} ${activeRate.code}`}
              </span>
            </div>
            <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3">
              <span className="font-body-md text-on-surface">You will receive:</span>
              <div className="text-right">
                <span className="font-data-lg text-data-lg text-primary block">
                  {loadingLocation ? '...' : formatFiat(parsedCoins)}
                </span>
                <span className="font-label-caps text-label-caps text-success-verified mt-1 block">No hidden fees</span>
              </div>
            </div>
          </div>

          {accountsLoaded && !hasAccounts && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
              <p className="font-body-sm text-on-surface-variant mb-2">No settlement account set up.</p>
              <button
                type="button"
                onClick={() => router.push('/wallet/withdraw/bank?add=true')}
                className="text-primary font-semibold underline underline-offset-4"
              >
                Add a settlement account to withdraw
              </button>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!isValid || !accountsLoaded}
              className="w-full bg-primary text-on-primary font-body-lg text-body-lg font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/wallet" className="text-primary hover:text-on-primary-fixed-variant font-body-sm underline transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/wallet/withdraw/bank/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWithdrawStore, SettlementAccount } from '@/stores/withdrawStore';
import { useUserStore } from '@/stores/userStore';

export default function WithdrawBankPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { amountCoins, selectedAccount, setSelectedAccount } = useWithdrawStore();
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<SettlementAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams?.get('add') === 'true');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<'NGN_BANK' | 'CRYPTO'>('NGN_BANK');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [network, setNetwork] = useState('');

  useEffect(() => {
    if (amountCoins <= 0 && !showForm) {
      router.replace('/wallet/withdraw');
    }
    loadAccounts();
  }, [amountCoins, router]);

  const loadAccounts = async () => {
    const { data } = await supabase
      .from('settlement_accounts')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    setAccounts((data as SettlementAccount[]) || []);
    setLoading(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setType('NGN_BANK');
    setAccountName('');
    setAccountNumber('');
    setBankName('');
    setNetwork('');
  };

  const handleEdit = (acc: SettlementAccount) => {
    setEditingId(acc.id);
    setShowForm(true);
    setType(acc.type as 'NGN_BANK' | 'CRYPTO');
    setAccountName(acc.account_name);
    setAccountNumber(acc.account_number);
    setBankName(acc.bank_name || '');
    setNetwork(acc.network || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountNumber.trim()) return;
    if (!user) return;

    const payload = {
      user_id: user.id,
      type,
      account_name: accountName.trim(),
      account_number: accountNumber.trim(),
      bank_name: type === 'NGN_BANK' ? bankName.trim() || null : null,
      network: type === 'CRYPTO' ? network.trim() || null : null,
    };

    if (editingId) {
      await supabase.from('settlement_accounts').update(payload).eq('id', editingId);
    } else {
      await supabase.from('settlement_accounts').insert(payload);
    }

    resetForm();
    loadAccounts();
  };

  const handleDelete = async (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (selectedAccount?.id === id) setSelectedAccount(null);
    await supabase.from('settlement_accounts').delete().eq('id', id);
    loadAccounts();
  };

  const handleSetDefault = async (id: string) => {
    await supabase.from('settlement_accounts').update({ is_default: true }).eq('id', id);
    await supabase.from('settlement_accounts').update({ is_default: false }).neq('id', id).eq('user_id', user?.id);
    loadAccounts();
  };

  const handleContinue = () => {
    if (selectedAccount) {
      router.push('/wallet/withdraw/confirm');
    }
  };

  const fiatAmount = amountCoins * 10.50;
  const processingFee = fiatAmount * 0.015;
  const finalAmount = fiatAmount - processingFee;

  return (
    <main className="flex-1 flex items-center justify-center pb-24 md:pb-12 px-margin-mobile min-h-[calc(100vh-80px)]">
      <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 w-full max-w-lg shadow-sm border border-outline-variant/30 mt-4">
        <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
          <Link href="/wallet/withdraw" className="material-symbols-outlined hover:text-primary-container transition-colors">arrow_back</Link>
          <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">
            {showForm ? (editingId ? 'EDIT ACCOUNT' : 'ADD ACCOUNT') : 'STEP 2 OF 3'}
          </div>
          <button onClick={resetForm} className="material-symbols-outlined hover:text-primary transition-colors text-transparent pointer-events-none">close</button>
        </div>

        <div className="w-full flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-success-verified">Amount</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-data-md text-data-md shadow-sm ${showForm ? 'bg-surface-variant text-outline' : 'bg-primary text-on-primary border-[1.5px] border-[#B8860B]'}`}>
              {showForm ? <span className="material-symbols-outlined text-sm">add</span> : '2'}
            </div>
            <span className="font-label-caps text-label-caps text-on-surface">Account</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">3</div>
            <span className="font-label-caps text-label-caps text-outline">Confirm</span>
          </div>
        </div>

        {showForm ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('NGN_BANK')}
                  className={`py-3 rounded-lg border-2 text-center transition-all ${type === 'NGN_BANK' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-lg block mx-auto">account_balance</span>
                  NGN Bank
                </button>
                <button
                  type="button"
                  onClick={() => setType('CRYPTO')}
                  className={`py-3 rounded-lg border-2 text-center transition-all ${type === 'CRYPTO' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-lg block mx-auto">currency_bitcoin</span>
                  Crypto Wallet
                </button>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface mb-2">Account Name</label>
              <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface mb-2">
                {type === 'NGN_BANK' ? 'Account Number' : 'Wallet Address'}
              </label>
              <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder={type === 'NGN_BANK' ? '0123456789' : '0x... or bc1...'} className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
            </div>

            {type === 'NGN_BANK' && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface mb-2">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. GTBank" className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
              </div>
            )}

            {type === 'CRYPTO' && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface mb-2">Network</label>
                <input type="text" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="e.g. ERC20, TRC20, BEP20" className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-variant/50 transition-colors">Cancel</button>
              <button type="submit" className="flex-[2] py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors">
                {editingId ? 'Update Account' : 'Save Account'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="font-h3 text-h3 text-on-surface mb-6">Settlement Account</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <span className="material-symbols-outlined text-4xl text-outline block">account_balance_wallet</span>
                <p className="text-on-surface-variant font-body-sm">No settlement accounts yet. Add one to withdraw.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAccount?.id === acc.id ? 'border-[#B8860B] bg-primary/5' : 'border-outline-variant/50 hover:border-outline'}`}
                    onClick={() => setSelectedAccount(acc)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${acc.type === 'NGN_BANK' ? 'bg-[#E5F3FF] text-primary' : 'bg-[#FFF3E0] text-secondary'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {acc.type === 'NGN_BANK' ? 'account_balance' : 'currency_bitcoin'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-body-md text-body-md font-semibold text-on-surface truncate">{acc.account_name}</div>
                        <div className="font-data-md text-data-md text-on-surface-variant">
                          {acc.type === 'NGN_BANK' ? `${acc.bank_name || 'Bank'} • ${acc.account_number}` : `${acc.network || 'Crypto'} • ${acc.account_number.slice(0, 8)}...`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {acc.is_default && <span className="text-label-caps text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">DEFAULT</span>}
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(acc); }} className="text-outline hover:text-primary p-1">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(acc.id); }} className="text-outline hover:text-error-alert p-1">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                    {!acc.is_default && (
                      <button onClick={(e) => { e.stopPropagation(); handleSetDefault(acc.id); }} className="text-label-caps text-[11px] text-outline hover:text-primary mt-2 underline underline-offset-2">
                        Set as default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all font-semibold mb-8"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Settlement Account
            </button>

            {selectedAccount && (
              <div className="border-t border-outline-variant/30 pt-6 w-full">
                <h3 className="font-body-sm text-body-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">Withdrawal Summary</h3>
                <div className="space-y-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Amount</span>
                    <div className="flex items-center gap-2">
                      <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
                      <span className="font-data-md text-data-md text-on-surface">{amountCoins.toLocaleString()} CMP</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Exchange Rate</span>
                    <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Processing Fee (1.5%)</span>
                    <span className="font-data-md text-data-md text-error-alert">- ₦{processingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-outline-variant/50 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">You will receive</span>
                      <span className="font-data-lg text-data-lg text-success-verified">₦{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Link href="/wallet/withdraw" className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface font-body-md text-body-md font-semibold hover:bg-surface-variant/50 transition-colors text-center">Back</Link>
              <button
                onClick={handleContinue}
                disabled={!selectedAccount}
                className="flex-[2] py-3 px-4 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            <div className="flex items-start gap-3 text-on-surface-variant opacity-80 px-4 mt-8 w-full">
              <span className="material-symbols-outlined text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="font-body-sm text-body-sm">Funds are withheld immediately upon request and held until the withdrawal is processed or rejected.</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/wallet/withdraw/confirm/page.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWithdrawStore } from '@/stores/withdrawStore';
import { useWallet } from '@/lib/useWallet';
import { useCurrency } from '@/lib/useCurrency';

export default function WithdrawConfirmPage() {
  const router = useRouter();
  const { amountCoins, selectedAccount, setTransactionId, reset } = useWithdrawStore();
  const { wallet } = useWallet();
  const { activeRate, formatFiat, loadingLocation } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (amountCoins <= 0 || !selectedAccount) {
      router.replace('/wallet/withdraw');
    }
  }, [amountCoins, selectedAccount, router]);

  const fiatAmount = amountCoins * 10.50;
  const processingFee = fiatAmount * 0.015;
  const finalAmount = fiatAmount - processingFee;

  const handleConfirm = async () => {
    if (!wallet || !selectedAccount) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const accountDetails = {
        account_id: selectedAccount.id,
        type: selectedAccount.type,
        account_name: selectedAccount.account_name,
        account_number: selectedAccount.account_number,
        bank_name: selectedAccount.bank_name,
        network: selectedAccount.network,
      };

      const { data: requestId, error } = await supabase.rpc('request_withdrawal', {
        p_user_id: user.id,
        p_wallet_id: wallet.id,
        p_coin_amount: amountCoins,
        p_fiat_amount: finalAmount.toFixed(2),
        p_account_details: accountDetails,
      });

      if (error) throw new Error(error.message);

      setTransactionId(requestId as string);
      setIsSuccess(true);

      setTimeout(() => {
        reset();
        router.push('/wallet/receipt');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center pb-24 md:pb-12 px-margin-mobile min-h-[calc(100vh-80px)]">
      <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 w-full max-w-lg shadow-sm border border-outline-variant/30 mt-4">
        <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
          <Link href="/wallet/withdraw/bank" className="material-symbols-outlined hover:text-primary-container transition-colors">arrow_back</Link>
          <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">STEP 3 OF 3</div>
          <div className="w-6"></div>
        </div>

        <div className="w-full flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-success-verified">Amount</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-success-verified">Account</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-[#B8860B]">3</div>
            <span className="font-label-caps text-label-caps text-on-surface">Confirm</span>
          </div>
        </div>

        <div className="bg-primary-container/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
        </div>

        <h1 className="font-h3 text-h3 text-on-surface text-center mb-2">Confirm Withdrawal</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-8">
          Review the details before submitting your request.
        </p>

        {errorMsg && (
          <p className="font-body-sm text-error-alert text-center mb-4 bg-error/10 py-2 px-4 rounded-lg">{errorMsg}</p>
        )}

        <div className="space-y-4 mb-8">
          <div className="bg-surface-alt rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Amount</span>
              <div className="flex items-center gap-2">
                <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
                <span className="font-data-md text-data-md text-on-surface font-semibold">{amountCoins.toLocaleString()} CMP</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Exchange Rate</span>
              <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Fee (1.5%)</span>
              <span className="font-data-md text-data-md text-error-alert">- ₦{processingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed border-outline-variant/50 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md font-semibold text-on-surface">You will receive</span>
                <span className="font-data-lg text-data-lg text-success-verified font-bold">₦{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-alt rounded-lg p-4">
            <div className="font-body-sm text-body-sm text-on-surface-variant mb-2">Destination Account</div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedAccount?.type === 'NGN_BANK' ? 'bg-[#E5F3FF] text-primary' : 'bg-[#FFF3E0] text-secondary'}`}>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {selectedAccount?.type === 'NGN_BANK' ? 'account_balance' : 'currency_bitcoin'}
                </span>
              </div>
              <div>
                <div className="font-body-md text-body-md font-semibold text-on-surface">{selectedAccount?.account_name}</div>
                <div className="font-data-md text-data-md text-on-surface-variant">
                  {selectedAccount?.type === 'NGN_BANK'
                    ? `${selectedAccount.bank_name} • ${selectedAccount.account_number}`
                    : `${selectedAccount?.network} • ${selectedAccount?.account_number?.slice(0, 8)}...`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-8 flex items-start gap-3">
          <span className="material-symbols-outlined text-warning text-lg">info</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {amountCoins.toLocaleString()} CMP will be withheld from your wallet immediately. If rejected, the full amount will be returned.
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isLoading || isSuccess}
          className={`w-full font-body-md text-body-md font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 ${
            isSuccess
              ? 'bg-success-verified text-white'
              : 'bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isSuccess ? (
            <>Request Submitted <span className="material-symbols-outlined">check_circle</span></>
          ) : isLoading ? (
            <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
          ) : (
            <>Submit Withdrawal Request</>
          )}
        </button>

        {!isSuccess && (
          <Link href="/wallet/withdraw/bank" className="block text-center mt-4 font-body-sm text-body-sm text-primary hover:underline underline-offset-4">
            Change account
          </Link>
        )}
      </div>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/wallet/receipt/page.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWithdrawStore } from '@/stores/withdrawStore';

export default function TransactionReceiptPage() {
  const router = useRouter();
  const { amountCoins, selectedAccount, transactionId, reset } = useWithdrawStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    reset();
    router.push('/dashboard');
  };

  if (!mounted) return null;

  const fiatAmount = amountCoins * 10.50;
  const processingFee = fiatAmount * 0.015;
  const finalAmount = fiatAmount - processingFee;

  return (
    <div className="flex-1 bg-surface-container-low min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-gutter md:p-margin-desktop">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-primary-container/5 pointer-events-none -z-10"></div>
      <div className="absolute right-[-10%] top-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-2xl bg-surface-alt rounded-2xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant/20 flex flex-col items-center gap-8 mt-8 mb-24 md:mb-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

        <div className="flex flex-col items-center gap-4 text-center mt-4">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center shadow-lg border-2 border-surface-alt z-10 relative">
            <span className="material-symbols-outlined text-4xl text-warning font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
            <div className="absolute inset-0 rounded-full animate-ping bg-warning/20 opacity-20"></div>
          </div>
          <div className="space-y-1">
            <p className="font-body-md text-body-md text-on-surface-variant uppercase tracking-wider">Withdrawal Submitted</p>
            <h2 className="font-data-lg text-[40px] leading-none text-primary font-bold tracking-tight">
              ₦{finalAmount.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="w-full h-px bg-outline-variant/30 flex items-center justify-center relative my-2">
          <div className="absolute w-8 h-px bg-secondary left-1/2 -translate-x-1/2"></div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Status</span>
            <span className="font-body-sm text-body-sm font-semibold text-warning flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Pending
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Reference ID</span>
            <div className="flex items-center gap-2">
              <span className="font-data-md text-data-md text-on-surface">
                {transactionId ? transactionId.substring(0, 13).toUpperCase() : 'TXN-PENDING'}
              </span>
              <button className="text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Date &amp; Time</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              {new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Source</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-2">
              <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
              CMP Coins
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Destination</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">account_balance</span>
              {selectedAccount?.account_name || 'Settlement Account'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Amount Withheld</span>
            <span className="font-data-md text-data-md text-error-alert font-semibold">-{amountCoins.toLocaleString()} CMP</span>
          </div>
        </div>

        <div className="w-full bg-surface-container rounded-xl p-4 border border-outline-variant/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Conversion Rate</span>
            <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Coins Withheld</span>
            <span className="font-data-md text-data-md text-error-alert font-bold">-{amountCoins.toLocaleString()} CMP</span>
          </div>
          <div className="w-full h-px bg-outline-variant/20 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Fee</span>
            <span className="font-data-md text-data-md text-on-surface">₦{processingFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 w-full flex items-start gap-3">
          <span className="material-symbols-outlined text-warning text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <p className="font-body-sm text-body-sm text-on-surface font-semibold">Pending Confirmation</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Your withdrawal is being processed. The coins will be released once confirmed. If rejected, the full amount will be returned to your wallet.</p>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/wallet" className="flex-1 bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-body-md text-body-md font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 text-center">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            Back to Wallet
          </Link>
          <button className="flex-1 bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-body-md text-body-md font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Download Receipt
          </button>
        </div>

        <button onClick={handleReturn} className="font-body-sm text-body-sm text-outline hover:text-primary transition-colors mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
```
---



## Tasks Pages


### File: apps/web/app/(app)/tasks/page.tsx

```tsx
'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTasks, useDailyTasks, useCompleteTask, usePostedTasks, useCompletePostedTask } from '@/lib/hooks';
import { api } from '@/lib/api';
import { usePlayer } from '@/components/music/PlayerProvider';

interface ProofModalState {
  isOpen: boolean;
  task: any | null;
}

function ProofSubmissionModal({ task, onClose, onSubmit }: { task: any; onClose: () => void; onSubmit: (proofData: any) => void }) {
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requirements = task.social_requirements || task.socialRequirements || {};
  const platform = requirements.platform || '';
  const actions = requirements.actions || [];
  const targetUrl = requirements.targetUrl || '';
  const requiresScreenshot = requirements.requiresScreenshot || false;
  const needsActionUrl = task.type === 'SHARE_SOCIAL';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Max 10MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files allowed.');
      return;
    }

    setUploadError('');
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview('');
    setScreenshotUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const proofData: any = {};
      proofData.platform = platform || task.type;
      proofData.submittedAt = new Date().toISOString();

      if (requiresScreenshot && screenshotFile) {
        setIsUploading(true);
        const uploadedUrl = await api.uploadProofScreenshot(screenshotFile);
        proofData.screenshot = uploadedUrl;
        setIsUploading(false);
      } else if (screenshotUrl.trim()) {
        proofData.screenshot = screenshotUrl.trim();
      }

      if (actionUrl.trim()) proofData.actionUrl = actionUrl.trim();
      if (comment.trim()) proofData.comment = comment.trim();

      await onSubmit(proofData);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Try pasting a URL instead.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const platformLabel: Record<string, string> = {
    twitter: 'Twitter/X',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };

  const canSubmit = !isSubmitting && !isUploading && (
    !requiresScreenshot || screenshotPreview || screenshotUrl.trim()
  ) && (
    !needsActionUrl || actionUrl.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-h3 text-h3 text-on-surface">Submit Proof</h2>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="bg-surface-container rounded-xl p-4 mb-6">
            <h3 className="font-body-md text-body-md font-semibold text-on-surface mb-1">{task.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{task.description}</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B] text-sm">generating_tokens</span>
              <span className="font-data-md text-data-md text-primary">{task.coinReward || task.coin_per_participant} coins</span>
            </div>
          </div>

          {targetUrl && (
            <div className="mb-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Target URL</label>
              <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="font-body-md text-body-md text-secondary hover:underline flex items-center gap-1 break-all">
                {targetUrl}
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          )}

          {actions.length > 0 && (
            <div className="mb-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Required Actions</label>
              <div className="flex flex-wrap gap-2">
                {actions.map((action: string) => (
                  <span key={action} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-caps text-label-caps">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}

          {platform && (
            <div className="mb-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 block">Platform</label>
              <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-label-caps text-label-caps">
                {platformLabel[platform] || platform}
              </span>
            </div>
          )}

          {needsActionUrl && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-1 block">
                Link to your {platformLabel[platform] || 'action'} *
              </label>
              <input
                type="url"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder={platform === 'twitter' ? 'https://x.com/username/status/...' : 'https://...'}
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Provide the direct link to your {actions.includes('like') ? 'like' : actions.includes('comment') ? 'comment' : actions.includes('share') ? 'share/post' : 'action'}
              </p>
            </div>
          )}

          {(requiresScreenshot || !needsActionUrl) && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-2 block">
                Screenshot Proof {requiresScreenshot ? '*' : '(optional)'}
              </label>

              {screenshotPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-outline-variant/30 mb-2">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={removeScreenshot}
                    className="absolute top-2 right-2 bg-surface-container-high/80 rounded-full p-1 text-on-surface-variant hover:text-error-alert"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant rounded-lg p-8 text-center cursor-pointer hover:border-secondary hover:bg-secondary-container/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">cloud_upload</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Click to upload screenshot</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex items-center gap-4 mt-3">
                <div className="flex-1 border-t border-outline-variant/30" />
                <span className="font-label-caps text-label-caps text-on-surface-variant">OR</span>
                <div className="flex-1 border-t border-outline-variant/30" />
              </div>

              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => { setScreenshotUrl(e.target.value); if (e.target.value.trim()) { setScreenshotFile(null); setScreenshotPreview(''); } }}
                placeholder="Paste image URL instead..."
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none mt-3"
              />

              {uploadError && (
                <p className="font-body-sm text-body-sm text-error-alert mt-1">{uploadError}</p>
              )}
              {isUploading && (
                <p className="font-body-sm text-body-sm text-secondary mt-1 animate-pulse">Uploading screenshot...</p>
              )}
            </div>
          )}

          {!needsActionUrl && !requiresScreenshot && (
            <div className="mb-4">
              <label className="font-body-sm text-body-sm text-on-surface font-medium mb-1 block">
                Any additional comments (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any notes about completing this task..."
                rows={3}
                className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none resize-none"
              />
            </div>
          )}

          <div className="bg-tertiary-container/20 rounded-xl p-3 mb-6 flex items-start gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container text-sm mt-0.5">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Coins will be credited after the task creator approves your submission. Auto-approved after 24 hours if no action is taken.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-body-md text-body-md bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 py-3 rounded-lg font-body-md text-body-md bg-[#B8860B] text-primary hover:bg-[#8B6914] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : isSubmitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  <span>Submit Proof</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TASK_TYPES_MAP: Record<string, string> = {
  'WATCH_VIDEO': 'Watch Video',
  'SHARE_SOCIAL': 'Share on Social',
  'SOCIAL_ENGAGEMENT': 'Social Engagement',
  'COMPLETE_SURVEY': 'Complete Survey',
  'APP_DOWNLOAD': 'App Download',
  'VOTE': 'Vote/Poll',
  'STREAM_MUSIC': 'Stream Music',
};

const formatTaskType = (typeOrCategory: string) => {
  if (!typeOrCategory) return 'Other';
  if (TASK_TYPES_MAP[typeOrCategory]) return TASK_TYPES_MAP[typeOrCategory];
  if (typeOrCategory === 'USER_CREATED') return 'Other';
  return typeOrCategory.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

export default function EarnMarketplacePage() {
  const router = useRouter();
  const { play } = usePlayer();
  const { data: resp, isLoading: systemTasksLoading } = useTasks();
  const { data: dailyResp } = useDailyTasks();
  const { data: postedResp, isLoading: postedTasksLoading } = usePostedTasks();
  const completeTask = useCompleteTask();
  const completePostedTask = useCompletePostedTask();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [proofModal, setProofModal] = useState<ProofModalState>({ isOpen: false, task: null });

  const allTasks = useMemo(() => {
    const sysTasks = resp?.tasks?.map((t: any) => ({
      ...t,
      displayCategory: formatTaskType(t.type || t.category),
    })) ?? [];
    
    const pTasks = postedResp?.tasks?.map((t: any) => ({
      ...t,
      isPostedTask: true,
      coinReward: t.coin_per_participant || t.coinPerParticipant,
      displayCategory: formatTaskType(t.type),
      current_participants: t.currentParticipants || t.current_participants,
      participant_threshold: t.participantThreshold || t.participant_threshold,
    })) ?? [];

    const uniqueMap = new Map();
    sysTasks.forEach((t: any) => uniqueMap.set(t.id, t));
    pTasks.forEach((t: any) => uniqueMap.set(t.id, t));
    
    // Sort tasks logically or just return the values
    return Array.from(uniqueMap.values());
  }, [resp, postedResp]);

  const dailyTasks = dailyResp?.tasks ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach((t: any) => t.displayCategory && set.add(t.displayCategory));
    return ['All', ...Array.from(set)];
  }, [allTasks]);

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return allTasks;
    return allTasks.filter((t: any) => t.displayCategory === activeCategory);
  }, [allTasks, activeCategory]);

  const dailyStatusMap = useMemo(() => {
    const map = new Map<string, any>();
    dailyTasks.forEach((t: any) => map.set(t.id, t));
    return map;
  }, [dailyTasks]);

  const handleStartTask = async (task: any) => {
    const isMusicTask = task.type === 'STREAM_MUSIC' || 
                        task.category === 'STREAM_MUSIC' || 
                        task.category?.toLowerCase() === 'music' || 
                        task.title?.toLowerCase().includes('stream music') || 
                        task.title?.toLowerCase().includes('play song');

    if (isMusicTask) {
      if (task.isPostedTask && task.status === 'PENDING') {
        alert('This task is pending activation by its creator');
        return;
      }
      
      const songId = task.songId || task.song_id || '';
      const audioUrl = task.audioUrl || task.audio_url || '';
      const coverUrl = task.coverImageUrl || task.cover_image_url || '';
      const coinReward = task.coinReward || task.coin_per_participant || 0;
      
      const isDownloadEnabled = task.isDownloadEnabled || task.is_download_enabled || false;
      
      play({
        id: songId || 'temp-task-song',
        artist_id: 'task-creator',
        title: task.title || 'Stream Task Track',
        slug: 'task-track',
        description: 'Stream to earn coins',
        audio_url: audioUrl,
        cover_url: coverUrl || null,
        duration_seconds: task.duration_seconds || 180,
        genre: null,
        coin_reward: coinReward,
        play_count: 0,
        is_featured: false,
        is_download_enabled: isDownloadEnabled,
        artist: {
          id: 'creator',
          stage_name: 'Task Artist',
          slug: 'task-artist',
          avatar_url: null,
          is_verified: false
        }
      }, [], {
        id: task.id,
        isPosted: task.isPostedTask,
        coinReward: coinReward
      });
      
      router.push('/music');
      return;
    }

    // Handle user-posted tasks - open proof modal
    if (task.isPostedTask) {
      if (task.status === 'PENDING') {
        alert('This task is pending activation by its creator');
        return;
      }
      setProofModal({ isOpen: true, task });
      return;
    }

    // Handle system tasks
    const dailyInfo = dailyStatusMap.get(task.id);
    if (dailyInfo?.linkedArticle?.slug) {
      window.location.href = `/tasks/article/${dailyInfo.linkedArticle.slug}`;
      return;
    }
    if (task.linkedArticle?.slug) {
      window.location.href = `/tasks/article/${task.linkedArticle.slug}`;
      return;
    }
    if (!dailyInfo?.isLocked && !dailyInfo?.canComplete === false) {
      try {
        await completeTask.mutateAsync({ taskId: task.id, adWatched: task.requiresAdGate });
      } catch {}
    }
  };

  const handleSubmitProof = useCallback(async (proofData: any) => {
    if (!proofModal.task) return;
    try {
      const result = await completePostedTask.mutateAsync({ id: proofModal.task.id, proofData });
      setProofModal({ isOpen: false, task: null });
      alert(result.message || 'Proof submitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit proof');
    }
  }, [proofModal.task, completePostedTask]);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full overflow-x-hidden">
      <div className="mb-10 mt-6 lg:mt-0 flex flex-col md:flex-row md:items-start justify-between gap-6">

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/tasks/post"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B8860B] text-primary hover:bg-[#8B6914] rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add_task</span>
            Post a Task
          </Link>
          <Link 
            href="/tasks/posted"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-alt text-on-surface hover:bg-surface-dim rounded-xl font-body-md text-body-md font-semibold transition-colors shadow-sm border border-outline-variant/30 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">list_alt</span>
            My Tasks
          </Link>

        </div>
      </div>

      <div className="flex flex-wrap pb-4 mb-8 gap-4 border-b border-outline-variant/30 w-full">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-body-md text-body-md transition-colors border ${
              activeCategory === category
                ? 'bg-primary text-on-primary shadow-sm border-transparent'
                : 'bg-surface-alt text-on-surface-variant hover:bg-surface-dim border-outline-variant/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {(systemTasksLoading || postedTasksLoading) ? (
           Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-surface-alt rounded-xl p-6 h-[280px] animate-pulse border border-outline-variant/20" />
           ))
        ) : filteredTasks.length === 0 ? (
           <div className="col-span-full py-12 text-center text-on-surface-variant">
             No tasks available in this category.
           </div>
        ) : (
          filteredTasks.map((task: any) => {
            const isPostedTask = task.isPostedTask;
            const isPremium = task.coinReward >= 100;
            const dailyInfo = dailyStatusMap.get(task.id);
            const isPending = isPostedTask && task.status === 'PENDING';
            const isLocked = isPostedTask 
              ? (task.completedToday > 0) || (task.current_participants >= task.participant_threshold) || isPending
              : (dailyInfo?.isLocked ?? false);
            const completedToday = isPostedTask ? (task.completedToday ?? 0) : (dailyInfo?.completedToday ?? 0);
            const dailyLimit = task.dailyLimit ?? dailyInfo?.dailyLimit ?? 1;
            const isCompleting = (isPostedTask ? completePostedTask : completeTask).isPending;
            const hasLinkedArticle = task.linkedArticle || dailyInfo?.linkedArticle;
            const isUserTask = isPostedTask;
            
            return (
              <div 
                key={task.id} 
                className={`bg-surface-alt rounded-xl p-6 flex flex-col h-full relative overflow-hidden group transition-colors ${
                  isLocked
                    ? 'opacity-60 border border-outline-variant/10'
                    : isPremium 
                      ? 'border-2 border-[#B8860B]' 
                      : 'border border-outline-variant/20 hover:border-outline-variant/50'
                }`}
              >
                {isPremium && !isLocked && (
                  <div className="absolute top-0 right-0 bg-[#B8860B] text-primary font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">
                    PREMIUM
                  </div>
                )}
                
                {isLocked && (
                  <div className="absolute top-0 right-0 bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps px-3 py-1 rounded-bl-lg">
                    DONE
                  </div>
                )}
                
                <div className={`flex items-start justify-between mb-4 ${isPremium && !isLocked && !isUserTask ? 'mt-2' : ''}`}>
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
                      {isUserTask ? 'person_add' : (task.category === 'COMPLETE_SURVEY' ? 'poll' : task.category === 'SHARE_SOCIAL' ? 'share' : task.category === 'CONTENT' ? 'article' : 'quickreply')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-[#B8860B] bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-[#B8860B]" style={{ fontSize: '16px' }}>generating_tokens</span>
                    <span className="font-data-md text-data-md text-primary">{task.coinReward}</span>
                  </div>
                </div>
                
                <h3 className="font-h3 text-h3 text-primary mb-2">{task.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-2">
                  {task.description || 'Complete this task to earn coins and boost your creative capital.'}
                </p>

                {isUserTask ? (
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">
                    {task.current_participants}/{task.participant_threshold} participants • {task.participant_threshold - task.current_participants} slots left
                    {isPending && ' • Pending Activation'}
                  </p>
                ) : !isLocked ? (
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">
                    {task.requiresAdGate && 'Ad-gated • '}{completedToday}/{dailyLimit} today
                  </p>
                ) : null}
                
                <button 
                  onClick={() => handleStartTask(task)}
                  disabled={isLocked || isCompleting}
                  className={`w-full py-3 rounded-lg font-body-md text-body-md transition-colors flex items-center justify-center gap-2 ${
                    isLocked
                      ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                      : isCompleting
                        ? 'bg-surface-container-high text-on-surface-variant animate-pulse'
                        : isUserTask
                          ? 'bg-secondary text-on-secondary hover:bg-secondary-container'
                          : isPremium
                            ? 'bg-primary text-on-primary hover:bg-on-surface-variant'
                            : 'bg-[#B8860B] text-primary hover:bg-[#8B6914]'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <span>{isPending ? 'Pending' : completedToday > 0 ? 'Claimed' : isUserTask ? 'Full' : 'Completed'}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{isPending ? 'pending' : 'check_circle'}</span>
                    </>
                  ) : isUserTask ? (
                    <>
                      <span>Earn {task.coinReward} Coins</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </>
                  ) : hasLinkedArticle ? (
                    <>
                      <span>Read Article</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </>
                  ) : isCompleting ? (
                    <span>Completing...</span>
                  ) : (
                    <>
                      <span>{isPremium ? 'Start Premium Task' : 'Start Task'}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {isPremium ? 'lock_open' : 'arrow_forward'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {proofModal.isOpen && proofModal.task && (
        <ProofSubmissionModal
          task={proofModal.task}
          onClose={() => setProofModal({ isOpen: false, task: null })}
          onSubmit={handleSubmitProof}
        />
      )}
    </main>
  );
}
```
---


### File: apps/web/app/(app)/tasks/streak/page.tsx

```tsx
'use client';

import Link from 'next/link';
import { useStreak, useDailyTasks, useBuyStreakFreeze } from '@/lib/hooks';

function buildWeekDays(dailyHistory: { date: string; completed: boolean }[]) {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const jsDay = today.getDay();
  const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;

  return dayLabels.map((label, index) => {
    const isMilestoneDay = index === 6;
    const isToday = index === mondayBasedToday;
    const isCompleted = dailyHistory[index]?.completed ?? false;

    return {
      day: label,
      completed: isCompleted && !isToday,
      current: isToday,
      milestone: isMilestoneDay && !isCompleted && !isToday,
      reward: isMilestoneDay ? null : 50,
    };
  });
}

const MILESTONES = [
  { days: 7, reward: 2000, label: '7 Day Streak', icon: 'calendar_view_week' },
  { days: 30, reward: 10000, label: '30 Day Streak', icon: 'calendar_month', page: '/tasks/milestone/30' },
  { days: 60, reward: 25000, label: '60 Day Titan', icon: 'military_tech', page: '/tasks/milestone/60' },
];

export default function StreakPage() {
  const { data: streakResp, isLoading: streakLoading } = useStreak();
  const { data: dailyResp, isLoading: tasksLoading } = useDailyTasks();
  const buyFreeze = useBuyStreakFreeze();

  const streak = streakResp?.streak;
  const dailyTasks = dailyResp?.tasks ?? [];

  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const freezesOwned = streak?.freezesOwned ?? 0;
  const tasksCompletedToday = streak?.tasksCompletedToday ?? 0;

  const weekDays = buildWeekDays(streak?.dailyHistory ?? []);
  const daysCompletedThisWeek = weekDays.filter(d => d.completed).length;
  const jsDay = new Date().getDay();
  const mondayBasedToday = jsDay === 0 ? 6 : jsDay - 1;
  const dayOfWeek = mondayBasedToday + 1;

  const progressPercent = Math.round((daysCompletedThisWeek / 7) * 100);

  function getMilestoneStatus(milestoneDays: number) {
    if (currentStreak >= milestoneDays) return 'completed';
    return 'locked';
  }

  function getMilestoneDaysLeft(milestoneDays: number) {
    const left = milestoneDays - currentStreak;
    return left > 0 ? left : 0;
  }

  const dailyTasksForDisplay = dailyTasks;
  const completedCount = dailyTasksForDisplay.filter((t: any) => t.completedToday > 0).length;

  const handleBuyFreeze = async () => {
    try {
      await buyFreeze.mutateAsync();
    } catch {}
  };

  return (
    <div className="flex-1 w-full pb-24 lg:pb-8 min-h-screen">
      <section className="bg-primary-container text-on-primary w-full px-margin-mobile md:px-margin-desktop py-12 lg:py-16 relative overflow-hidden mb-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-label-caps text-label-caps text-secondary-fixed mb-2 tracking-widest uppercase">Your Progress</p>
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary mb-2">Daily Streak</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">Keep the momentum going. Complete daily tasks to build your streak and unlock exclusive rewards.</p>
            </div>
            <div className="flex items-center bg-surface-tint/30 backdrop-blur-sm rounded-xl p-4 border border-outline/20">
              <span className="material-symbols-outlined text-secondary-fixed text-4xl mr-4" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <div>
                <p className="font-label-caps text-label-caps text-on-primary-container uppercase">Current Streak</p>
                {streakLoading ? (
                  <div className="h-8 w-20 bg-on-primary-fixed-variant/20 animate-pulse rounded mt-1" />
                ) : (
                  <p className="font-h2 text-h2 text-secondary-fixed">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto space-y-8 px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-6 border border-outline-variant/30 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">This Week</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Day {dayOfWeek} of 7</span>
            </div>
            <div className="flex justify-between items-center relative overflow-x-auto pb-4">
              <div className="absolute top-1/2 left-0 w-full min-w-[300px] h-1 bg-surface-container-high -z-10 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-[#B8860B] -z-10 -translate-y-1/2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              
              {weekDays.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-2 z-10 px-2">
                  {day.completed ? (
                    <div className="w-10 h-10 rounded-full bg-[#B8860B] flex items-center justify-center border-2 border-surface-alt shadow-sm">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                  ) : day.current ? (
                    <div className="w-12 h-12 rounded-full bg-surface-alt border-2 border-[#B8860B] flex items-center justify-center shadow-md relative">
                      <span className="material-symbols-outlined text-[#B8860B] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-alert rounded-full border border-surface-alt"></div>
                    </div>
                  ) : day.milestone ? (
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-alt flex items-center justify-center border-dashed border-[#B8860B]/50">
                      <img src="/coin.png" alt="Coin" className="w-4 h-4 object-contain opacity-50" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-surface-alt">
                      <span className="font-data-md text-data-md text-on-surface-variant text-xs">{day.reward}</span>
                    </div>
                  )}
                  <span className={`font-label-caps text-label-caps ${day.current ? 'text-on-surface font-bold' : day.completed ? 'text-on-surface-variant' : 'text-outline'}`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-alt rounded-xl p-6 border border-outline-variant/30 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="font-h3 text-h3 text-on-surface mb-6">Milestones</h3>
            <div className="space-y-4 flex-1">
              {MILESTONES.map((milestone) => {
                const status = getMilestoneStatus(milestone.days);
                const daysLeft = getMilestoneDaysLeft(milestone.days);
                const isCompleted = status === 'completed';

                const content = (
                  <div className={`flex items-center p-3 bg-surface rounded-lg border border-outline/10 transition-colors ${isCompleted ? 'hover:bg-surface-container-lowest' : 'opacity-70'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-secondary-container/20' : 'bg-surface-container-high'}`}>
                      <span className={`material-symbols-outlined ${isCompleted ? 'text-[#B8860B]' : 'text-on-surface-variant'}`} style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : undefined}>{milestone.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-md text-body-md font-semibold text-on-surface">{milestone.label}</p>
                      <p className={`font-data-md text-data-md mt-1 ${isCompleted ? 'text-secondary' : 'text-on-surface-variant'}`}>🪙 {milestone.reward.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      {isCompleted ? (
                        <span className="font-label-caps text-label-caps text-success-verified flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Done
                        </span>
                      ) : (
                        <p className="font-label-caps text-label-caps text-outline">{daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} left</p>
                      )}
                    </div>
                  </div>
                );

                return isCompleted && milestone.page ? (
                  <Link key={milestone.days} href={milestone.page}>{content}</Link>
                ) : (
                  <div key={milestone.days}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Today's Tasks</h3>
              <span className="bg-[#B8860B] text-primary font-label-caps text-label-caps px-2 py-1 rounded">
                {completedCount}/{dailyTasksForDisplay.length} Completed
              </span>
            </div>
            <div className="max-h-[220px] overflow-y-auto space-y-3">
              {tasksLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-surface animate-pulse rounded-lg" />
                ))
              ) : dailyTasksForDisplay.length === 0 ? (
                <div className="py-8 text-center text-on-surface-variant">No tasks available today.</div>
              ) : (
                dailyTasksForDisplay.map((task: any) => {
                  const isArticle = task.linkedArticle?.slug;
                  const completed = task.completedToday > 0;
                  const content = (
                    <div className={`flex items-center p-4 bg-surface rounded-lg border-l-4 ${completed ? 'border-secondary' : 'border-outline/20'}`}>
                      <div className="mr-4">
                        <span className={`material-symbols-outlined ${completed ? 'text-secondary' : 'text-outline'}`}
                          style={completed ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          {completed ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md font-semibold text-on-surface">{task.title}</p>
                      </div>
                      <span className="font-data-md text-data-md text-[#B8860B]">🪙 {task.coinReward}</span>
                    </div>
                  );
                  if (completed) return <div key={task.id}>{content}</div>;
                  if (isArticle) return <Link key={task.id} href={`/articles/${isArticle}`}>{content}</Link>;
                  return <Link key={task.id} href="/tasks">{content}</Link>;
                })
              )}
            </div>
          </div>

          <div className="bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-h3 text-h3 text-on-primary">Streak Freeze</h3>
                <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container">Missed a day? Use a freeze to protect your hard-earned streak.</p>
            </div>
            <div className="relative z-10 mt-auto bg-surface-tint/20 rounded-lg p-4 border border-outline/20">
              <div className="flex justify-between items-center mb-4">
                <span className="font-label-caps text-label-caps text-on-primary-container uppercase">Inventory</span>
                <span className="font-h3 text-h3 font-bold text-on-primary">{freezesOwned}</span>
              </div>
              <button
                onClick={handleBuyFreeze}
                disabled={buyFreeze.isPending}
                className="w-full bg-surface text-primary font-body-md text-body-md font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyFreeze.isPending ? (
                  <span>Buying...</span>
                ) : (
                  <>
                    <span>Buy for</span>
                    <span className="font-data-md text-data-md">🪙 500</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Current</p>
            <p className="font-h2 text-h2 text-primary">{currentStreak}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">days</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Best</p>
            <p className="font-h2 text-h2 text-[#B8860B]">{longestStreak}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">days</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Next Milestone</p>
            <p className="font-h2 text-h2 text-primary-container">
              {currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 60 ? 60 : '✓'}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {currentStreak >= 60 ? 'All done!' : 'days'}
            </p>
          </div>
          <div className="bg-surface-alt rounded-xl p-5 border border-outline-variant/30 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Progress</p>
            <p className="font-h2 text-h2 text-success-verified">
              {currentStreak >= 60 ? 100 : Math.round((currentStreak / 60) * 100)}%
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">to Titan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```
---


### File: apps/web/app/(app)/tasks/post/page.tsx

```tsx
'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostTask } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { uploadAudioFile, uploadCoverImage, STORAGE_BUCKETS } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

const TASK_TYPES = [
  { value: 'WATCH_VIDEO', label: 'Watch Video', icon: 'play_circle', minBudget: 2000 },
  { value: 'SHARE_SOCIAL', label: 'Share on Social', icon: 'share', minBudget: 3000 },
  { value: 'SOCIAL_ENGAGEMENT', label: 'Social Engagement', icon: 'thumb_up', minBudget: 2000 },
  { value: 'COMPLETE_SURVEY', label: 'Complete Survey', icon: 'poll', minBudget: 5000 },
  { value: 'APP_DOWNLOAD', label: 'App Download', icon: 'download', minBudget: 10000 },
  { value: 'VOTE', label: 'Vote/Poll', icon: 'how_to_vote', minBudget: 1000 },
  { value: 'STREAM_MUSIC', label: 'Stream Music', icon: 'music_note', minBudget: 5000 },
];

const SOCIAL_PLATFORMS = [
  { value: 'TWITTER', label: 'Twitter/X', logo: '/platform-logos/twitter-alt.svg', color: '#000000' },
  { value: 'INSTAGRAM', label: 'Instagram', logo: '/platform-logos/instagram.svg', color: '#E4405F' },
  { value: 'TIKTOK', label: 'TikTok', logo: '/platform-logos/tik-tok.svg', color: '#000000' },
  { value: 'YOUTUBE', label: 'YouTube', logo: '/platform-logos/youtube-circle.svg', color: '#FF0000' },
  { value: 'FACEBOOK', label: 'Facebook', logo: '/platform-logos/facebook.svg', color: '#1877F2' },
  { value: 'LINKEDIN', label: 'LinkedIn', logo: '/platform-logos/linkedin.svg', color: '#0A66C2' },
];

const SOCIAL_ACTIONS = [
  { value: 'LIKE', label: 'Like', icon: 'thumb_up' },
  { value: 'COMMENT', label: 'Comment', icon: 'comment' },
  { value: 'SHARE', label: 'Share', icon: 'share' },
  { value: 'RETWEET', label: 'Retweet/Repost', icon: 'repeat' },
  { value: 'FOLLOW', label: 'Follow', icon: 'person_add' },
  { value: 'SUBSCRIBE', label: 'Subscribe', icon: 'subscriptions' },
];

const CREATION_FEE = 500;
const MIN_COIN_PER_PARTICIPANT = 10;

export default function PostTaskPage() {
  const router = useRouter();
  const postTask = usePostTask();
  const { wallet } = useWallet();
  const coinBalance = Number(wallet?.balance ?? 0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setAuthChecked(true);
      
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/tasks/post');
      }
    };
    checkAuth();
  }, [router]);

  const [formData, setFormData] = useState({
    type: 'WATCH_VIDEO',
    participantThreshold: 100,
    totalBudget: 5000,
    // Social engagement fields
    targetUrl: '',
    commentText: '',
    minCommentLength: 10,
    requiresScreenshot: false,
    // Watch video fields
    videoUrl: '',
    minWatchTime: 30,
    // App download fields
    appStoreUrl: '',
    requiresReview: false,
    minRating: 4,
    // Survey fields
    surveyUrl: '',
    minQuestions: 5,
    // Share social fields
    sharePlatform: 'TWITTER',
    shareMessage: '',
    requiresHashtag: false,
    hashtag: '',
    // Music stream fields
    audioFile: null as File | null,
    audioUrl: '',
    coverImageFile: null as File | null,
    coverImageUrl: '',
    genre: '',
    durationSeconds: 180,
    isDownloadEnabled: false,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ audio: 0, cover: 0 });
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [coverUploaded, setCoverUploaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);

  const handleAudioFileSelected = useCallback(async (file: File) => {
    if (!isAuthenticated) {
      setErrors({ submit: 'Please sign in to upload files' });
      router.push('/login?redirect=/tasks/post');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors({ audioUrl: 'File size must be less than 50MB' });
      return;
    }
    setAudioUploaded(false);
    setFormData(prev => ({ ...prev, audioFile: file }));
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, audio: 10 }));
    setErrors(prev => ({ ...prev, audioUrl: '' }));

    const result = await uploadAudioFile(file);
    if (!result.success || !result.url) {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, audio: 0 }));
      setFormData(prev => ({ ...prev, audioFile: null, audioUrl: '' }));
      setErrors({ audioUrl: result.error || 'Failed to upload audio file' });
      return;
    }
    setUploadProgress(prev => ({ ...prev, audio: 100 }));
    setFormData(prev => ({ ...prev, audioUrl: result.url! }));
    setAudioUploaded(true);
    setUploading(false);
  }, [isAuthenticated, router]);

  const handleCoverFileSelected = useCallback(async (file: File) => {
    if (!isAuthenticated) {
      setErrors({ submit: 'Please sign in to upload files' });
      router.push('/login?redirect=/tasks/post');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ coverImageUrl: 'File size must be less than 10MB' });
      return;
    }
    setCoverUploaded(false);
    setFormData(prev => ({ ...prev, coverImageFile: file }));
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, cover: 10 }));
    setErrors(prev => ({ ...prev, coverImageUrl: '' }));

    const result = await uploadCoverImage(file);
    if (!result.success || !result.url) {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, cover: 0 }));
      setFormData(prev => ({ ...prev, coverImageFile: null, coverImageUrl: '' }));
      setErrors({ coverImageUrl: result.error || 'Failed to upload cover image' });
      return;
    }
    setUploadProgress(prev => ({ ...prev, cover: 100 }));
    setFormData(prev => ({ ...prev, coverImageUrl: result.url! }));
    setCoverUploaded(true);
    setUploading(false);
  }, [isAuthenticated, router]);

  const [selectedPlatform, setSelectedPlatform] = useState<string>('TWITTER');
  const [selectedActions, setSelectedActions] = useState<string[]>(['LIKE']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [voteTargetUrl, setVoteTargetUrl] = useState('');
  const [voteTarget, setVoteTarget] = useState('');
  const [voteContestDetails, setVoteContestDetails] = useState('');
  const [voteRequiresScreenshot, setVoteRequiresScreenshot] = useState(true);

  const coinPerParticipant = useMemo(() => {
    return Math.floor(formData.totalBudget / formData.participantThreshold);
  }, [formData.totalBudget, formData.participantThreshold]);

  const totalCost = useMemo(() => {
    return CREATION_FEE + formData.totalBudget;
  }, [formData.totalBudget]);

  const isValid = useMemo(() => {
    const baseValid = (
      coinPerParticipant >= MIN_COIN_PER_PARTICIPANT &&
      totalCost <= coinBalance
    );

    if (uploading) return false;

    if (formData.type === 'STREAM_MUSIC') {
      const hasAudio = !!formData.audioUrl || audioUploaded;
      const hasGenre = !!formData.genre;
      return baseValid && hasAudio && hasGenre;
    }

    if (formData.type === 'SOCIAL_ENGAGEMENT') {
      return baseValid && formData.targetUrl.length > 0 && selectedActions.length > 0;
    }

    if (formData.type === 'VOTE') {
      let validUrl = false;
      try {
        if (voteTargetUrl) {
          new URL(voteTargetUrl);
          validUrl = true;
        }
      } catch {}
      return baseValid && validUrl && voteTarget.trim().length > 0;
    }

    return baseValid;
  }, [formData, coinPerParticipant, totalCost, coinBalance, selectedActions, uploading, audioUploaded, voteTargetUrl, voteTarget]);

  useEffect(() => {
    const minBudget = TASK_TYPES.find(t => t.value === formData.type)?.minBudget ?? 1000;
    if (formData.totalBudget < minBudget) {
      setFormData(prev => ({ ...prev, totalBudget: minBudget }));
    }
  }, [formData.type]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAction = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  // Auto-generate title and description based on task type and selections
  const generateTitleAndDescription = useCallback((data: typeof formData) => {
    let title = '';
    let description = '';

    // Helper to safely extract hostname from URL
    const getHostname = (url: string) => {
      try {
        return url ? new URL(url).hostname : '';
      } catch {
        return '';
      }
    };

    switch (data.type) {
      case 'WATCH_VIDEO':
        title = `Watch Video: ${data.videoUrl ? getHostname(data.videoUrl) : 'Video'}`;
        description = `Watch the video for at least ${data.minWatchTime} seconds to earn ${coinPerParticipant} coins.`;
        break;
      case 'APP_DOWNLOAD':
        title = `Download App: ${data.appStoreUrl ? getHostname(data.appStoreUrl) : 'App'}`;
        description = `Download and review this app with a minimum ${data.minRating}-star rating to earn ${coinPerParticipant} coins.`;
        break;
      case 'COMPLETE_SURVEY':
        title = `Complete Survey: ${data.surveyUrl ? getHostname(data.surveyUrl) : 'Survey'}`;
        description = `Complete this survey with at least ${data.minQuestions} questions to earn ${coinPerParticipant} coins.`;
        break;
      case 'SHARE_SOCIAL':
        title = `Share on ${SOCIAL_PLATFORMS.find(p => p.value === data.sharePlatform)?.label || 'Social'}`;
        description = `Share the specified content on ${SOCIAL_PLATFORMS.find(p => p.value === data.sharePlatform)?.label || 'social media'}${data.requiresHashtag ? ` with hashtag ${data.hashtag}` : ''} to earn ${coinPerParticipant} coins.`;
        break;
      case 'SOCIAL_ENGAGEMENT':
        const platform = SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.label || 'Social';
        const actions = selectedActions.map(a => SOCIAL_ACTIONS.find(act => act.value === a)?.label).join(', ');
        title = `Engage on ${platform}: ${actions}`;
        description = `${actions} on the specified ${platform} post to earn ${coinPerParticipant} coins.${data.requiresScreenshot ? ' Screenshot required.' : ''}`;
        break;
      case 'STREAM_MUSIC':
        const audioName = data.audioFile?.name || data.genre || 'Track';
        title = `Stream Music: ${audioName}`;
        description = `Stream this ${data.genre || 'music'} track (${Math.floor(data.durationSeconds / 60)}:${(data.durationSeconds % 60).toString().padStart(2, '0')}) to earn ${coinPerParticipant} coins.${data.isDownloadEnabled ? ' Download also available.' : ''}`;
        break;
      case 'VOTE':
        title = `Vote: ${voteTarget || 'Target'}`;
        description = `Vote for ${voteTarget || 'the specified target'} on the external platform to earn ${coinPerParticipant} coins.${voteRequiresScreenshot ? ' Screenshot proof required.' : ''}`;
        break;
      default:
        title = 'Complete Task';
        description = 'Complete this task to earn coins.';
    }

    return { title, description };
  }, [selectedPlatform, selectedActions, coinPerParticipant, voteTarget, voteRequiresScreenshot]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (coinPerParticipant < MIN_COIN_PER_PARTICIPANT) {
      newErrors.budget = `Coin per participant must be at least ${MIN_COIN_PER_PARTICIPANT}`;
    }
    if (totalCost > coinBalance) {
      newErrors.balance = 'Insufficient balance';
    }

    // Task-specific validation
    switch (formData.type) {
      case 'WATCH_VIDEO':
        if (!formData.videoUrl) {
          newErrors.videoUrl = 'Video URL is required';
        } else {
          try {
            new URL(formData.videoUrl);
          } catch {
            newErrors.videoUrl = 'Please enter a valid URL (e.g., https://...)';
          }
        }
        break;
      case 'APP_DOWNLOAD':
        if (!formData.appStoreUrl) {
          newErrors.appStoreUrl = 'App Store URL is required';
        } else {
          try {
            new URL(formData.appStoreUrl);
          } catch {
            newErrors.appStoreUrl = 'Please enter a valid URL (e.g., https://...)';
          }
        }
        break;
      case 'COMPLETE_SURVEY':
        if (!formData.surveyUrl) {
          newErrors.surveyUrl = 'Survey URL is required';
        } else {
          try {
            new URL(formData.surveyUrl);
          } catch {
            newErrors.surveyUrl = 'Please enter a valid URL (e.g., https://...)';
          }
        }
        break;
      case 'SHARE_SOCIAL':
        if (!formData.shareMessage) {
          newErrors.shareMessage = 'Share message is required';
        }
        if (formData.requiresHashtag && !formData.hashtag) {
          newErrors.hashtag = 'Hashtag is required';
        }
        break;
      case 'STREAM_MUSIC':
        if (!formData.audioUrl && !formData.audioFile) {
          newErrors.audioUrl = 'Audio file is required';
        }
        if (!formData.audioUrl && formData.audioFile && !audioUploaded) {
          newErrors.audioUrl = 'Please wait for audio upload to complete';
        }
        if (!formData.genre) {
          newErrors.genre = 'Genre is required';
        }
        break;
      case 'SOCIAL_ENGAGEMENT':
        if (!formData.targetUrl) {
          newErrors.targetUrl = 'Target URL is required';
        } else {
          // Validate URL format
          try {
            new URL(formData.targetUrl);
          } catch {
            newErrors.targetUrl = 'Please enter a valid URL (e.g., https://...)';
          }
        }
        if (selectedActions.length === 0) {
          newErrors.actions = 'Select at least one action';
        }
        break;
      case 'VOTE':
        if (!voteTargetUrl) {
          newErrors.voteTargetUrl = 'Target URL is required';
        } else {
          try {
            new URL(voteTargetUrl);
          } catch {
            newErrors.voteTargetUrl = 'Please enter a valid URL (e.g., https://...)';
          }
        }
        if (!voteTarget || voteTarget.trim().length === 0) {
          newErrors.voteTarget = 'Vote Target is required';
        }
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { title, description } = generateTitleAndDescription(formData);

      const payload: any = {
        title,
        description,
        type: formData.type,
        participantThreshold: formData.participantThreshold,
        totalBudget: formData.totalBudget,
      };

      if (formData.type === 'SOCIAL_ENGAGEMENT') {
        payload.socialRequirements = {
          platform: selectedPlatform,
          actions: selectedActions,
          targetUrl: formData.targetUrl || undefined,
          commentText: formData.commentText || undefined,
          minCommentLength: formData.minCommentLength,
          requiresScreenshot: formData.requiresScreenshot,
        };
      }

      if (formData.type === 'WATCH_VIDEO') {
        let platform = 'YOUTUBE';
        try {
          const host = new URL(formData.videoUrl).hostname.toLowerCase();
          if (host.includes('tiktok')) platform = 'TIKTOK';
          else if (host.includes('instagram')) platform = 'INSTAGRAM';
          else if (host.includes('facebook')) platform = 'FACEBOOK';
          else if (host.includes('twitter') || host.includes('x.com')) platform = 'TWITTER';
        } catch (e) {}

        payload.socialRequirements = {
          platform,
          targetUrl: formData.videoUrl,
          actions: ['WATCH'],
          minWatchTime: formData.minWatchTime,
          requiresScreenshot: true,
        };
      }

      if (formData.type === 'APP_DOWNLOAD') {
        payload.socialRequirements = {
          targetUrl: formData.appStoreUrl,
          actions: ['DOWNLOAD', ...(formData.requiresReview ? ['REVIEW'] : [])],
          minRating: formData.requiresReview ? formData.minRating : undefined,
          requiresScreenshot: true,
        };
      }

      if (formData.type === 'COMPLETE_SURVEY') {
        payload.socialRequirements = {
          targetUrl: formData.surveyUrl,
          actions: ['COMPLETE_SURVEY'],
          minQuestions: formData.minQuestions,
          requiresScreenshot: true,
        };
      }

      if (formData.type === 'SHARE_SOCIAL') {
        payload.socialRequirements = {
          platform: formData.sharePlatform,
          actions: ['SHARE'],
          commentText: formData.shareMessage,
          requiresHashtag: formData.requiresHashtag,
          hashtag: formData.hashtag,
          requiresScreenshot: true,
        };
      }

      if (formData.type === 'STREAM_MUSIC') {
        payload.musicMetadata = {
          audioUrl: formData.audioUrl,
          coverImageUrl: formData.coverImageUrl || undefined,
          genre: formData.genre || undefined,
          durationSeconds: formData.durationSeconds,
          isDownloadEnabled: formData.isDownloadEnabled,
        };
      }

      if (formData.type === 'VOTE') {
        payload.voteRequirements = {
          targetUrl: voteTargetUrl,
          voteTarget: voteTarget.trim(),
          contestDetails: voteContestDetails.trim() || undefined,
          requiresScreenshot: voteRequiresScreenshot,
        };
      }

      await postTask.mutateAsync(payload);
      
      // Success - show success modal
      setShowPreview(false);
      setShowSuccess(true);
    } catch (err: any) {
      setUploading(false);
      console.error('Task creation error:', err);
      const message = err?.response?.data?.error || err?.message || 'Failed to create task';
      if (message.includes('top up') || message.includes('Insufficient balance')) {
        setErrors({ submit: 'Insufficient balance. Please top up your wallet.' });
      } else {
        setErrors({ submit: message });
      }
    }
  };

  const isSocialEngagement = formData.type === 'SOCIAL_ENGAGEMENT';

  return (
    <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      <div className="mb-8">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-4">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-body-md text-body-md">Back to Tasks</span>
        </Link>
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">Post a Task</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Create custom tasks to engage users and grow your audience
        </p>
      </div>

      <div className="bg-surface-alt rounded-xl p-6 border border-outline-variant/30 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#B8860B]">account_balance_wallet</span>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Available Balance</p>
              <p className="font-h2 text-h2 text-primary">{coinBalance.toLocaleString()} Coins</p>
            </div>
          </div>
          <Link
            href="/wallet"
            className="bg-primary text-on-primary font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-on-primary-fixed transition-colors"
          >
            Top Up
          </Link>
        </div>
      </div>

      {!authChecked ? (
        <div className="text-center py-10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin mb-4">progress_activity</span>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-error-alert/10 border border-error-alert/30 rounded-xl p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-error-alert mb-4">lock</span>
          <h3 className="font-h3 text-h3 text-on-surface mb-2">Sign In Required</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            You need to sign in to create tasks and upload files.
          </p>
          <button
            onClick={() => router.push('/login?redirect=/tasks/post')}
            className="bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors"
          >
            Sign In
          </button>
        </div>
      ) : (
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 space-y-6">
        {/* Auto-generated Title & Description Preview */}
        <div className="bg-surface rounded-xl p-6 border border-outline-variant/20">
          <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B8860B]">auto_awesome</span>
            Task Preview
          </h3>
          <div className="space-y-4">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Generated Title</p>
              <p className="font-body-md text-body-md text-on-surface p-3 bg-surface-alt rounded-lg border border-outline-variant/20">
                {generateTitleAndDescription(formData).title}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Generated Description</p>
              <p className="font-body-md text-body-md text-on-surface p-3 bg-surface-alt rounded-lg border border-outline-variant/20">
                {generateTitleAndDescription(formData).description}
              </p>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
            ℹ️ Title and description are automatically generated based on your task type and settings
          </p>
        </div>

        <div>
          <label className="block font-body-md text-body-md text-on-surface mb-2">Task Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TASK_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleInputChange('type', type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === type.value
                    ? 'border-[#B8860B] bg-[#B8860B]/10'
                    : 'border-outline-variant/30 hover:border-outline-variant/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-2 block">
                  {type.icon}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface block">{type.label}</span>
                <span className="font-data-xs text-data-xs text-on-surface-variant block mt-1">
                  Min {type.minBudget.toLocaleString()} coins
                </span>
              </button>
            ))}
          </div>
        </div>

        {formData.type === 'WATCH_VIDEO' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">play_circle</span>
              Video Watching Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Video URL *</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  YouTube, Vimeo, or other video platform URL
                </p>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Watch Time (seconds)</label>
                <input
                  type="number"
                  value={formData.minWatchTime}
                  onChange={(e) => handleInputChange('minWatchTime', Math.max(10, parseInt(e.target.value) || 10))}
                  min={10}
                  max={3600}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Minimum seconds participants must watch
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.type === 'APP_DOWNLOAD' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">download</span>
              App Download Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">App Store URL *</label>
                <input
                  type="url"
                  value={formData.appStoreUrl}
                  onChange={(e) => handleInputChange('appStoreUrl', e.target.value)}
                  placeholder="https://apps.apple.com/... or https://play.google.com/..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to your app on App Store or Google Play
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requiresReview"
                  checked={formData.requiresReview}
                  onChange={(e) => handleInputChange('requiresReview', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="requiresReview" className="font-body-md text-body-md text-on-surface">
                  Require app review
                </label>
              </div>
              {formData.requiresReview && (
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Rating (stars)</label>
                  <input
                    type="number"
                    value={formData.minRating}
                    onChange={(e) => handleInputChange('minRating', Math.max(1, Math.min(5, parseInt(e.target.value) || 5)))}
                    min={1}
                    max={5}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Minimum star rating required (1-5)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {formData.type === 'COMPLETE_SURVEY' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">poll</span>
              Survey Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Survey URL *</label>
                <input
                  type="url"
                  value={formData.surveyUrl}
                  onChange={(e) => handleInputChange('surveyUrl', e.target.value)}
                  placeholder="https://forms.google.com/... or https://typeform.com/..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to your survey (Google Forms, Typeform, SurveyMonkey, etc.)
                </p>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Questions</label>
                <input
                  type="number"
                  value={formData.minQuestions}
                  onChange={(e) => handleInputChange('minQuestions', Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={100}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Number of questions in the survey
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.type === 'SHARE_SOCIAL' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">share</span>
              Social Share Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Share Platform *</label>
                <select
                  value={formData.sharePlatform}
                  onChange={(e) => handleInputChange('sharePlatform', e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>{platform.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Suggested Share Message</label>
                <textarea
                  value={formData.shareMessage}
                  onChange={(e) => handleInputChange('shareMessage', e.target.value)}
                  placeholder="Check out this amazing content..."
                  rows={3}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] resize-none"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Optional message participants can use when sharing
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requiresHashtag"
                  checked={formData.requiresHashtag}
                  onChange={(e) => handleInputChange('requiresHashtag', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="requiresHashtag" className="font-body-md text-body-md text-on-surface">
                  Require specific hashtag
                </label>
              </div>
              {formData.requiresHashtag && (
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Required Hashtag</label>
                  <input
                    type="text"
                    value={formData.hashtag}
                    onChange={(e) => handleInputChange('hashtag', e.target.value.replace(/\s/g, ''))}
                    placeholder="#YourCampaign"
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {formData.type === 'STREAM_MUSIC' && (
          <div className="bg-surface rounded-xl p-6 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">music_note</span>
              Music Upload & Streaming Settings
            </h3>
            <div className="space-y-4">
              {/* Audio File Upload */}
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Audio File (MP3) *</label>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 bg-surface-alt">
                  {formData.audioFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploading && uploadProgress.audio < 100 ? (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        ) : audioUploaded ? (
                          <span className="material-symbols-outlined text-success-verified">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        )}
                        <div>
                          <p className="font-body-md text-body-md text-on-surface">{formData.audioFile.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                            {uploading && uploadProgress.audio < 100 ? (
                              <span className="ml-2 text-[#B8860B]">
                                - Uploading {uploadProgress.audio}%
                              </span>
                            ) : audioUploaded ? (
                              <span className="ml-2 text-success-verified">
                                - Upload Complete
                              </span>
                            ) : (
                              <span className="ml-2 text-[#B8860B]">- Uploading...</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, audioFile: null, audioUrl: '' }));
                          setAudioUploaded(false);
                          setUploadProgress(prev => ({ ...prev, audio: 0 }));
                        }}
                        className="text-error-alert hover:underline font-body-sm text-body-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">cloud_upload</span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-2">
                        Drop your audio file here or click to browse
                      </p>
                      <input
                        type="file"
                        accept=".mp3,audio/mpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAudioFileSelected(file);
                        }}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label
                        htmlFor="audio-upload"
                        className="inline-flex items-center gap-2 bg-[#B8860B] text-primary font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-[#8B6914] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        Choose File
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                        MP3 format, max 50MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.audioUrl && <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.audioUrl}</p>}
                {uploadProgress.audio > 0 && uploadProgress.audio < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div
                        className="bg-[#B8860B] h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress.audio}%` }}
                      />
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Uploading audio... {uploadProgress.audio}%</p>
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Album Art</label>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 bg-surface-alt">
                  {formData.coverImageFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploading && uploadProgress.cover < 100 ? (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        ) : coverUploaded ? (
                          <span className="material-symbols-outlined text-success-verified">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[#B8860B] animate-spin">progress_activity</span>
                        )}
                        <img
                          src={URL.createObjectURL(formData.coverImageFile)}
                          alt="Cover preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-body-md text-body-md text-on-surface">{formData.coverImageFile.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {(formData.coverImageFile.size / (1024 * 1024)).toFixed(2)} MB
                            {uploading && uploadProgress.cover < 100 ? (
                              <span className="ml-2 text-[#B8860B]">
                                - Uploading {uploadProgress.cover}%
                              </span>
                            ) : coverUploaded ? (
                              <span className="ml-2 text-success-verified">
                                - Upload Complete
                              </span>
                            ) : (
                              <span className="ml-2 text-[#B8860B]">- Uploading...</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, coverImageFile: null, coverImageUrl: '' }));
                          setCoverUploaded(false);
                          setUploadProgress(prev => ({ ...prev, cover: 0 }));
                        }}
                        className="text-error-alert hover:underline font-body-sm text-body-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">image</span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-2">
                        Drop your cover art here or click to browse
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCoverFileSelected(file);
                        }}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-surface-container-high/80 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        Choose File
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                        JPG/PNG, max 10MB (recommended: 1000x1000px)
                      </p>
                    </div>
                  )}
                </div>
                {uploadProgress.cover > 0 && uploadProgress.cover < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div
                        className="bg-[#B8860B] h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress.cover}%` }}
                      />
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Uploading cover... {uploadProgress.cover}%</p>
                  </div>
                )}
              </div>

              {/* Genre and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  >
                    <option value="">Select Genre</option>
                    <option value="Afrobeats">Afrobeats</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="R&B">R&B</option>
                    <option value="Pop">Pop</option>
                    <option value="Gospel">Gospel</option>
                    <option value="Highlife">Highlife</option>
                    <option value="Fuji">Fuji</option>
                    <option value="Amapiano">Amapiano</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Rock">Rock</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body-md text-body-md text-on-surface mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.durationSeconds}
                    onChange={(e) => handleInputChange('durationSeconds', Math.max(30, parseInt(e.target.value) || 30))}
                    min={30}
                    max={7200}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Length of the track
                  </p>
                </div>
              </div>

              {/* Download Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDownloadEnabled"
                  checked={formData.isDownloadEnabled}
                  onChange={(e) => handleInputChange('isDownloadEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="isDownloadEnabled" className="font-body-md text-body-md text-on-surface">
                  Allow users to download this track
                </label>
              </div>

              {/* Info Box */}
              <div className="bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-lg p-4">
                <p className="font-body-sm text-body-sm text-[#B8860B]">
                  <strong>Note:</strong> Your track will appear in the Music section. Users will earn coins by streaming. 
                  Each stream pays the coin reward you set above from your budget.
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.type === 'VOTE' && (
          <div className="bg-surface rounded-xl p-6 border border-[#B8860B]/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">how_to_vote</span>
              External Voting Requirements
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Target URL *</label>
                <input
                  type="url"
                  value={voteTargetUrl}
                  onChange={(e) => setVoteTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full bg-surface border rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] ${
                    errors.voteTargetUrl ? 'border-error-alert' : 'border-outline-variant/30'
                  }`}
                />
                {errors.voteTargetUrl && (
                  <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.voteTargetUrl}</p>
                )}
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to the external website where users will vote.
                </p>
              </div>

              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Vote Target *</label>
                <input
                  type="text"
                  value={voteTarget}
                  onChange={(e) => setVoteTarget(e.target.value)}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-surface border rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] ${
                    errors.voteTarget ? 'border-error-alert' : 'border-outline-variant/30'
                  }`}
                />
                {errors.voteTarget && (
                  <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.voteTarget}</p>
                )}
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Specify clearly who or what the user should vote for.
                </p>
              </div>

              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Contest Details (Optional)</label>
                <input
                  type="text"
                  value={voteContestDetails}
                  onChange={(e) => setVoteContestDetails(e.target.value)}
                  placeholder="e.g. Best Actor Category"
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="voteRequiresScreenshot"
                  checked={voteRequiresScreenshot}
                  onChange={(e) => setVoteRequiresScreenshot(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="voteRequiresScreenshot" className="font-body-md text-body-md text-on-surface">
                  Require a screenshot as proof of voting
                </label>
              </div>
            </div>
          </div>
        )}

        {isSocialEngagement && (
          <div className="bg-surface rounded-xl p-6 border border-[#B8860B]/30">
            <h3 className="font-h3 text-h3 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B8860B]">thumb_up</span>
              Social Engagement Requirements
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Platform *</label>
                <div className="grid grid-cols-3 gap-3">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => setSelectedPlatform(platform.value)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPlatform === platform.value
                          ? 'border-[#B8860B] bg-[#B8860B]/10'
                          : 'border-outline-variant/30 hover:border-outline-variant/50'
                      }`}
                    >
                      <img
                        src={platform.logo}
                        alt={platform.label}
                        className="w-8 h-8 object-contain"
                        style={{ filter: selectedPlatform === platform.value ? 'none' : 'grayscale(100%)' }}
                      />
                      <span className="font-body-xs text-body-xs text-on-surface text-center">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Required Actions * (Select multiple)</label>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_ACTIONS.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => toggleAction(action.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        selectedActions.includes(action.value)
                          ? 'border-[#B8860B] bg-[#B8860B]/10'
                          : 'border-outline-variant/30 hover:border-outline-variant/50'
                      }`}
                    >
                      <span className={`material-symbols-outlined ${selectedActions.includes(action.value) ? 'text-[#B8860B]' : 'text-on-surface-variant'}`}>
                        {selectedActions.includes(action.value) ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface">{action.label}</span>
                    </button>
                  ))}
                </div>
                {errors.actions && <p className="text-error-alert font-body-sm text-body-sm mt-2">{errors.actions}</p>}
              </div>

              <div>
                <label className="block font-body-md text-body-md text-on-surface mb-2">Target URL *</label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                  placeholder="https://twitter.com/yourprofile/status/..."
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                />
                {errors.targetUrl && <p className="text-error-alert font-body-sm text-body-sm mt-1">{errors.targetUrl}</p>}
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Link to the post/profile participants need to engage with
                </p>
              </div>

              {selectedActions.includes('COMMENT') && (
                <div className="bg-surface-container-high rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block font-body-md text-body-md text-on-surface mb-2">Suggested Comment Text (Optional)</label>
                    <textarea
                      value={formData.commentText}
                      onChange={(e) => handleInputChange('commentText', e.target.value)}
                      placeholder="Enter a suggested comment participants can use..."
                      rows={3}
                      className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B] resize-none"
                    />
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Participants can use this or write their own
                    </p>
                  </div>
                  <div>
                    <label className="block font-body-md text-body-md text-on-surface mb-2">Minimum Comment Length</label>
                    <input
                      type="number"
                      value={formData.minCommentLength}
                      onChange={(e) => handleInputChange('minCommentLength', Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={500}
                      className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
                    />
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Minimum characters required for a valid comment
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="screenshot"
                  checked={formData.requiresScreenshot}
                  onChange={(e) => handleInputChange('requiresScreenshot', e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant/30 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <label htmlFor="screenshot" className="font-body-md text-body-md text-on-surface">
                  Require screenshot as proof
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-body-md text-body-md text-on-surface mb-2">
              Participants Target *
            </label>
            <input
              type="number"
              value={formData.participantThreshold}
              onChange={(e) => handleInputChange('participantThreshold', Math.max(10, parseInt(e.target.value) || 0))}
              min={10}
              max={10000}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Min: 10, Max: 10,000
            </p>
          </div>

          <div>
            <label className="block font-body-md text-body-md text-on-surface mb-2">
              Total Budget (Coins) *
            </label>
            <input
              type="number"
              value={formData.totalBudget}
              onChange={(e) => handleInputChange('totalBudget', Math.max(1000, parseInt(e.target.value) || 0))}
              min={1000}
              max={1000000}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#B8860B]"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Min: 1,000 coins
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-outline-variant/20">
          <h3 className="font-h3 text-h3 text-on-surface mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Creation Fee</span>
              <span className="font-data-md text-data-md text-primary">{CREATION_FEE.toLocaleString()} 🪙</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Participant Budget</span>
              <span className="font-data-md text-data-md text-primary">{formData.totalBudget.toLocaleString()} 🪙</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
              <span className="font-body-md text-body-md font-semibold text-on-surface">Total Cost</span>
              <span className="font-h3 text-h3 text-[#B8860B]">{totalCost.toLocaleString()} 🪙</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
              <span className="font-body-md text-body-md text-on-surface-variant">Coin per Participant</span>
              <span className="font-data-lg text-data-lg text-secondary">{coinPerParticipant.toLocaleString()} 🪙</span>
            </div>
          </div>
          {errors.budget && (
            <p className="text-error-alert font-body-sm text-body-sm mt-3">{errors.budget}</p>
          )}
          {errors.balance && (
            <div className="mt-4 p-4 bg-error-alert/10 border border-error-alert/30 rounded-lg">
              <p className="text-error-alert font-body-md text-body-md">{errors.balance}</p>
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 mt-2 text-error-alert hover:underline font-body-sm text-body-sm"
              >
                <span className="material-symbols-outlined text-sm">add_card</span>
                Top up your wallet
              </Link>
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="p-4 bg-error-alert/10 border border-error-alert/30 rounded-lg">
            <p className="text-error-alert font-body-md text-body-md">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!isValid || postTask.isPending || uploading}
            className="flex-1 bg-[#B8860B] text-primary font-body-md text-body-md py-4 rounded-lg hover:bg-[#8B6914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Uploading... {uploadProgress.audio > 0 && uploadProgress.audio < 100 ? `Audio ${uploadProgress.audio}%` : ''}{uploadProgress.cover > 0 && uploadProgress.cover < 100 ? ` Cover ${uploadProgress.cover}%` : ''}
              </span>
            ) : postTask.isPending ? (
              'Creating...'
            ) : (
              'Preview & Post'
            )}
          </button>
        </div>
      </div>
      )}

      {/* Preview Modal */}
      {showPreview && !showSuccess && isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-h2 text-h2 text-on-surface mb-4">Preview Task</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Title</p>
                <p className="font-body-md text-body-md text-on-surface">{generateTitleAndDescription(formData).title}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Description</p>
                <p className="font-body-md text-body-md text-on-surface">{generateTitleAndDescription(formData).description}</p>
              </div>
              
{/* Task-Specific Requirements Preview */}
                <div className="bg-surface rounded-lg p-4 space-y-3">
                  <p className="font-label-caps text-label-caps text-[#B8860B] uppercase">Task Requirements</p>
                  
                  {formData.type === 'WATCH_VIDEO' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Video URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.videoUrl}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Min Watch Time</p>
                      <p className="font-body-md text-body-md text-on-surface">{formData.minWatchTime} seconds</p>
                    </div>
                  </>
                )}
                
                {formData.type === 'APP_DOWNLOAD' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">App Store URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.appStoreUrl}</p>
                    </div>
                    {formData.requiresReview && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Requires Review</p>
                        <p className="font-body-md text-body-md text-on-surface">Yes, min {formData.minRating} stars</p>
                      </div>
                    )}
                  </>
                )}
                
                {formData.type === 'COMPLETE_SURVEY' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Survey URL</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.surveyUrl}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Min Questions</p>
                      <p className="font-body-md text-body-md text-on-surface">{formData.minQuestions} questions</p>
                    </div>
                  </>
                )}
                
                {formData.type === 'SHARE_SOCIAL' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Platform</p>
                      <p className="font-body-md text-body-md text-on-surface">{SOCIAL_PLATFORMS.find(p => p.value === formData.sharePlatform)?.label}</p>
                    </div>
                    {formData.shareMessage && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Share Message</p>
                        <p className="font-body-sm text-body-sm text-on-surface line-clamp-2">{formData.shareMessage}</p>
                      </div>
                    )}
                    {formData.requiresHashtag && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Required Hashtag</p>
                        <p className="font-body-md text-body-md text-on-surface">{formData.hashtag}</p>
                      </div>
                    )}
                  </>
                )}
                
                {formData.type === 'STREAM_MUSIC' && (
                  <>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Audio File</p>
                      <p className="font-body-sm text-body-sm text-on-surface truncate">
                        {formData.audioFile?.name || formData.audioUrl || 'No audio file'}
                      </p>
                    </div>
                    {(formData.coverImageFile || formData.coverImageUrl) && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Cover Art</p>
                        <p className="font-body-sm text-body-sm text-on-surface truncate">
                          {formData.coverImageFile?.name || formData.coverImageUrl}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Genre</p>
                        <p className="font-body-md text-body-md text-on-surface">{formData.genre}</p>
                      </div>
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Duration</p>
                        <p className="font-body-md text-body-md text-on-surface">
                          {Math.floor(formData.durationSeconds / 60)}:{(formData.durationSeconds % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                    {formData.isDownloadEnabled && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Download</p>
                        <p className="font-body-md text-body-md text-success-verified">Enabled</p>
                      </div>
                    )}
                    <div className="bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-lg p-3">
                      <p className="font-body-sm text-body-sm text-[#B8860B]">
                        This track will appear in the Music section. Users earn {coinPerParticipant} coins per stream.
                      </p>
                    </div>
                  </>
                )}
                
                {formData.type === 'VOTE' && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Vote Target</p>
                        <p className="font-body-md text-body-md text-on-surface break-words">{voteTarget}</p>
                      </div>
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Target URL</p>
                        <a href={voteTargetUrl} target="_blank" rel="noopener noreferrer" className="font-body-md text-body-md text-primary hover:underline break-all">
                          {voteTargetUrl}
                        </a>
                      </div>
                      {voteContestDetails && (
                        <div>
                          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Contest Details</p>
                          <p className="font-body-md text-body-md text-on-surface">{voteContestDetails}</p>
                        </div>
                      )}
                      {voteRequiresScreenshot && (
                        <div>
                          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Proof Required</p>
                          <p className="font-body-md text-body-md text-error-alert flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                            Screenshot
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {isSocialEngagement && (
                  <>
                    <div className="flex items-center gap-2">
                      <img
                        src={SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.logo || ''}
                        alt={selectedPlatform}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="font-body-md text-body-md text-on-surface">
                        {SOCIAL_PLATFORMS.find(p => p.value === selectedPlatform)?.label}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Actions</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedActions.map(action => (
                          <span key={action} className="bg-[#B8860B]/10 text-[#B8860B] font-body-sm text-body-sm px-2 py-1 rounded">
                            {SOCIAL_ACTIONS.find(a => a.value === action)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    {formData.targetUrl && (
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 text-xs">Target URL</p>
                        <p className="font-body-sm text-body-sm text-on-surface truncate">{formData.targetUrl}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Type</p>
                  <p className="font-body-md text-body-md text-on-surface">
                    {TASK_TYPES.find(t => t.value === formData.type)?.label}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Participants</p>
                  <p className="font-body-md text-body-md text-on-surface">{formData.participantThreshold}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Budget</p>
                  <p className="font-body-md text-body-md text-on-surface">{formData.totalBudget.toLocaleString()} 🪙</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Per Participant</p>
                  <p className="font-body-md text-body-md text-secondary">{coinPerParticipant.toLocaleString()} 🪙</p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Total Cost</p>
                <p className="font-h2 text-h2 text-[#B8860B]">{totalCost.toLocaleString()} 🪙</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-surface-container-high text-on-surface font-body-md text-body-md py-3 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={postTask.isPending}
                className="flex-1 bg-[#B8860B] text-primary font-body-md text-body-md py-3 rounded-lg hover:bg-[#8B6914] transition-colors disabled:opacity-50"
              >
                {postTask.isPending ? 'Posting...' : 'Confirm & Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-success-verified/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-success-verified">
                  check_circle
                </span>
              </div>
              <h2 className="font-h2 text-h2 text-on-surface mb-2">Task Posted Successfully!</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your task has been created and is now live.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Task Type:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {TASK_TYPES.find(t => t.value === formData.type)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Participants:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {formData.participantThreshold.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Budget:</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {formData.totalBudget.toLocaleString()} 🪙
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-outline-variant/20">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Coin per Participant:</span>
                  <span className="font-body-sm text-body-sm text-secondary font-bold">
                    {coinPerParticipant.toLocaleString()} 🪙
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push('/tasks');
                }}
                className="w-full bg-[#B8860B] text-primary font-body-md text-body-md py-3 rounded-lg hover:bg-[#8B6914] transition-colors"
              >
                View All Tasks
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  // Reset form to create another task
                  setFormData({
                    type: 'WATCH_VIDEO',
                    participantThreshold: 100,
                    totalBudget: 5000,
                    targetUrl: '',
                    commentText: '',
                    minCommentLength: 10,
                    requiresScreenshot: false,
                    videoUrl: '',
                    minWatchTime: 30,
                    appStoreUrl: '',
                    requiresReview: false,
                    minRating: 4,
                    surveyUrl: '',
                    minQuestions: 5,
                    sharePlatform: 'TWITTER',
                    shareMessage: '',
                    requiresHashtag: false,
                    hashtag: '',
                    audioFile: null,
                    audioUrl: '',
                    coverImageFile: null,
                    coverImageUrl: '',
                    genre: '',
                    durationSeconds: 180,
                    isDownloadEnabled: false,
                  });
                  setSelectedPlatform('TWITTER');
                  setSelectedActions(['LIKE']);
                  setErrors({});
                }}
                className="w-full bg-surface-container-high text-on-surface font-body-md text-body-md py-3 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                Create Another Task
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}// Force redeploy - Sat Jun 20 23:39:23 CEST 2026
```
---


### File: apps/web/app/(app)/tasks/posted/page.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePostedTasks, useTogglePostedTaskStatus, useTaskCompletions, useApproveCompletion, useRejectCompletion } from '@/lib/hooks';

function CompletionReview({ taskId }: { taskId: string }) {
  const { data: resp, isLoading } = useTaskCompletions(taskId);
  const approveMutation = useApproveCompletion();
  const rejectMutation = useRejectCompletion();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const completions = resp?.completions ?? [];
  const pending = completions.filter((c: any) => c.status === 'PENDING');
  const approved = completions.filter((c: any) => c.status === 'APPROVED');
  const rejected = completions.filter((c: any) => c.status === 'REJECTED');

  if (isLoading) return <div className="py-4 text-center text-on-surface-variant animate-pulse">Loading completions...</div>;
  if (completions.length === 0) return <div className="py-4 text-center text-on-surface-variant">No submissions yet</div>;

  const handleApprove = async (completionId: string) => {
    try {
      await approveMutation.mutateAsync({ completionId, postedTaskId: taskId });
    } catch (err: any) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (completionId: string) => {
    try {
      await rejectMutation.mutateAsync({ completionId, postedTaskId: taskId, reason: rejectReason || 'Did not meet requirements' });
      setRejectingId(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reject');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-surface-container-high text-on-surface-variant';
      case 'APPROVED': return 'bg-success-verified/10 text-success-verified';
      case 'REJECTED': return 'bg-error-alert/10 text-error-alert';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const formatTimeLeft = (completedAt: string) => {
    const completed = new Date(completedAt);
    const autoApprove = new Date(completed.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = autoApprove.getTime() - now.getTime();
    if (diff <= 0) return 'Auto-approving...';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 mb-4">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {pending.length} pending
        </span>
        <span className="font-label-caps text-label-caps text-success-verified">
          {approved.length} approved
        </span>
        <span className="font-label-caps text-label-caps text-error-alert">
          {rejected.length} rejected
        </span>
      </div>

      {completions.map((completion: any) => (
        <div key={completion.id} className="bg-surface-container rounded-xl p-4 border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
              <span className="font-body-md text-body-md text-on-surface">
                {completion.user_id?.slice(0, 8)}...
              </span>
              <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full ${getStatusBadge(completion.status)}`}>
                {completion.status}
              </span>
            </div>
            <span className="font-data-md text-data-md text-[#B8860B]">
              {completion.coins_earned} 🪙
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Submitted: {new Date(completion.completed_at).toLocaleString()}
            </p>
            {completion.status === 'PENDING' && (
              <p className="font-body-sm text-body-sm text-secondary">
                Auto-approves in: {formatTimeLeft(completion.completed_at)}
              </p>
            )}
          </div>

          {completion.proof_data && (
            <div className="bg-surface-container-low rounded-lg p-3 mb-3 space-y-1">
              {completion.proof_data.platform && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Platform:</span>{' '}
                  <span className="text-on-surface capitalize">{completion.proof_data.platform}</span>
                </p>
              )}
              {completion.proof_data.actionUrl && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Action:</span>{' '}
                  <a href={completion.proof_data.actionUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">
                    {completion.proof_data.actionUrl}
                  </a>
                </p>
              )}
              {completion.proof_data.screenshot && (
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Screenshot:</p>
                  <a href={completion.proof_data.screenshot} target="_blank" rel="noopener noreferrer">
                    <img
                      src={completion.proof_data.screenshot}
                      alt="Proof screenshot"
                      className="max-h-40 rounded-lg border border-outline-variant/30 object-cover hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              )}
              {completion.proof_data.comment && (
                <p className="font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Comment:</span>{' '}
                  <span className="text-on-surface">{completion.proof_data.comment}</span>
                </p>
              )}
            </div>
          )}

          {completion.status === 'REJECTED' && completion.rejection_reason && (
            <div className="bg-error-alert/5 rounded-lg p-3 mb-3">
              <p className="font-body-sm text-body-sm text-error-alert">
                Rejected: {completion.rejection_reason}
              </p>
            </div>
          )}

          {completion.status === 'PENDING' && (
            <div className="flex gap-2">
              {rejectingId === completion.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full px-3 py-2 bg-surface-container rounded-lg border border-outline-variant text-on-surface text-sm outline-none focus:border-error-alert"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(completion.id)}
                      disabled={rejectMutation.isPending}
                      className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-error-alert text-white hover:bg-error-alert/90 disabled:opacity-50"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => { setRejectingId(null); setRejectReason(''); }}
                      className="px-4 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-on-surface-variant"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleApprove(completion.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-success-verified text-white hover:bg-success-verified/90 disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    Approve & Credit
                  </button>
                  <button
                    onClick={() => setRejectingId(completion.id)}
                    className="flex-1 py-2 rounded-lg font-body-sm text-body-sm bg-surface-container-high text-error-alert hover:bg-error-alert/10 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PostedTasksPage() {
  const { data: resp, isLoading } = usePostedTasks();
  const toggleTask = useTogglePostedTaskStatus();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const tasks = resp?.tasks ?? [];

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await toggleTask.mutateAsync({ id, currentStatus });
    } catch (err: any) {
      alert(err.message || 'Failed to toggle task status');
      console.error('Failed to toggle task status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-surface-container-high text-on-surface-variant';
      case 'PAUSED': return 'bg-warning-alert/10 text-warning-alert';
      case 'ACTIVE': return 'bg-success-verified/10 text-success-verified';
      case 'COMPLETED': return 'bg-primary-container/20 text-primary';
      case 'EXPIRED':
      case 'CANCELLED': return 'bg-error-alert/10 text-error-alert';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary">My Posted Tasks</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Manage and track your custom tasks
          </p>
        </div>
        <Link
          href="/tasks/post"
          className="bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add_task</span>
          <span>Post New Task</span>
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-alt rounded-xl p-6 h-48 animate-pulse border border-outline-variant/20" />
          ))
        ) : tasks.length === 0 ? (
          <div className="bg-surface-alt rounded-xl p-12 text-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">task_alt</span>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">No Tasks Yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Create your first task to start engaging users
            </p>
            <Link
              href="/tasks/post"
              className="inline-flex items-center gap-2 bg-[#B8860B] text-primary font-body-md text-body-md px-6 py-3 rounded-lg hover:bg-[#8B6914] transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Post Your First Task</span>
            </Link>
          </div>
        ) : (
          tasks.map((task: any) => {
            const progressPercent = Math.min(100, Math.round(
              (task.currentParticipants / task.participantThreshold) * 100
            ));
            const remainingBudget = task.totalBudget - (task.currentParticipants * task.coinPerParticipant);
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-surface-alt rounded-xl border border-outline-variant/30 hover:border-outline-variant/50 transition-colors overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-h3 text-h3 text-on-surface">{task.title}</h3>
                        <span className={`font-label-caps text-label-caps px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-data-lg text-data-lg text-[#B8860B]">{task.coinPerParticipant.toLocaleString()} 🪙</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">per participant</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-surface rounded-lg p-4">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Participants</p>
                      <p className="font-h3 text-h3 text-primary">{task.currentParticipants} / {task.participantThreshold}</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Budget Used</p>
                      <p className="font-h3 text-h3 text-primary">{(task.totalBudget - remainingBudget).toLocaleString()}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">/ {task.totalBudget.toLocaleString()} 🪙</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Remaining</p>
                      <p className="font-h3 text-h3 text-success-verified">{remainingBudget.toLocaleString()} 🪙</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Type</p>
                      <p className="font-body-md text-body-md text-on-surface capitalize">{task.type?.replace?.(/_/g, ' ') || task.type}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Progress</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B8860B] to-secondary rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Created {new Date(task.createdAt).toLocaleDateString()}
                      {task.expiresAt && ` · Expires ${new Date(task.expiresAt).toLocaleDateString()}`}
                    </p>
                    <div className="flex gap-3">
                      {(task.status === 'PENDING' || task.status === 'ACTIVE' || task.status === 'PAUSED') && (
                        <button
                          onClick={() => handleToggleStatus(task.id, task.status)}
                          disabled={toggleTask.isPending}
                          className={`${
                            task.status === 'ACTIVE'
                              ? 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                              : 'bg-success-verified text-white hover:bg-success-verified/90'
                          } font-body-md text-body-md px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {task.status === 'ACTIVE' ? 'pause' : 'play_arrow'}
                          </span>
                          <span>
                            {toggleTask.isPending && toggleTask.variables?.id === task.id
                              ? 'Processing...'
                              : task.status === 'ACTIVE'
                              ? 'Pause'
                              : 'Activate'}
                          </span>
                        </button>
                      )}
                      {task.status === 'ACTIVE' && (
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="bg-secondary-container text-on-secondary-container font-body-md text-body-md px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'people'}</span>
                          <span>{isExpanded ? 'Hide' : 'Review'} Submissions</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-outline-variant/20">
                    <h4 className="font-h4 text-h4 text-on-surface mt-4 mb-3">Submissions</h4>
                    <CompletionReview taskId={task.id} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/tasks/milestone/30/page.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStreak } from '@/lib/hooks';

export default function Milestone30Page() {
  const [mounted, setMounted] = useState(false);
  const { data: streakResp, isLoading } = useStreak();
  const streak = streakResp?.streak;

  const currentStreak = streak?.currentStreak ?? 0;
  const hasReached30 = currentStreak >= 30;
  const progressTo30 = Math.min(100, Math.round((currentStreak / 30) * 100));
  const daysLeft = Math.max(0, 30 - currentStreak);

  // Progress toward 60-day milestone (shown in "Next Goal" section)
  const progressTo60 = Math.min(100, Math.round((currentStreak / 60) * 100));
  const daysLeftTo60 = Math.max(0, 60 - currentStreak);

  useEffect(() => {
    setMounted(true);
    
    if (!hasReached30) return; // Only confetti if milestone reached

    // Confetti logic
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#B8860B', '#fdc34d', '#ffffff', '#b9c6e8'];
    const elements: HTMLDivElement[] = [];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '30px';
      confetti.style.background = '#ffd300';
      confetti.style.top = '0';
      confetti.style.opacity = '0';
      
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animation = `makeItRain ${2 + Math.random() * 2}s infinite ease-in-out ${Math.random() * 3}s`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
      }
      
      container.appendChild(confetti);
      elements.push(confetti);
    }
    
    const timeout1 = setTimeout(() => {
      if (container) {
        container.style.opacity = '0';
        container.style.transition = 'opacity 2s ease';
      }
    }, 5000);
    
    const timeout2 = setTimeout(() => {
      elements.forEach(el => el.remove());
    }, 7000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      elements.forEach(el => el.remove());
    };
  }, [hasReached30]);

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-x-hidden pb-24 md:pb-0 relative min-h-[calc(100vh-64px)]">
      {/* Confetti Overlay Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100] fixed" id="confetti-container">
        {mounted && (
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes makeItRain {
                0% { opacity: 0; top: -10%; transform: rotate(0deg); }
                10% { opacity: 1; }
                50% { opacity: 1; transform: rotate(180deg); }
                100% { opacity: 0; top: 110%; transform: rotate(360deg); }
            }
          `}} />
        )}
      </div>

      {/* Hero Celebration Section */}
      <section className="bg-primary-container relative py-20 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center text-center overflow-hidden -mx-margin-mobile lg:-mx-gutter lg:-mt-16 w-[calc(100%+32px)] lg:w-[calc(100%+48px)]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container to-primary-fixed-dim/20 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
          {/* Golden Laurel / Badge */}
          <div className={`w-32 h-32 rounded-full border-4 ${hasReached30 ? 'border-[#B8860B]' : 'border-outline/30'} bg-primary-fixed flex items-center justify-center shadow-[0_0_40px_rgba(184,134,11,0.3)] mb-4`}>
            <span className={`material-symbols-outlined text-6xl ${hasReached30 ? 'text-[#B8860B]' : 'text-outline/50'}`} style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary mb-2">
            {hasReached30 ? '30 Days Unlocked!' : '30-Day Challenge'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container">
            {hasReached30 
              ? "Incredible consistency. You've actively shaped the creative economy for a full month."
              : `You're ${daysLeft} days away from unlocking this milestone. Keep your streak going!`}
          </p>
        </div>
      </section>

      <div className="max-w-container-max mx-auto -mt-12 relative z-20 flex flex-col gap-gutter">
        {/* Reward Card */}
        <div className={`bg-surface-alt rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-2 ${hasReached30 ? 'border-[#B8860B]' : 'border-outline-variant/30'} shadow-[0_4px_20px_rgba(0,0,0,0.04)]`}>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 ${hasReached30 ? 'bg-[#B8860B]/10 border-[#B8860B]' : 'bg-surface-container-high border-outline-variant'} rounded-full flex items-center justify-center border shrink-0`}>
              <span className={`material-symbols-outlined text-4xl ${hasReached30 ? 'text-[#B8860B]' : 'text-outline'}`}>toll</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Milestone Bonus</p>
              <h2 className="font-h2 text-h2 text-primary">10,000 CMP Coins</h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            {hasReached30 ? (
              <>
                <button className="bg-[#B8860B] text-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-[#8B6914] transition-colors shadow-md whitespace-nowrap uppercase">
                  Claim Reward
                </button>
                <button className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors flex items-center justify-center gap-2 whitespace-nowrap uppercase">
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Share Achievement
                </button>
              </>
            ) : (
              <Link href="/tasks/streak" className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors text-center whitespace-nowrap uppercase">
                Back to Streak
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-8">
          {/* Streak Journey Chart */}
          <div className="lg:col-span-2 bg-surface-alt rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-on-background mb-6">Your Streak Journey</h3>
            <div className="relative pt-8 pb-4">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-surface-container-high rounded-full -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 h-2 bg-[#B8860B] rounded-full -translate-y-1/2" style={{ width: `${progressTo30}%` }}></div>
              
              {/* Milestones */}
              <div className="flex justify-between relative z-10">
                {[1, 10, 20, 30].map((day) => {
                  const reached = currentStreak >= day;
                  const isCurrent = day === 30;
                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      {isCurrent && reached ? (
                        <div className="w-8 h-8 rounded-full bg-primary border-4 border-[#B8860B] shadow-md flex items-center justify-center -mt-1">
                          <span className="material-symbols-outlined text-[14px] text-[#B8860B]">check</span>
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full ${reached ? 'bg-[#B8860B]' : 'bg-surface-container-high'} border-4 border-surface-alt shadow-sm`}></div>
                      )}
                      <span className={`font-data-md text-data-md ${isCurrent && reached ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                        Day {day}
                        {day === currentStreak && !reached ? ' (You)' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Next Goal Teaser */}
          <div className="bg-primary-container text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[#B8860B]">flag</span>
                <span className="font-label-caps text-label-caps text-[#B8860B] uppercase tracking-wider">Next Objective</span>
              </div>
              <h3 className="font-h3 text-h3 mb-2 text-on-primary">60-Day Titan</h3>
              <p className="font-body-sm text-body-sm text-on-primary-container">Maintain your momentum for another {daysLeftTo60} days to unlock exclusive Creator Tier status and a massive 25k bonus.</p>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="font-data-md text-data-md text-on-primary-container">Progress</span>
                <span className="font-data-md text-data-md text-[#B8860B]">{currentStreak} / 60</span>
              </div>
              <div className="w-full h-3 bg-on-primary-fixed-variant rounded-full overflow-hidden">
                <div className="h-full bg-[#B8860B] rounded-full" style={{ width: `${progressTo60}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
---


### File: apps/web/app/(app)/tasks/milestone/60/page.tsx

```tsx
'use client';

import Link from 'next/link';
import { useStreak } from '@/lib/hooks';

export default function Milestone60Page() {
  const { data: streakResp, isLoading } = useStreak();
  const streak = streakResp?.streak;

  const currentStreak = streak?.currentStreak ?? 0;
  const hasReached60 = currentStreak >= 60;
  const progressTo60 = Math.min(100, Math.round((currentStreak / 60) * 100));
  const daysLeft = Math.max(0, 60 - currentStreak);

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-x-hidden pb-24 md:pb-0 relative min-h-[calc(100vh-64px)]">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-secondary-container/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-container/5 blur-[100px]"></div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 relative z-10 flex flex-col gap-gutter">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4 mt-8">
          <p className="font-label-caps text-label-caps text-[#B8860B] uppercase tracking-widest mb-2">Creative Growth</p>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary-container mb-4 tracking-tight">
            {hasReached60 ? 'Titan Unlocked!' : 'Road to Titan'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {hasReached60 
              ? "You've achieved legendary status. 60 consecutive days of dedication to the creative economy. You are a Titan."
              : `You're ${daysLeft} days away. Reach the 60-day streak to achieve Titan status, unlocking the Creator Tier and the ultimate 25,000 CMP bonus.`}
          </p>
        </div>

        {/* Central Titan Badge Display */}
        <div className="flex justify-center my-8">
          <div className="relative group">
            {/* Glow effect behind badge */}
            <div className={`absolute inset-0 rounded-full animate-pulse blur-[30px] ${hasReached60 ? 'bg-[#B8860B]/40' : 'bg-secondary-container/40'} z-0`}></div>
            
            <div className="w-48 h-48 rounded-full border-4 border-surface-alt bg-primary-container flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary-fixed-dim/40"></div>
              
              <div className="relative z-20 flex flex-col items-center">
                <span className="material-symbols-outlined text-[72px] text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="font-label-caps text-[10px] text-on-primary uppercase tracking-[0.2em] mt-2 opacity-80">
                  {hasReached60 ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
            
            {/* Orbiting particles (css-based) */}
            <div className="absolute inset-[-20px] rounded-full border border-secondary-container/20 border-dashed animate-[spin_10s_linear_infinite] z-0"></div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-surface-alt rounded-2xl p-8 border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl mx-auto w-full mt-4">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-1">Titan Milestone</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {hasReached60 ? 'Milestone achieved!' : `${daysLeft} days left to unlock`}
              </p>
            </div>
            <div className="text-right">
              <span className="font-data-lg text-h2 text-primary-container">{progressTo60}%</span>
            </div>
          </div>
          
          <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden mb-6 relative shadow-inner">
            <div className="h-full bg-gradient-to-r from-primary to-[#B8860B] rounded-full relative" style={{ width: `${progressTo60}%` }}>
              {/* Shimmer effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-on-surface-variant font-data-md text-data-md">
            <span>Day 0</span>
            <span className="text-primary font-bold">Day {currentStreak} (You)</span>
            <span>Day 60</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/10 flex items-center justify-center border border-secondary-container/30">
                <span className="material-symbols-outlined text-[#B8860B]">card_giftcard</span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Reward</p>
                <p className="font-data-md text-[18px] text-primary font-bold">25,000 CMP</p>
              </div>
            </div>
            
            {hasReached60 ? (
              <button className="w-full sm:w-auto bg-[#B8860B] text-primary font-body-md text-body-md font-medium py-3 px-8 rounded-lg hover:bg-[#8B6914] transition-colors text-center shadow-sm">
                Claim Reward
              </button>
            ) : (
              <Link href="/tasks/streak" className="w-full sm:w-auto bg-primary text-on-primary font-body-md text-body-md font-medium py-3 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors text-center shadow-sm">
                Keep Grinding
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```
---



## Article Pages


### File: apps/web/app/(app)/articles/page.tsx

```tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useArticles } from '@/lib/hooks';
import type { Article } from '@/lib/queries';

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: articles = [], isLoading: articlesLoading } = useArticles(
    selectedCategory ? { category: selectedCategory, search: searchQuery } : { search: searchQuery }
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a: any) => a.category && set.add(a.category));
    return Array.from(set);
  }, [articles]);

  return (
    <main className="flex-1 flex flex-col relative pb-[160px] lg:pb-[100px]">
      <div className="p-margin-mobile lg:p-margin-desktop space-y-12 max-w-[1400px] mx-auto w-full">
        {/* Hero Section */}
        <section className="relative bg-primary-container rounded-2xl p-8 lg:p-12 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-h1-mobile lg:font-h1 text-h1-mobile lg:text-h1 text-on-primary">
              Discover Knowledge & Insights
            </h2>
            <div className="w-full relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[28px] group-focus-within:text-secondary transition-colors">
                search
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..." 
                className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-surface placeholder-on-surface-variant/70 rounded-xl pl-14 pr-6 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner outline-none"
              />
            </div>
          </div>
        </section>

        {/* Category Pills */}
        {categories.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 border-transparent shadow-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-alt text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps transition-colors ${
                    selectedCategory === category
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-alt text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-h3 text-h3 text-on-background">
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
          
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-surface-variant animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-surface-alt rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">article</span>
              <h4 className="font-h3 text-h3 text-on-surface mb-2">No Articles Found</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {searchQuery || selectedCategory 
                  ? 'Try adjusting your search or filter' 
                  : 'Check back soon for new content'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className="group block bg-surface-alt rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-secondary transition-all shadow-sm hover:shadow-md"
                >
                  {article.cover_image_url && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={article.cover_image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-secondary-container/20 text-secondary font-label-caps text-label-caps rounded-full">
                        {article.category}
                      </span>
                      <span className="font-data-xs text-data-xs text-on-surface-variant">
                        {article.read_time_minutes} min read
                      </span>
                    </div>
                    <h4 className="font-h3 text-h3 text-on-background group-hover:text-secondary transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span className="font-body-sm text-body-sm">
                          {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#B8860B] font-semibold">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        <span className="font-body-md text-body-md">{article.coin_reward} Coins</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/articles/[slug]/page.tsx

```tsx
import { supabase } from '@/lib/supabase';
import ArticleReader from '@/components/tasks/ArticleReader';

export async function generateStaticParams() {
  const { data: articles } = await (supabase as any)
    .from('articles')
    .select('slug')
    .eq('is_published', true);
  return (articles || []).map((a: { slug: string }) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <ArticleReader slug={slug} />;
}
```
---


### File: apps/web/app/(app)/tasks/article/[id]/page.tsx

```tsx
import { supabase } from '@/lib/supabase';
import ArticleReader from '@/components/tasks/ArticleReader';

export async function generateStaticParams() {
  const { data: articles } = await (supabase as any)
    .from('articles')
    .select('slug')
    .eq('is_published', true);
  return (articles || []).map((a: { slug: string }) => ({ id: a.slug }));
}

export default function ArticleReaderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ArticleReader slug={id} />;
}
```
---



## Music Pages


### File: apps/web/app/(app)/music/page.tsx

```tsx
'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSongs, useArtists } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import type { Song } from '@/lib/queries';

/** Isolated component so useSearchParams is inside a Suspense boundary */
function TaskAutoPlay() {
  const searchParams = useSearchParams();
  const { play, current, isPlaying } = usePlayer();

  useEffect(() => {
    const shouldPlay = searchParams?.get('play') === 'true';
    const audioUrl = searchParams?.get('audioUrl');
    if (shouldPlay && audioUrl) {
      if (current?.audio_url === audioUrl && isPlaying) return;

      const songId = searchParams?.get('songId') || 'temp-task-song';
      const taskId = searchParams?.get('taskId') || '';
      const title = searchParams?.get('title') || 'Stream Task Track';
      const coverUrl = searchParams?.get('coverUrl') || null;
      const coinReward = Number(searchParams?.get('coinReward') || 0);
      const isPosted = searchParams?.get('isPosted') === 'true';
      const isDownloadEnabled = searchParams?.get('isDownloadEnabled') === 'true';

      const songToPlay: Song = {
        id: songId,
        artist_id: 'task-creator',
        title,
        slug: 'task-track',
        description: 'Stream to earn coins',
        audio_url: audioUrl,
        cover_url: coverUrl,
        duration_seconds: 180,
        genre: null,
        coin_reward: coinReward,
        play_count: 0,
        is_featured: false,
        is_download_enabled: isDownloadEnabled,
        artist: { id: 'creator', stage_name: 'Task Artist', slug: 'task-artist', avatar_url: null, is_verified: false },
      };

      play(songToPlay, [], { id: taskId, isPosted, coinReward });
    }
  }, [searchParams, play, current, isPlaying]);

  return null;
}

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { play, current, isPlaying } = usePlayer();

  // Always fetch all songs (no filter) so genre pills are always fully populated
  const { data: allSongs = [] } = useSongs({});

  // Filtered songs — genre and search are SEPARATE params, not mixed together
  const { data: songs = [], isLoading: songsLoading, isError: songsError } = useSongs({
    genre: selectedGenre ?? undefined,
    search: searchQuery || undefined,
  });

  const { data: artists = [] } = useArtists();

  // Genre pills derived from unfiltered songs so they never disappear during a search
  const genres = useMemo(() => {
    const set = new Set<string>();
    allSongs.forEach((s) => s.genre && set.add(s.genre));
    return Array.from(set).slice(0, 10);
  }, [allSongs]);

  const playSong = (song: Song, list: Song[]) => {
    if (song.taskId) {
      play(song, list, { id: song.taskId, isPosted: true, coinReward: song.coin_reward });
    } else {
      play(song, list);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre(null);
  };

  const hasActiveFilters = !!(searchQuery || selectedGenre);

  return (
    <main className="flex-1 flex flex-col relative pb-[160px] lg:pb-[100px]">
      <Suspense fallback={null}>
        <TaskAutoPlay />
      </Suspense>

      <div className="p-margin-mobile lg:p-margin-desktop space-y-12 max-w-[1400px] mx-auto w-full">

        {/* Hero Search Section */}
        <section className="relative bg-primary-container rounded-2xl p-8 lg:p-12 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-h1-mobile lg:font-h1 text-h1-mobile lg:text-h1 text-on-primary">
              Discover the Sound of the Creative Economy
            </h2>
            <div className="w-full relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container text-[28px] group-focus-within:text-secondary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find artists, songs, podcasts..."
                className="w-full bg-surface-container-lowest/10 backdrop-blur-sm border-2 border-outline-variant/30 text-on-surface placeholder-on-primary-container/70 rounded-xl pl-14 pr-12 py-4 font-body-lg focus:border-secondary focus:ring-0 transition-all shadow-inner outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-primary-container/70 hover:text-on-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Genre Pills */}
        {genres.length > 0 && (
          <section>
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 shadow-sm transition-all ${
                  !selectedGenre
                    ? 'bg-secondary text-on-secondary border-secondary'
                    : 'bg-secondary-container text-on-secondary-container border-transparent hover:border-secondary/30'
                }`}
              >
                All Genres
              </button>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                  className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full font-label-caps text-label-caps border-2 transition-all ${
                    selectedGenre === g
                      ? 'bg-secondary text-on-secondary border-secondary shadow-md'
                      : 'bg-surface-alt text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-high hover:border-secondary/40'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {/* Active filter indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {songsLoading ? 'Filtering…' : `${songs.length} result${songs.length !== 1 ? 's' : ''}`}
                  {selectedGenre && ` in ${selectedGenre}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
                <button
                  onClick={clearFilters}
                  className="font-body-sm text-body-sm text-secondary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Songs Section */}
        <section className="space-y-6">
          <h3 className="font-h3 text-h3 text-on-background">
            {selectedGenre ? `${selectedGenre} Music` : searchQuery ? 'Search Results' : 'Trending Now'}
          </h3>

          {songsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-surface-variant animate-pulse" />
              ))}
            </div>
          ) : songsError ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-error-alert mb-2 block">wifi_off</span>
              <p className="font-body-md text-on-surface-variant">Could not load songs. Please refresh the page.</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-4xl text-on-primary-container">
                  {hasActiveFilters ? 'search_off' : 'library_music'}
                </span>
              </div>
              <h4 className="font-h3 text-h3 text-on-background">
                {hasActiveFilters ? 'No matches found' : 'No songs yet'}
              </h4>
              <p className="font-body-md text-on-surface-variant max-w-sm">
                {hasActiveFilters
                  ? 'Try a different search term or select another genre.'
                  : 'The music catalogue is being built. Artists post tracks as Stream Music tasks — complete them to earn coins!'}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-body-md px-6 py-3 rounded-xl hover:bg-surface-container-highest transition-colors mt-2"
                >
                  <span className="material-symbols-outlined">close</span>
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-body-md px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors mt-2"
                >
                  <span className="material-symbols-outlined">task_alt</span>
                  Browse Stream Tasks
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter">
              {songs.map((song) => {
                const active = current?.id === song.id && isPlaying;
                return (
                  <div key={song.id} className="group cursor-pointer" onClick={() => playSong(song, songs)}>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-surface-variant shadow-sm group-hover:shadow-md transition-all">
                      {song.cover_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {active ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                      </div>
                      {/* Animated equalizer for currently playing song */}
                      {active && (
                        <div className="absolute bottom-2 left-2 flex items-end gap-0.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-1 bg-secondary rounded-full animate-bounce"
                              style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <h4 className={`font-body-md text-body-md font-semibold truncate ${active ? 'text-secondary' : 'text-on-background'}`}>
                      {song.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {song.artist?.stage_name || 'Unknown Artist'}
                    </p>
                    {song.genre && (
                      <span className="font-label-caps text-label-caps text-on-surface-variant/60 truncate block">{song.genre}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Emerging Talents */}
        {artists.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-h3 text-h3 text-on-background">Emerging Talents</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists[0] && (
                <Link href={`/music/${artists[0].slug}`} className="col-span-1 md:col-span-2 relative rounded-2xl overflow-hidden group h-64 md:h-80 shadow-sm cursor-pointer block">
                  {artists[0].avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artists[0].avatar_url} alt={artists[0].stage_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                    <div>
                      <span className="inline-block px-3 py-1 bg-secondary-container/90 backdrop-blur text-on-secondary-container font-label-caps text-label-caps rounded-full mb-3 shadow-sm border border-secondary/50">Spotlight</span>
                      <h4 className="font-h2 text-h2 text-on-primary mb-1">{artists[0].stage_name}</h4>
                      <p className="font-body-md text-on-primary/80">Check out their latest tracks</p>
                    </div>
                    <button className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg hover:bg-secondary-fixed transition-colors">
                      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                    </button>
                  </div>
                </Link>
              )}
              {artists.slice(1, 3).map((artist) => (
                <Link key={artist.id} href={`/music/${artist.slug}`} className="relative rounded-2xl overflow-hidden group h-64 md:h-80 bg-surface-alt shadow-sm border border-outline-variant/30 flex flex-col cursor-pointer hover:border-secondary transition-colors">
                  <div className="h-1/2 w-full relative overflow-hidden">
                    {artist.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={artist.avatar_url} alt={artist.stage_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between bg-surface-container-lowest">
                    <div>
                      <h4 className="font-h3 text-h3 text-on-background mb-1 group-hover:text-secondary transition-colors">{artist.stage_name}</h4>
                      <p className="font-body-sm text-on-surface-variant line-clamp-2">{artist.bio || 'Rising talent on CMPapp.'}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="font-label-caps text-label-caps text-secondary font-bold">View Profile</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
```
---


### File: apps/web/app/(app)/music/[artist]/page.tsx

```tsx
import { supabase } from '@/lib/supabase';
import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  const { data: tasks } = await (supabase as any)
    .from('user_posted_tasks')
    .select('creator_id')
    .eq('type', 'STREAM_MUSIC')
    .eq('is_active', true);
  const ids = [...new Set((tasks || []).map((t: any) => t.creator_id))] as string[];
  return ids.map((id: string) => ({ artist: `user-${id}` }));
}

export default function ArtistPage({ params }: { params: { artist: string } }) {
  const { artist } = params;
  return <ArtistProfileClient slug={artist} />;
}
```
---


### File: apps/web/app/(app)/music/[artist]/ArtistProfileClient.tsx

```tsx
'use client';

import { useArtist } from '@/lib/hooks';
import { usePlayer } from '@/components/music/PlayerProvider';
import type { Song } from '@/lib/queries';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ArtistProfileClient({ slug }: { slug: string }) {
  const { data, isLoading } = useArtist(slug);
  const { play, current, isPlaying, toggle } = usePlayer();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 pb-24">
        <div className="h-[300px] md:h-[400px] bg-surface-variant rounded-2xl" />
        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop space-y-6">
          <div className="h-8 w-48 bg-surface-variant rounded-lg" />
          <div className="h-64 bg-surface-variant rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4">person_off</span>
        <h2 className="font-h3 text-h3 text-on-background mb-2">Artist not found</h2>
        <p className="font-body-md text-on-surface-variant">The artist you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  const { artist, songs } = data;

  const playSong = (song: Song, list: Song[]) => {
    if (song.taskId) {
      play(song, list, { id: song.taskId, isPosted: true, coinReward: song.coin_reward });
    } else {
      play(song, list);
    }
  };

  const togglePlay = (song: Song, list: Song[]) => {
    if (current?.id === song.id) {
      toggle();
    } else {
      playSong(song, list);
    }
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative bg-primary-container text-on-primary overflow-hidden">
        <div className="h-48 md:h-72 w-full bg-gradient-to-br from-primary via-primary-container to-secondary-fixed/20 relative">
          {artist.cover_url && (
            <img alt="" className="w-full h-full object-cover opacity-60" src={artist.cover_url} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/70 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10 -mt-20 md:-mt-28">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-secondary-fixed shadow-2xl shrink-0 bg-surface-variant">
              {artist.avatar_url ? (
                <img className="w-full h-full object-cover" src={artist.avatar_url} alt={artist.stage_name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-secondary-fixed">
                  <span className="material-symbols-outlined text-[48px]">person</span>
                </div>
              )}
            </div>

            <div className="flex-grow pb-4">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-secondary-fixed">{artist.stage_name}</h1>
                {artist.is_verified && (
                  <span className="bg-success-verified/20 text-success-verified px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Verified
                  </span>
                )}
              </div>
              {artist.bio && (
                <p className="font-body-lg text-on-primary-container max-w-2xl mb-6">{artist.bio}</p>
              )}
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <span className="font-label-caps text-on-primary-container">Total Streams</span>
                  <span className="font-data-lg text-h3 text-white block">{formatNumber(artist.monthly_listeners)}</span>
                </div>
                <div className="w-px h-10 bg-outline-variant/20" />
                <div>
                  <span className="font-label-caps text-on-primary-container">Genre</span>
                  <span className="font-data-lg text-h3 text-secondary-fixed block">{artist.genre || 'Various'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracks List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-h3 text-h3 text-on-background">Popular Tracks</h2>
              </div>

              {songs.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] mb-2">music_note</span>
                  <p>No tracks available yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {songs.map((track, index) => {
                    const active = current?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => togglePlay(track, songs)}
                        className={`group flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                          active ? 'bg-secondary-container/20' : 'hover:bg-surface-alt'
                        }`}
                      >
                        <span className="font-data-md text-on-surface-variant w-4 text-center">{index + 1}</span>
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant flex items-center justify-center">
                          {track.cover_url ? (
                            <img className="w-full h-full object-cover" src={track.cover_url} alt="" />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant">music_note</span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className={`font-body-md font-bold truncate transition-colors ${
                            active ? 'text-secondary' : 'text-on-background group-hover:text-secondary'
                          }`}>
                            {track.title}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                              <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                              <span className="font-data-md">{formatNumber(track.play_count)}</span>
                            </div>
                            {track.coin_reward > 0 && (
                              <div className="flex items-center gap-1 border border-secondary-fixed/50 px-2 py-0.5 rounded-full bg-secondary-fixed/10">
                                <span className="material-symbols-outlined text-[14px] text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                                <span className="font-data-md text-[10px] text-on-secondary-container">+{track.coin_reward} CMP</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePlay(track, songs); }}
                          className="bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-primary/80"
                        >
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: active && isPlaying ? "'FILL' 1" : "'FILL' 0" }}>
                            {active && isPlaying ? 'pause_circle' : 'play_circle'}
                          </span>
                        </button>
                        <span className="font-data-md text-on-surface-variant hidden md:block shrink-0">{formatDuration(track.duration_seconds)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            {/* Stream & Earn CTA */}
            <div className="bg-primary-container rounded-xl p-6 border-2 border-secondary-fixed/30 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-secondary-fixed">monetization_on</span>
              </div>
              <h3 className="font-h3 text-white mb-2 relative z-10">Stream &amp; Earn</h3>
              <p className="text-on-primary-container text-sm mb-6 relative z-10">
                Support {artist.stage_name} while earning CMP tokens. Every listen contributes to their growth and your wallet.
              </p>
              {songs.length > 0 && (
                <button
                  onClick={() => playSong(songs[0], songs)}
                  className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-on-secondary-fixed-variant transition-all relative z-10 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Start Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
---


### File: apps/web/app/(app)/music/artist/[id]/page.tsx

```tsx
import Link from 'next/link';

export function generateStaticParams() {
  return [{ id: 'aisha-m' }];
}

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const artist = {
    name: 'Aisha M.',
    genre: 'Afro-Fusion / R&B',
    bio: "Lagos-born singer, songwriter, and producer blending traditional highlife rhythms with modern R&B and electronic textures. Aisha's sound is the heartbeat of the new creative economy.",
    stats: {
      streams: '12.4M',
      listeners: '2.1M'
    },
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJyScrcc2YMz6GNwZ4-LzLytdHEeh6DDJUBd5QwnyN9-nAJ8AzxlgFXy2RHsYXfDfkAEmlYkILF60gNRjXTxAf0C4w3W3zx727aHyrvgsJfJgVCfYGCoUqJT3jUM3-9NiN9x2zj2Guh6NMI1fhwE1FV_YFEql1F-9Bca92iJaxjxYxQgv-FoKEyVT5Cnz4M_Q2X2QkgqB9GF1ev41H_drzSOmIoPuBteUgCL7RIYL9tiYHHXd5p4U02IDkUJkM9sCmUQwE0xByETE',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBm5MX0bZ5EXjRosQ9zaSSsknq22ZKyfAKDsPadqn5sJ4IAMbu77DcuV_wytvKPKnYLUtP_r59TWhAPpCE8-ckjQVxD9QLE8-a9pBcqDPyvKBhGzKSK0Bed9CK1VFprsZ0tbCN3DtKygdCuCMJRG_aDiN57NKwu8CKOZifjC8U4dmBGmgTUUKyphsnqk8nvPYTd9x5KA7E8uSuSBH0TMR-MWXCc2rszhvIBTzU12jVc1eVqiTVlY5jdWj1MinJvbLxWTocxBKWhfQ'
  };

  return (
    <div className="flex flex-col pb-24">
      <section className="relative bg-primary-container text-on-primary rounded-xl overflow-hidden shadow-sm">
        <div 
          className="h-64 md:h-80 w-full bg-cover bg-center relative" 
          style={{ backgroundImage: `url('${artist.cover}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/60 to-transparent"></div>
        </div>
        
        <div className="px-6 lg:px-10 -mt-16 relative z-10 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <img 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary-container shadow-xl object-cover" 
                src={artist.avatar} 
                alt={`${artist.name} Profile`}
              />
              <div className="text-center md:text-left mb-2">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary">{artist.name}</h1>
                <p className="font-body-lg text-body-lg text-secondary-fixed mt-1">{artist.genre}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 max-w-3xl">
            <p className="font-body-md text-body-md text-on-primary-container">
              {artist.bio}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-lg border-t border-on-primary-container/20 pt-6">
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Total Streams</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.stats.streams}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-1">Monthly Listeners</p>
              <p className="font-data-lg text-data-lg text-on-primary">{artist.stats.listeners}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 w-full">
        <h3 className="font-h3 text-h3 text-on-background mb-6">Popular Tracks</h3>
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/30">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-outline-variant/30 text-on-surface-variant font-label-caps text-label-caps">
            <div className="w-8 text-center">#</div>
            <div>Song Title</div>
            <div className="hidden sm:block">Duration</div>
            <div className="text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-outline-variant/20">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-surface-container transition-colors group">
              <div className="w-8 text-center font-data-md text-data-md text-on-surface-variant">1</div>
              <div className="flex items-center space-x-4">
                <img className="w-12 h-12 rounded bg-surface-dim object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFYK9kkVrG10ofKu9MI9fGPNYpYYPxLncZBvjMIkaxPzuehBYqZkr9AheE7Fx9yIbB4-du2F853ofDaz4q3PDPQBDfMzBbsyTlwMKo9AjAhoEhB1FUWrcY_cswsMhyiYAcjj-u9LzjC29C3P5hMRE6nUxeXHbWhQx7Ar3on3v6lK-HcVx66x13hw1Ey8A7725kZUOt4mOZBvfj-0tDn3jUkGCr3wjhNpnQqXybe5AV98o6xYBdvtuEv54NiGOKQaqaM2YzBq-8qA4" alt="Album Art" />
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-background group-hover:text-primary transition-colors">Midnight in Eko</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Aisha M.</p>
                </div>
              </div>
              <div className="hidden sm:block font-data-md text-data-md text-on-surface-variant">3:42</div>
              <div className="flex items-center space-x-3 justify-end">
                <button className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <button className="flex items-center space-x-1 border border-secondary-container text-secondary-container px-3 py-1.5 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-data-md text-data-md">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span className="flex items-center gap-1">+3 <img src="/coin.png" alt="Coin" className="w-3.5 h-3.5 object-contain" /></span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-surface-container transition-colors group">
              <div className="w-8 text-center font-data-md text-data-md text-on-surface-variant">2</div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-surface-dim flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">music_note</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-background group-hover:text-primary transition-colors">Golden Hour</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Aisha M. ft. Burna Boy</p>
                </div>
              </div>
              <div className="hidden sm:block font-data-md text-data-md text-on-surface-variant">4:15</div>
              <div className="flex items-center space-x-3 justify-end">
                <button className="w-10 h-10 rounded-full border border-primary-container text-primary-container flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <button className="flex items-center space-x-1 border border-secondary-container text-secondary-container px-3 py-1.5 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-data-md text-data-md">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span className="flex items-center gap-1">+3 <img src="/coin.png" alt="Coin" className="w-3.5 h-3.5 object-contain" /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 mb-12 w-full">
        <h3 className="font-h3 text-h3 text-on-background mb-6">Similar Artists</h3>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="min-w-[160px] flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <img className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEKvcFHlbqY5w9ndKPjw2-eTZS6F408xVSmnI76zVdm8Tudp_uYuH7qTMAUrLQ2yAehuRDrpcL9q23ke9mdUY92hfmrj8BN7s9CUZ_yQNeJXn2S06ubKK9j8lPazkf02fenk37fwpO48fPD84LJLVtMsZqV69jnNfJL1KCeMTm9IMNFyBQ-SdM-Pxc9QvENDU4iYN6fOTqPVyB5aEgUMdFRb5arM5GdZvPGKnCvCvFQZRz-PgDp8airQ4o9FlBUvlKyg8U4PBdJII" alt="Tomiwa" />
            <p className="font-body-md text-body-md font-semibold text-center text-on-background">Tomiwa</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">Afrobeats</p>
          </div>
          <div className="min-w-[160px] flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <img className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbqajHROI9Y3HckFqvKHDO-gnz9ABDULlmQqJS9dx51zBn-k77gcEm3hhjE7EjuNxEMjgqhcmGZVFXQ4D-JjbHT3PN8BjdWHo3hJs24GQrKuOrB4U4UltF4IRk4LSbJEwwFqU4hk5jzCX_LcvPRgojaQnYG7rXC8IgqwLHDKd6SHuQWvo-pJ99Je6JPvwRR6P2VCDDjEEnlFO4uOgGPPypSZ_0axU_AiNEv2HSwAihj797cRiYZJ9IUj-hD-RV_OrGmhI7pMyVhY" alt="Zainab" />
            <p className="font-body-md text-body-md font-semibold text-center text-on-background">Zainab</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">Neo-Soul</p>
          </div>
          <div className="min-w-[160px] flex flex-col items-center p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-full bg-surface-dim flex items-center justify-center text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-[32px]">person</span>
            </div>
            <p className="font-body-md text-body-md font-semibold text-center text-on-background">DJ K-Flex</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-3">Producer</p>
          </div>
        </div>
      </section>
    </div>
  );
}
```
---

