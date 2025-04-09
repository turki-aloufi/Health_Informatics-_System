import PrimeUI from 'tailwindcss-primeui'

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',

  theme: {
    extend: {
      backgroundColor: {
        surface: 'var(--p-content-background)',
      },
      colors: {
        content: {
          'hover-background': 'var(--p-content-hover-background)',
          background: 'var(--p-content-background)',
        },
      },
      screens: {
        Small: '370px',
        medium: '768px',
        large: '960px',
      },
    },
  },
  plugins: [PrimeUI],
}
