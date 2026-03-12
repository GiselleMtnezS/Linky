/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8F9FA',
          muted: '#F1F3F5',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        ink: {
          DEFAULT: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        brand: {
          DEFAULT: '#0A66C2',
          light: '#EBF3FC',
          dark: '#084D91',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
        modal: '0 20px 60px -10px rgb(0 0 0 / 0.15), 0 8px 24px -6px rgb(0 0 0 / 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
