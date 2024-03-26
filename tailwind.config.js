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
        'brown-bg': '#f2ebd1',
        'bg-product': 'rgba(0, 0, 0, 0.03)',
        'feed-card': 'rgba(0, 0, 0, 0.3)',
        'search-overlay': 'rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.81) 100%)',
        'map-overlay': 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.31) 100%)',
      },
      fontFamily: {
        sans: 'montserrat',
        roboto: 'roboto',
        anek: "'Anek Devanagari'",
        poppins: 'Poppins',
      },
      keyframes: {    
        slideToRight: {
          '0%': { transform: 'translateX(-50%)', opacity: 0 },
          '100%': { transform: 'translateX(0%)', opacity: 1 }
        },
        slideToBottom: {
          '0%': { transform: 'translateY(-10%)', opacity: 0 },
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
          '0%': { width: '40px', transform: 'translateX(-40px)' },
          '100%': { width: '100px' }
        },
        closeAddToCard: {
          '0%': { width: '100px' },
          '100%': { width: '40px' },
        },
        openHeader: {
          '0%': { height: '0rem' },
          '100%': { height: '5rem' },
        },
        closeHeader: {
          '0%': { height: '6rem' },
          '100%': { height: '0rem' },
        }
  
      },
      animation: {
        'slide-right': 'slideToRight 200ms ease-in-out',
        'slide-right-infinite': 'slideToRight 900ms ease-in-out infinite',
        'slide-bottom-infinite': 'slideToBottom 900ms ease-in-out infinite',
        'slide-bottom': 'slideToBottom 200ms ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'open-add-to-card': 'openAddToCard 150ms ease-in-out',
        'close-add-to-card': 'closeAddToCard 150ms ease-in-out',
        'open-header': 'openHeader 200ms ease-in-out',
        'close-header': 'closeHeader 200ms ease-in-out',
      },
      boxShadow: {
        custom: '0px 0px 8px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.04)',
        search: 'rgba(0, 0, 0, .5) 0px -2px 0px inset',
        card: 'rgba(0, 0, 0, 0.16) 0px 2px 8px',
      }
    },
  },
  plugins: [],
}