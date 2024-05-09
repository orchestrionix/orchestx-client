/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gold: '#CCA483',
        grey: {
          100: '#747474',
          300: '#5C5C5C',
          500: '#444444',
          700: '#2F2F2F',
          900: '#141414',
        },
        orange: '#E67E22',
        red: '#C0392B',
        green: '#27AE60',
      },
      fontSize: {
        xs: ['14px', 'auto'],
        xsm: ['16px', 'auto'],
        small: ['17px', 'auto'],
        sm: ['20px', 'auto'],
        base: ['25px', 'auto'],
        md: ['30px', 'auto'],
        lg: ['55px', 'auto'],
        xl: ['72px', 'auto'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}


