export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#202123',
          800: '#2A2B32',
          700: '#353740',
          600: '#4E4F60',
        }
      }
    },
  },
  plugins: [],
}