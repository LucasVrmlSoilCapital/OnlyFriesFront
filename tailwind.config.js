/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette crème principale (plus épurée)
        cream: {
          50: '#FFFEF7',
          100: '#FFFBF0',
          200: '#FFF5E6',
          300: '#FFEDCD', // Couleur crème principale existante
          400: '#FFE5B8',
          500: '#FFDDA3',
          600: '#F5D18E',
          700: '#E8C47C',
          800: '#D4B16A',
          900: '#C09E58',
        },
        // Couleurs principales - rouge chaleureux
        primary: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Rouge principal
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Couleurs chaudes pour la navigation et accents
        warm: {
          50: '#FDF8F6',
          100: '#F2E8E5',
          200: '#EADDD7',
          300: '#E0D1CC',
          400: '#D69E2E',
          500: '#C05621', // Brun chaleureux pour navbar
          600: '#B45309',
          700: '#9C4221',
          800: '#7C2D12',
          900: '#451A03',
        },
        // Couleurs secondaires (jaune/orange adouci)
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24', // Jaune moins agressif
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Tons neutres épurés
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // États simplifiés
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#FBBF24', // Jaune adouci
          600: '#D97706',
          700: '#B45309',
        }
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 2px 6px 0 rgba(0, 0, 0, 0.08)',
        'strong': '0 4px 12px 0 rgba(0, 0, 0, 0.10)',
        'inner-soft': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};
