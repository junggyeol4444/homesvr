import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#f8fafc',
        muted: '#1e293b',
        primary: '#6366f1',
        'primary-foreground': '#f8fafc',
        border: '#1f2937',
        card: '#111827',
        'card-foreground': '#f8fafc'
      }
    }
  },
  plugins: []
};

export default config;
