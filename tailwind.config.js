/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        turf: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        arena: {
          dark: '#0a0d0c',
          card: '#111714',
          surface: '#151d19',
          border: '#1f2d26',
          muted: '#8e9e95',
          gold: '#eab308',
          accent: '#00ff87'
        }
      },
      fontFamily: {
        display: ['Impact', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(0, 255, 135, 0.3)',
        'glow-lg': '0 0 40px -10px rgba(0, 255, 135, 0.45)',
        'glow-gold': '0 0 25px -5px rgba(234, 179, 8, 0.35)',
      }
    },
  },
  plugins: [],
}
