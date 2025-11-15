/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './*.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Merriweather Sans', 'Interstate', 'ui-sans-serif', 'system-ui'],
        display: ['Interstate', 'Merriweather Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          DEFAULT: '#8B1C66',
          plum: '#8B1C66',
          primary: '#1F2937',
          secondary: '#6B7280',
          accent: '#14B8A6',
          teal: '#14B8A6',
          yellow: '#FACC15',
          magenta: '#EC4899',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          gradient: {
            start: '#EC4899',
            mid: '#8B5CF6',
            end: '#06B6D4',
          },
          overlay: 'rgba(0,0,0,0.4)',
          dark: '#0F172A',
          light: '#F8F7F4',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
