/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        defaultGreen: '#099500',
        secondary: '#f29200',
        'light-secondary': '#f5e1c2',
        white: '#fff',
        black: '#000',
        smoke: '#FAFBFF',
        footer: '#1C1B1F',
        overlay: 'rgba(0, 0, 0, 0.8)',
        'overlay-white': 'rgb(255,255, 255, 0.6)',
        'brown-bg': '#f2ebd1'

      },
    },
    fontFamily: {
      sans: 'montserrat',
      roboto: 'roboto',
      anek: "'Anek Devanagari'",
    },
    keyframes: {    
      slideToRight: {
        '0%': { transform: 'translateX(-50%)', opacity: 0 },
        '100%': { transform: 'translateX(0%)', opacity: 1 }
      },
      slideToBottom: {
        '0%': { transform: 'translateY(-50%)', opacity: 0 },
        '100%': { transform: 'translateY(0%)', opacity: 1 }
      },
      pulse: {
        '0%': {
          opacity: 1
        },
        '50%': {
          opacity: .5
        },
        '100%': {
          opacity: 1
        },
      },
      ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0,
          }
      },
      openAddToCard: {
        '0%': { width: '40px' },
        '100%': { width: '100px' }
      },
      closeAddToCard: {
        '0%': { maxWidth: '100px' },
        '100%': { maxWidth: '40px' },
      }

    },
    animation: {
      'slide-right': 'slideToRight 200ms ease-in-out',
      'slide-right-infinite': 'slideToRight 900ms ease-in-out infinite',
      'slide-bottom-infinite': 'slideToBottom 900ms ease-in-out infinite',
      'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      'open-add-to-card': 'openAddToCard 200ms ease-in-out',
      'close-add-to-card': 'closeAddToCard 250ms ease-in-out'
    },
    boxShadow: {
      custom: '0px 0px 8px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.04)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      search: 'rgba(0, 0, 0, .5) 0px -2px 0px inset'
    }
  },
  plugins: [],
}