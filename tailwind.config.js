/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      display: ['flex'],
      flexbox: {
        'flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}