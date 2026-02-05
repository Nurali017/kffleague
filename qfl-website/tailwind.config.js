/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E4D8C',
          light: '#2A5FA3',
          dark: '#163A6B',
        },
        accent: {
          DEFAULT: '#E5B73B',
          soft: '#F0C95D',
          muted: '#C9A23A',
          cyan: '#67E8F9',
          emerald: '#6EE7B7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFBFC',
          muted: '#F5F7F9',
        },
        dark: {
          bg: '#090f1a',
          surface: '#0a162a',
          'surface-alt': '#081428',
          'surface-soft': '#111827',
          overlay: '#050a13',
          border: '#1e293b',
          'border-soft': '#334155',
        },
      },
    },
  },
  plugins: [],
};
