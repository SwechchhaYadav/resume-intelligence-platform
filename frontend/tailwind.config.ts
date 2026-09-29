import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b1120',
        surface2: '#111a30',
        accent: '#7c5cff',
        accentSoft: '#8c78ff',
        panel: 'rgba(255, 255, 255, 0.07)',
      },
      boxShadow: {
        glow: '0 20px 100px rgba(124, 92, 255, 0.18)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(124,92,255,0.16), transparent 28%), radial-gradient(circle at 20% 40%, rgba(30,138,255,0.12), transparent 24%), radial-gradient(circle at 80% 20%, rgba(0,255,255,0.08), transparent 20%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
