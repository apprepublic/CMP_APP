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
        /* Material Design 3 - Primary */
        primary: {
          DEFAULT: 'var(--primary)',
          container: 'var(--primary-container)',
          fixed: 'var(--primary-fixed)',
          'fixed-dim': 'var(--primary-fixed-dim)',
        },
        'on-primary': {
          DEFAULT: 'var(--on-primary)',
          container: 'var(--on-primary-container)',
          fixed: 'var(--on-primary-fixed)',
          'fixed-variant': 'var(--on-primary-fixed-variant)',
        },
        
        /* Material Design 3 - Secondary (Gold) */
        secondary: {
          DEFAULT: 'var(--secondary)',
          container: 'var(--secondary-container)',
          fixed: 'var(--secondary-fixed)',
          'fixed-dim': 'var(--secondary-fixed-dim)',
        },
        'on-secondary': {
          DEFAULT: 'var(--on-secondary)',
          container: 'var(--on-secondary-container)',
          fixed: 'var(--on-secondary-fixed)',
          'fixed-variant': 'var(--on-secondary-fixed-variant)',
        },
        
        /* Material Design 3 - Tertiary */
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          container: 'var(--tertiary-container)',
          fixed: 'var(--tertiary-fixed)',
          'fixed-dim': 'var(--tertiary-fixed-dim)',
        },
        'on-tertiary': {
          DEFAULT: 'var(--on-tertiary)',
          container: 'var(--on-tertiary-container)',
          fixed: 'var(--on-tertiary-fixed)',
          'fixed-variant': 'var(--on-tertiary-fixed-variant)',
        },
        
        /* Surface Colors */
        surface: {
          DEFAULT: 'var(--surface)',
          bright: 'var(--surface-bright)',
          dim: 'var(--surface-dim)',
          alt: 'var(--surface-alt)',
          container: {
            DEFAULT: 'var(--surface-container)',
            low: 'var(--surface-container-low)',
            lowest: 'var(--surface-container-lowest)',
            high: 'var(--surface-container-high)',
            highest: 'var(--surface-container-highest)',
          },
          variant: 'var(--surface-variant)',
        },
        'on-surface': {
          DEFAULT: 'var(--on-surface)',
          variant: 'var(--on-surface-variant)',
        },
        'inverse-surface': 'var(--inverse-surface)',
        'inverse-on-surface': 'var(--inverse-on-surface)',
        
        /* Background */
        background: {
          DEFAULT: 'var(--background)',
        },
        'on-background': 'var(--on-background)',
        
        /* Outline & Borders */
        outline: {
          DEFAULT: 'var(--outline)',
          variant: 'var(--outline-variant)',
        },
        
        /* Error Colors */
        error: {
          DEFAULT: 'var(--error)',
          container: 'var(--error-container)',
          alert: 'var(--error-alert)',
        },
        'on-error': {
          DEFAULT: 'var(--on-error)',
          container: 'var(--on-error-container)',
        },
        
        /* Success */
        success: {
          verified: 'var(--success-verified)',
        },
        
        /* Special */
        'navy-glass': 'var(--navy-glass)',
        'surface-tint': 'var(--surface-tint)',
        'inverse-primary': 'var(--inverse-primary)',
        
        /* Neumorphic (for existing components) */
        neo: {
          base: '#f9f9f6',
          'base-light': '#ffffff',
          'base-dark': '#e2e3e0',
          primary: '#000000',
          'primary-hover': '#1a1a1a',
          secondary: '#ffdea6',
          success: '#2E7D32',
          error: '#ba1a1a',
          warning: '#f59e0b',
          text: {
            primary: '#1a1c1b',
            secondary: '#45474d',
            muted: '#75777e',
          },
        },
        neu: {
          bg: 'var(--neu-bg-light)',
          'bg-dark': 'var(--neu-bg-dark)',
        },

        /* ----------------------------------------------------------------
         * COMPATIBILITY LAYER (legacy shadcn/Material-3 tokens)
         * Aliased to Material 3 color system for consistency
         * ---------------------------------------------------------------- */

        // Material-3 surfaces mapped to new system
        'surface-secondary': 'var(--surface-variant)',
        
        // shadcn tokens (toast, footer)
        muted: 'var(--surface-container-high)',
        'muted-foreground': 'var(--on-surface-variant)',
        foreground: 'var(--on-surface)',
        'primary-foreground': 'var(--on-primary)',
        destructive: 'var(--error)',
        'destructive-foreground': 'var(--on-error)',
        ring: 'var(--secondary-fixed)',
      },
      ringOffsetColor: {
        // enables `ring-offset-background` used by toast.tsx
        background: '#f0f0f3',
      },
      boxShadow: {
        'neo-outer': '6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.9)',
        'neo-outer-lg': '10px 10px 20px rgba(0, 0, 0, 0.08), -10px -10px 20px rgba(255, 255, 255, 0.9)',
        'neo-inner': 'inset 4px 4px 8px rgba(0, 0, 0, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neo-inner-lg': 'inset 6px 6px 10px rgba(0, 0, 0, 0.05), inset -6px -6px 10px rgba(255, 255, 255, 0.9)',
        'neo-icon': '4px 4px 8px rgba(0, 0, 0, 0.08), -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-raised': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.7)',
        'neu-raised-sm': '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neu-pressed': 'inset 6px 6px 12px rgba(0, 0, 0, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 0.05)',
        'neu-flat': '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.7)',
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