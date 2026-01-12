/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0D061A',
        'brand-glass': '#1F1F1F',
        'brand-primary': '#7C3AED',
        'brand-primary-hover': '#6D28D9',
        'Levender-10': '#0D061A',
        'Levender-20': '#1B0C33',
        'button-general-bg': '#FFFFFF',
        'button-general-outline': '#E5E5E5',
        'button-general-text': '#1F1F1F',
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
