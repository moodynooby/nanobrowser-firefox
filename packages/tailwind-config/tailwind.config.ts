import type { Config } from 'tailwindcss/types/config';

export default {
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#e11d48',
          light: '#fda4af',
          dark: '#be123c',
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
