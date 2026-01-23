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
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFBFC',
          muted: '#F5F7F9',
        },
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          'surface-soft': '#334155',
        },
      },
    },
  },
  plugins: [],
};
