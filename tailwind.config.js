/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          500: '#7C3AED',
          600: '#6D28D9',
        },
        secondary: '#F43F5E',
        accent: '#10B981',
        warning: '#F59E0B',
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        heading: '#0F172A',
        body: '#475569',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['"Outfit"', 'Inter', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 40px -15px rgba(124, 58, 237, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'subtle-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' },
        }
      }
    },
  },
  plugins: [],
}
