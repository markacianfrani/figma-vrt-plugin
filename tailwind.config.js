module.exports = {
  content: [
    "./src/**/*.html",
    "./src/ui/ui.html",
    "./src/ui/ui.vue",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
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