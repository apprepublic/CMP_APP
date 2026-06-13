/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          base: '#f0f0f3',
          'base-light': '#ffffff',
          'base-dark': '#e0e0e3',
          primary: '#6366f1',
          'primary-hover': '#4f46e5',
          secondary: '#fbbf24',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          text: {
            primary: '#1f2937',
            secondary: '#6b7280',
            muted: '#9ca3af',
          },
        },
        neu: {
          bg: 'var(--neu-bg-light)',
          'bg-dark': 'var(--neu-bg-dark)',
        },

        /* ----------------------------------------------------------------
         * COMPATIBILITY LAYER (added)
         * The older Material-3 and shadcn token names below are still used by
         * several pages/components (marketplace storefront, article reader,
         * dashboard layout, footer, toast). They are aliased onto the
         * neumorphic palette so those screens render instead of emitting no
         * CSS. Prefer the neo-* / neu-* tokens for any NEW work.
         * ---------------------------------------------------------------- */

        // Material-3 surfaces
        surface: '#f0f0f3',
        'surface-variant': '#e4e4e7',
        'surface-secondary': '#e0e0e3',
        'surface-container': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f7f7f9',
        'surface-container-high': '#e8e8eb',
        'on-surface': '#1f2937',
        'on-surface-variant': '#6b7280',
        background: '#f0f0f3',
        'on-background': '#1f2937',

        // Material-3 primary (brand indigo)
        primary: '#6366f1',
        'primary-container': '#6366f1',
        'on-primary': '#ffffff',
        'on-primary-container': '#ffffff',
        'on-primary-fixed-variant': '#4f46e5',

        // Material-3 secondary (brand amber)
        secondary: '#fbbf24',
        'secondary-container': '#fde68a',
        'on-secondary-container': '#1f2937',
        'secondary-fixed': '#fbbf24',
        'secondary-fixed-dim': '#f59e0b',

        // Material-3 outline
        'outline-variant': '#e0e0e3',

        // shadcn tokens (toast, footer)
        muted: '#e5e7eb',
        'muted-foreground': '#6b7280',
        foreground: '#1f2937',
        'primary-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        ring: '#6366f1',
      },
      ringOffsetColor: {
        // enables `ring-offset-background` used by toast.tsx
        background: '#f0f0f3',
      },
      boxShadow: {
        'neo-outer': '6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.8)',
        'neo-outer-lg': '10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.8)',
        'neo-inner': 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.8)',
        'neo-inner-lg': 'inset 6px 6px 10px rgba(163, 177, 198, 0.4), inset -6px -6px 10px rgba(255, 255, 255, 0.8)',
        'neo-icon': '4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.8)',
        'neu-raised': '8px 8px 16px rgba(174,174,192,0.4), -8px -8px 16px rgba(255,255,255,0.7)',
        'neu-raised-sm': '4px 4px 8px rgba(174,174,192,0.4), -4px -4px 8px rgba(255,255,255,0.7)',
        'neu-inset': 'inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(255,255,255,0.05)',
        'neu-pressed': 'inset 6px 6px 12px rgba(0,0,0,0.4), inset -6px -6px 12px rgba(255,255,255,0.05)',
        'neu-flat': '2px 2px 4px rgba(174,174,192,0.4), -2px -2px 4px rgba(255,255,255,0.7)',
      },
      borderRadius: {
        'neo': '1rem',
        'neo-lg': '1.5rem',
        'neo-xl': '2rem',
        'neu-sm': '12px',
        'neu-md': '18px',
        'neu-lg': '24px',
      },
      spacing: {
        'container-max': '1280px',
        'margin-mobile': '16px',
        'gutter': '24px',
        'margin-desktop': '40px',
        'base': '4px',
        /* stack scale (added) — used by storefront & article reader */
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '24px',
      },
      fontFamily: {
        h1: ['Montserrat', 'sans-serif'],
        h2: ['Montserrat', 'sans-serif'],
        h3: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
        label: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'data-lg': ['20px', { lineHeight: '1', fontWeight: '600' }],
        'data-md': ['14px', { lineHeight: '1', fontWeight: '500' }],
        'label-caps': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '700' }],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}