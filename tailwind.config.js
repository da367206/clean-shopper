/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3DB87A',
          light:   '#72D4A8',
          dark:    '#1F8A57',
        },
        secondary: {
          DEFAULT: '#F7EDD8',
          dark:    '#EBD9B8',
        },
        accent: {
          DEFAULT: '#2196C4',
          light:   '#70C8E8',
        },
        success: '#16A34A',
        warning: '#D97706',
        error:   '#DC2626',
        neutral: {
          50:  '#FDFAF4',
          100: '#F5EDD8',
          200: '#E8D9BC',
          400: '#8B949E',
          600: '#6B5E4A',
          900: '#1E1A12',
        },
      },

      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        micro:   ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        small:   ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        body:    ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        h4:      ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        h3:      ['22px', { lineHeight: '1.35', fontWeight: '600' }],
        h2:      ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h1:      ['36px', { lineHeight: '1.25', fontWeight: '600' }],
        display: ['48px', { lineHeight: '1.2', fontWeight: '700' }],
      },

      spacing: {
        'space-xs':  '4px',
        'space-sm':  '8px',
        'space-md':  '16px',
        'space-lg':  '24px',
        'space-xl':  '32px',
        'space-2xl': '48px',
        'space-3xl': '64px',
        'space-4xl': '96px',
      },

      borderRadius: {
        'radius-sm':   '4px',
        'radius-md':   '8px',
        'radius-lg':   '16px',
        'radius-full': '9999px',
      },

      boxShadow: {
        'shadow-sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'shadow-md': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'shadow-lg': '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
