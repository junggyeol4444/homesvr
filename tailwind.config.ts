import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f5ff',
          100: '#dce7ff',
          200: '#b9cfff',
          300: '#91b3ff',
          400: '#6f9cff',
          500: '#3c7dff',
          600: '#215de6',
          700: '#1745b4',
          800: '#133a91',
          900: '#102f74'
        }
      }
    }
  },
  plugins: []
};

export default config;
