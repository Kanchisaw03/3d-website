/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obsidian': '#050505',
        'cold-white': '#F5F5F5',
        'spectral-silver': '#E8E8E8',
        'faint-cyan': '#E0FFFF',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'header': ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}

