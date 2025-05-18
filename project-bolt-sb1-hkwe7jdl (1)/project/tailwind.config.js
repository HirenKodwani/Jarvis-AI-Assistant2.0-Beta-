/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd7ff',
          300: '#8cbdff',
          400: '#579cff',
          500: '#3178ff',
          600: '#1A56DB', // Primary color
          700: '#0e47c5',
          800: '#133aa0',
          900: '#16357e',
          950: '#112152',
        },
        purple: {
          400: '#9879FF',
          500: '#7857FF', // Accent color
          600: '#5835FF',
        },
        success: {
          50: '#edfcf2',
          100: '#d4f7e0',
          200: '#aeecc9',
          300: '#7adca9',
          400: '#3fc77f',
          500: '#22b068',
          600: '#188c51',
          700: '#167046',
          800: '#155939',
          900: '#124a30',
        },
        warning: {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#ffde89',
          300: '#ffc443',
          400: '#ffae1b',
          500: '#f98c0d',
          600: '#dd6302',
          700: '#b74206',
          800: '#94330c',
          900: '#7a2b0d',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};