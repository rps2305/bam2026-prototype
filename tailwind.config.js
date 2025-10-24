/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Merriweather Sans', 'Interstate', 'ui-sans-serif', 'system-ui'],
        display: ['Interstate', 'Merriweather Sans', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          DEFAULT: '#8B1C66',
          primary: '#8B1C66',
          magenta: '#E31362',
          pink: '#E31362',
          yellow: '#FFD829',
          blue: '#009DE0',
          purple: '#5E2E84',
          dark: '#111827',
          light: '#FDF8ED'
        }
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: [],
};
