/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkHover: '#2e2c2c', 
        lightHover: '#f2e9e9',
        darkBg:'#171717',
        ligthBg:'#ffffff'
      },
    },
  },
  plugins: [],
};
