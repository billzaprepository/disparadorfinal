/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          orange: '#FFA500',
          red: '#FF4500',
          black: '#000000',
          gray: '#1A1A1A',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(255,165,0,0.3)' },
          '100%': { textShadow: '0 0 20px rgba(255,165,0,0.6)' },
        },
      },
    },
  },
  plugins: [],
};