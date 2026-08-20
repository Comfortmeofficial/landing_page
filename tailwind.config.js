/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E1F33',
          50: '#F3F4F5',
          100: '#DBDDE0',
          200: '#B7BCC2',
          300: '#939AA3',
          400: '#6E7984',
          500: '#0E1F33',
          600: '#0B1929',
          700: '#09131F',
          800: '#060D15',
          900: '#03070A',
        },
        secondary: {
          DEFAULT: '#5BA8FF',
          50: '#F0F6FF',
          100: '#D9E6F5',
          200: '#B3CDEB',
          300: '#8CB4E1',
          400: '#669BD7',
          500: '#5BA8FF',
          600: '#4A90E2',
          700: '#3878C5',
          800: '#2660A8',
          900: '#14488B',
        },
        navy: {
          DEFAULT: '#0E1F33',
          50: '#F3F4F5',
          100: '#DBDDE0',
          500: '#0E1F33',
          600: '#0B1929',
          700: '#09131F',
          800: '#060D15',
          900: '#03070A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
