/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Your content path is correct
  ],
  theme: {
    extend: {
      // <-- Add this entire block inside 'extend'

      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out'
      }
      // End of added block -->
    },
  },
  plugins: [],
};