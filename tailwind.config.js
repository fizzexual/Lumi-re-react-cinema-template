/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        4.5: '1.125rem',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Flat, neutral "Netflix" blacks — no colour cast.
        ink: {
          950: '#080808',
          900: '#0b0b0b',
          850: '#141414',
          800: '#181818',
          750: '#1f1f1f',
          700: '#262626',
          600: '#333333',
          500: '#454545',
        },
        // Primary accent is an off-white "platinum" (kept under `gold` for class
        // stability). Drives white primary buttons + bright accent text.
        gold: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#e6e6e6',
          300: '#f5f5f5',
          400: '#ededed',
          500: '#d6d6d6',
          600: '#a8a8a8',
          700: '#7d7d7d',
        },
        // Signature red — brand mark, trending flags, primary booking CTAs.
        crimson: {
          400: '#f6121d',
          500: '#e50914',
          600: '#c11119',
          700: '#990b12',
        },
        // Used only for star ratings, so it survives the platinum remap above.
        amber: {
          300: '#f7c948',
          400: '#f5b819',
        },
      },
      boxShadow: {
        glow: '0 10px 40px -14px rgba(255,255,255,0.18)',
        'glow-crimson': '0 10px 44px -12px rgba(229,9,20,0.55)',
        card: '0 24px 60px -28px rgba(0,0,0,0.92)',
        'card-hover': '0 40px 90px -30px rgba(0,0,0,0.98)',
      },
      backgroundImage: {
        vignette:
          'radial-gradient(120% 120% at 50% 0%, transparent 45%, rgba(0,0,0,0.9) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(229,9,20,0.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(229,9,20,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(229,9,20,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        marquee: 'marquee 36s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
