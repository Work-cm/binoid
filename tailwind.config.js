/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BinoidStore brand palette — Indigo (primary) + Coral (accent).
        // Legacy class names (emerald/lime/sky/cyan/violet/purple/fuchsia) are
        // remapped so the whole site re-themes from one place.
        indigo: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        coral: {
          50:  '#fff4f0',
          100: '#ffe4db',
          200: '#ffc9b8',
          300: '#ffa68a',
          400: '#ff8a65',
          500: '#ff6b4a',
          600: '#f04e2b',
          700: '#c93d1f',
          800: '#a3331c',
          900: '#852e1c',
          950: '#48140a',
        },
        emerald: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        lime: {
          50:  '#fff4f0',
          100: '#ffe4db',
          200: '#ffc9b8',
          300: '#ffa68a',
          400: '#ff8a65',
          500: '#ff6b4a',
          600: '#f04e2b',
          700: '#c93d1f',
          800: '#a3331c',
          900: '#852e1c',
          950: '#48140a',
        },
        sky: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        cyan: {
          50:  '#fff4f0',
          100: '#ffe4db',
          200: '#ffc9b8',
          300: '#ffa68a',
          400: '#ff8a65',
          500: '#ff6b4a',
          600: '#f04e2b',
          700: '#c93d1f',
          800: '#a3331c',
          900: '#852e1c',
          950: '#48140a',
        },
        violet: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        purple: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        fuchsia: {
          50:  '#fff4f0',
          100: '#ffe4db',
          200: '#ffc9b8',
          300: '#ffa68a',
          400: '#ff8a65',
          500: '#ff6b4a',
          600: '#f04e2b',
          700: '#c93d1f',
          800: '#a3331c',
          900: '#852e1c',
          950: '#48140a',
        },
        primary: {
          DEFAULT: '#4f46e5', // Indigo-600
          dark: '#4338ca',    // Indigo-700
          light: '#6366f1',   // Indigo-500
        },
        accent: {
          DEFAULT: '#ff6b4a', // Coral-500
          dark: '#f04e2b',    // Coral-600
          light: '#ff8a65',   // Coral-400
        },
        ink: {
          DEFAULT: '#12123a', // deep indigo ink — header / footer bg
          light: '#1b1b4f',
          lighter: '#252566',
        },
        void: {
          DEFAULT: '#12123a',
          light: '#1b1b4f',
          lighter: '#252566',
        },
        dark: {
          DEFAULT: '#f3f4f6', // Gray-100
          lighter: '#f9fafb', // Gray-50
          darker: '#e5e7eb',  // Gray-200
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'orbit': 'orbit 12s linear infinite',
        'text-shimmer': 'textShimmer 3s linear infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'letter-bounce': 'letterBounce 1.4s ease-in-out infinite',
        'caret-blink': 'caretBlink 0.8s step-end infinite',
        'marquee': 'marquee 30s linear infinite',
        'ticker-vertical': 'tickerVertical 24s linear infinite',
        'spin-slow': 'orbit 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(79,70,229,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(79,70,229,0.7), 0 0 50px rgba(255,107,74,0.35)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        letterBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10%)' },
        },
        caretBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tickerVertical: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
