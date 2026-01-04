/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-up-delayed': 'slideUp 0.5s ease-out 0.2s forwards',
        'slide-up-delayed-2': 'slideUp 0.5s ease-out 0.4s forwards',
        'fade-in': 'fadeIn 0.6s ease-in',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(6, 182, 212, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.4)',
          },
        },
      },
    },
  },
  plugins: [],
}
