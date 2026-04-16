/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#BC5724',
          light:   '#D4713A',
          dark:    '#9A4519',
        },
        secondary: {
          DEFAULT: '#FFE7DC',
          dark:    '#FFC0A1',
        },
        accent: {
          DEFAULT: '#D7E0BF',
          light:   '#E8EDD6',
          cool:    '#CDDCE0',
        },
        success: '#16803a',
        warning: '#d97706',
        error:   '#eb5757',
        neutral: {
          50:  '#FFF5EF',
          100: '#FFE7DC',
          200: '#FFC0A1',
          400: '#B89080',
          600: '#8B5A4A',
          900: '#212121',
        },
      },

      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Jost', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        micro:   ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        small:   ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        body:    ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        h4:      ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        h3:      ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        h2:      ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        h1:      ['40px', { lineHeight: '1.15', fontWeight: '700' }],
        display: ['48px', { lineHeight: '1.1', fontWeight: '700' }],
      },

      spacing: {
        'space-3xs': '2px',
        'space-2xs': '6px',
        'space-xs':  '4px',
        'space-sm':  '8px',
        'space-md':  '16px',
        'space-lg':  '24px',
        'space-xl':  '32px',
        'space-2xl': '48px',
        'space-3xl': '64px',
        'space-4xl': '96px',
        'icon-sm':   '18px',
        'touch':     '48px',
        'img-card':  '200px',
        'score-badge': '44px',
      },

      minHeight: {
        'touch': '48px',
      },

      borderRadius: {
        'radius-sm':   '3px',
        'radius-md':   '8px',
        'radius-lg':   '12px',
        'radius-full': '9999px',
      },

      boxShadow: {
        'shadow-sm': '3px 3px 0px rgba(188,87,36,0.12)',
        'shadow-md': '6px 6px 9px rgba(0,0,0,0.12)',
        'shadow-lg': '12px 12px 50px rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
}
