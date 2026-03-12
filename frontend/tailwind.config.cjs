module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbfaf9',
          100: '#f3f4f6',
          200: '#e6e7ea',
          500: '#111827',
          accent: '#111827',
          accent2: '#ff6a00'
        }
      },
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui'],
        display: ['Montserrat','ui-sans-serif']
      }
    },
  },
  plugins: [],
}
