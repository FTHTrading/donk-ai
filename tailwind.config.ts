import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        donk: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c0d2ff',
          300: '#92b0ff',
          400: '#5c83fb',
          500: '#3259f4',
          600: '#1f3dea',
          700: '#1a2ed7',
          800: '#1c27ae',
          900: '#1c268a',
          950: '#141755',
        },
        accent: {
          purple: '#7c3aed',
          cyan:   '#06b6d4',
          pink:   '#ec4899',
          gold:   '#f59e0b',
          green:  '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-light':  'bounce 2s infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'wave':          'wave 1.4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px #3259f4, 0 0 20px #3259f4' },
          to:   { boxShadow: '0 0 20px #7c3aed, 0 0 40px #7c3aed' },
        },
        wave: {
          '0%, 60%, 100%': { transform: 'initial' },
          '30%':            { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
