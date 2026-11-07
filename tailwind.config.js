/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"King Rounded"', 'sans-serif'],
        brand: ['"King Rounded"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#0B3D3B',
          'primary-dark': '#051C1B',
          accent: '#14B8A6',
          secondary: '#99F6E4',
          surface: '#E6FFFB',
          background: '#F8FFFE',
        }
      },
    },
  },
  plugins: [],
};
