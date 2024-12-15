/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}