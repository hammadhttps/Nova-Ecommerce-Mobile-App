/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9333ea',
          dark: '#a855f7',
          gradient: ['#9333ea', '#ec4899'],
        },
        accent: '#fb923c',
        success: '#10b981',
        destructive: '#d4183d',
        background: {
          light: '#ffffff',
          dark: '#0f0f0f',
        },
        card: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        muted: {
          DEFAULT: '#ececf0',
          dark: '#262626',
        },
        border: {
          light: 'rgba(0,0,0,0.1)',
          dark: '#262626',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '16px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
    },
  },
  plugins: [],
};
