/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"King Rounded"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Brand teal scale. 800 is the primary brand colour.
        // Use 600+ for text on white (500 fails WCAG contrast for text).
        brand: {
          50: '#EEF7F6',
          100: '#D7EEEB',
          200: '#A8DAD4',
          300: '#6FC2B8',
          500: '#14B8A6',
          600: '#0F6B64',
          700: '#0E5A55',
          800: '#0B3D3B',
          900: '#072726',
        },
        ink: {
          DEFAULT: '#13201F', // primary text
          muted: '#4F6260',   // secondary text (6.4:1 on white)
          subtle: '#5E706E',  // tertiary text (5.0:1 on white)
        },
        line: '#DCE3E1',
        canvas: '#F2F5F4',
        marigold: '#F2B705', // stars only
      },
      boxShadow: {
        card: 'none',
        pop: '0 1px 2px rgba(19, 32, 31, 0.06), 0 8px 24px -12px rgba(19, 32, 31, 0.18)',
        object: '0 2px 4px rgba(7, 39, 38, 0.18), 0 24px 48px -16px rgba(7, 39, 38, 0.45)',
      },
    },
  },
  plugins: [],
};
