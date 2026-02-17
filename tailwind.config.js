/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './shotbot_v1.tsx'],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"Jura"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
