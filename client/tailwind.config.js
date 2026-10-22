/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        canvas: '#FFFFFF',
        surface: {
          DEFAULT: '#F4F4F6',
          hover: '#EAEAEF',
          muted: '#F8F8FA',
        },
        dark: {
          DEFAULT: '#0C0C0E',
          surface: '#151518',
          card: '#1C1C20',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        ink: {
          DEFAULT: '#0C0C0E',
          muted: '#62626E',
          light: '#8E8E9C',
        },
        hairline: '#E5E5E8',
        accent: {
          DEFAULT: '#E63946',
          hover: '#D62839',
          subtle: '#FFF1F2',
        },
        amber: {
          500: '#F59E0B',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
        }
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        'frame': '32px',
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.04)',
        elevated: '0 16px 36px -12px rgba(0, 0, 0, 0.08)',
        modal: '0 25px 60px -15px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
};
