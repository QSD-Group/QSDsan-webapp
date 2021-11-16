const widths = {
  0: '0',
  '1/12': '8.33%',
  '2/12': '16.66%',
  '3/12': '25%',
  '4/12': '33.33%',
  '5/12': '41.66%',
  '6/12': '50%',
  '7/12': '58.33%',
  '8/12': '66.66%',
  '9/12': '75%',
  '10/12': '83.33%',
  '11/12': '91.66%',
  full: '100%',
}

module.exports = {
  // mode: 'jit', // new in v2.1 // https://tailwindcss.com/docs/just-in-time-mode
  // JIT doesn't allow variable in className (i.e. class change based on prop)
  purge: {
    enabled: process.env.NODE_ENV === 'production', // set it to false for live style compile updates
    // This list should include any files in your project that reference any of your styles by name.
    // For example, if you have a JS file in your project that dynamically toggles some classes in your HTML,
    //  you should make sure to include that file in this list.
    content: ['./src/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './public/*.html', './public/**/*.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // https://marketing.illinois.edu/design/color
        illini: {
          blue: '#13294B',
          orange: '#FF552E',
        },
        altgeld: '#DD3403',
        alma: {
          DEFAULT: '#1E3877',
          300: '#4D69A0',
          200: '#849BC1',
          100: '#AFC7DB',
        },
        industrial: {
          DEFAULT: '#1D58A7',
          300: '#5783BC',
          200: '#90AED5',
          100: '#CAD9EF',
        },
        arches: {
          DEFAULT: '#009FD4',
          300: '#7FC3E1',
          200: '#A6D7EB',
          100: '#D2EBF5',
        },
        cloud: {
          DEFAULT: '#F8FAFC',
          300: '#D2D2D2',
          200: '#DDDEDE',
          100: '#E8E9EB',
        },
        heritage: {
          DEFAULT: '#F5821E',
          300: '#B74D04',
          200: '#CE5E11',
          100: '#E56E15',
        },
      },
      // <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;700&family=IBM+Plex+Serif:wght@300;400;700&display=swap" />
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      minWidth: widths,
      maxWidth: widths,
      // minHeight: widths,
      // maxHeight: widths,
      height: {
        112: '28rem',
      },
    },
  },
  variants: {
    extend: {
      // READ: https://tailwindcss.com/docs/hover-focus-and-other-states#last-child
      // enables last-child (last:)
      borderWidth: ['last'],
    },
  },
  plugins: [],
}
