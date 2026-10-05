/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F4F3F0',
          card: '#FAF9F6',
          primary: '#2A5C43',
          accent: '#D97706',
          text: '#1C1917',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'Segoe UI', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 14px rgba(28, 25, 23, 0.08)',
      },
    },
  },
  plugins: [],
}
