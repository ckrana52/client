const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xxs: '340px',
        xs: '400px',
      },
      colors: {
        primary: {
          DEFAULT: '#334bc5',
          50: '#7AF38C',
          100: '#ABB5E3',
          200: '#2F4288',
          300: '#334bc5',
          400: '#334bc5',
          500: '#334bc5',
          600: '#162971',
          700: '#063F0E',
          800: '#010C03',
          900: '#000000',
          950: '#000000'
        },
        gray: {
          50: '#F5F5FD',
          100: '#EEEEF7',
          200: '#DDDDEF',
          300: '#B8B8CF',
          400: '#8A8AA0',
          500: '#505062',
          600: '#3A3A54',
          700: '#000000',
          800: '#191938',
          900: '#0F0F2F',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addComponents, theme }) {
      const colors = theme('colors');

      addComponents({
        '._btn': {
          'font-size': '15px',
          padding: '8px 16px',
          transition: '200ms ease-in-out',
          'font-weight': '500',
          'border-width': '1px',
          'border-radius': '100px !important',
          outline: 'none',
          'text-decoration': 'none',
          'user-select': 'none',
          position: 'relative',
          display: 'inline-block',

          // Sizes
          '&.extra_small': {
            'font-size': '10px',
            padding: '4px 10px',
            borderRadius: '3px',
          },
          '&.small': {
            'font-size': '13px',
            padding: '6px 12px',
            borderRadius: '4px',
          },
          '&.large': {
            'font-size': '17px',
            padding: '10px 20px',
          },

          // Disabled
          '&:disabled': {
            opacity: '0.4 !important',
            'pointer-events': 'none !important',
          },

          '&:disabled._btn_laoding': {
            opacity: '1 !important',
          },
        },
      });

      Object.keys(colors).forEach((color) => {
        const colorObject = colors[color];
        const mainColor = colorObject[500] || colorObject?.main || colorObject;
        const hoverColor = colorObject[600] || colorObject?.dark || colorObject;
        const lightColor =
          colorObject[100] || colorObject?.light || colorObject;
        const contrastColor = colorObject?.contrastColor || '#fff';

        const isPrimary = color === 'primary' ? ', &.primary' : '';

        addComponents({
          '._btn': {
            ...(isPrimary && {
              background: mainColor,
              color: contrastColor,

              '&:hover': {
                background: hoverColor,
              },
            }),

            // Colors
            [`&.${color}`]: {
              background: mainColor,
              color: contrastColor,

              '&:hover': {
                background: hoverColor,
              },
            },

            // Outlined Varient
            [`&.${color}.outlined ${isPrimary ? ', &.outlined' : ''}`]: {
              'border-color': mainColor,
              color: mainColor,
              background: contrastColor,

              '&:hover': {
                background: lightColor,
              },
            },

            // Text Varient
            [`&.${color}.text ${isPrimary ? ', &.text' : ''}`]: {
              'border-color': 'transparent',
              color: mainColor,
              background: 'transparent',

              '&:hover': {
                background: lightColor,
              },
            },
          },
        });
      });
    }),
  ],
};
