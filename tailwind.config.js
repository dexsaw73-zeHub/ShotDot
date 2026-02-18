/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './shotbot_v1.tsx'],
  safelist: [
    // Card scroll full-bleed (ensure these are in production build)
    'w-[calc(100%+3rem)]',
    '-ml-6',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"Jura"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
