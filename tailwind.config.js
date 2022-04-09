module.exports = {
  content: [
    "./src/**/*.html",
    "./src/ui/ui.html",
    "./src/ui/ui.vue",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {

    fontSize: {
      xs: ['0.563rem', { lineHeight: '1rem' }],
      sm: ['0.625rem', { lineHeight: '1rem' }],
      base: ['0.688rem', { lineHeight: '1rem' }],
      lg: ['0.75rem', { lineHeight: '1.75rem' }],
      xl: ['0.813rem', { lineHeight: '1.75rem' }],
      '2xl': ['0.875rem', { lineHeight: '2rem' }],
      '3xl': ['15px', { lineHeight: '2.25rem' }],
      '4xl': ['16px', { lineHeight: '2.5rem' }],
      '5xl': ['17px', { lineHeight: '1' }],
      '6xl': ['18px', { lineHeight: '1' }],
      '7xl': ['19px', { lineHeight: '1' }],
      '8xl': ['20px', { lineHeight: '1' }],
      '9xl': ['24px', { lineHeight: '1' }],
      '10xl': ['30px', { lineHeight: '1' }],
      '11xl': ['40px', { lineHeight: '1' }],
      '12xl': ['42px', { lineHeight: '1' }],
      '13xl': ['48px', { lineHeight: '1' }],
      '14xl': ['60px', { lineHeight: '1' }],
    },
    extend: {
      textColor: {
        secondary: 'var(--color-text-secondary)'
      },
      colors: {
        gray: {
          50: 'var(--theme-colors-gray-50, #FAFAFA)',
          100: 'var(--theme-colors-gray-100, #f5f5f5)',
          200: 'var(--theme-colors-gray-200, #eeeeee)',
          300: 'var(--theme-colors-gray-300, #e0e0e0)',
          400: 'var(--theme-colors-gray-400, #bdbdbd)',
          500: 'var(--theme-colors-gray-500, #9e9e9e)',
          600: 'var(--theme-colors-gray-600, #757575)',
          700: 'var(--theme-colors-gray-700, #616161)',
          800: 'var(--theme-colors-gray-800, #424242)',
          900: 'var(--theme-colors-gray-900, #212121)',
          950: 'var(--theme-colors-gray-950, #212121)',
        },
        primary: {
          50: 'var(--theme-colors-brand-50, #F5FBFF)',
          100: 'var(--theme-colors-brand-100, #E1F3FF)',
          300: 'var(--theme-colors-brand-300, #90CDF4)',
          400: 'var(--theme-colors-brand-300, #3CB1FF)',
          500: 'var(--theme-colors-brand-500, #18A0FB)',
        },
      },
      fontSize: {
        xxs: '0.7rem',
      },
      spacing: {
        '3xs': '4px',
        '2xs': '8px',
        'xs': '16px',
        'sm': '24px',
        'medium': '32px',
        'lg' : '40px',
        'xl' : '48px',
        '2xl' : '64px',
        '3xl' : '80px',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrainsMono', 'monospace'],
      },
      zIndex: {
        1: '1',
      },
      boxShadow: (theme) => ({
        focus: `0 0 0 2px ${theme('colors.primary.500')}`,
        'focus-subtle': `0 0 0 2px ${theme('colors.primary.300')}`,
        'focus-muted': `0 0 0 2px ${theme('colors.primary.400')}`,
        border: '0 0 0 1px',
      }),
    },
  },
  corePlugins: {
    preflight: false,
  },
};