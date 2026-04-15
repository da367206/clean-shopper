/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1c3a13',
          light:   '#2e5c20',
          dark:    '#0f2209',
        },
        secondary: {
          DEFAULT: '#eff1e4',
          dark:    '#dde2d0',
        },
        accent: {
          DEFAULT: '#9f995b',
          light:   '#c4be84',
        },
        success: '#16803a',
        warning: '#d97706',
        error:   '#eb5757',
        neutral: {
          50:  '#fcfcf7',
          100: '#eff1e4',
          200: '#dde2d0',
          400: '#8a9a7c',
          600: '#4a5e3c',
          900: '#1c3a13',
        },
      },

      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        micro:   ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        small:   ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        body:    ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        h4:      ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        h3:      ['24px', { lineHeight: '1.35', fontWeight: '400' }],
        h2:      ['32px', { lineHeight: '1.3', fontWeight: '300' }],
        h1:      ['40px', { lineHeight: '1.25', fontWeight: '300' }],
        display: ['48px', { lineHeight: '1.2', fontWeight: '300' }],
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
        'radius-sm':   '8px',
        'radius-md':   '16px',
        'radius-lg':   '24px',
        'radius-full': '9999px',
      },

      boxShadow: {
        'shadow-sm': '0 1px 2px rgba(28,58,19,0.06)',
        'shadow-md': '0 2px 8px rgba(28,58,19,0.08)',
        'shadow-lg': '0 4px 16px rgba(28,58,19,0.10)',
      },
    },
  },
  plugins: [],
}
