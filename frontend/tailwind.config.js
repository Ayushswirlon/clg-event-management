/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.purple,
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
      },
      cursor: {
        fancy: 'url(cursor.png), auto',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
