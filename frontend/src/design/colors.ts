export const colors = {
  primary: {
    lighter: '#ebf5ff', // primary-50
    light: '#92CCFF',   // primary-200
    main: '#006397',    // primary-500
    dark: '#003E5F',    // primary-600
    darker: '#001927'   // primary-700
  },
  secondary: {
    lighter: '#D3E4F8', // secondary-100
    light: '#B7C8DB',   // secondary-200
    main: '#4F6070',    // secondary-500
    dark: '#38444F',    // secondary-600
    darker: '#0B1D2B'   // secondary-900
  },
  neutral: {
    50: '#F9F9FC',      // neutral-50
    100: '#F1F4F9',     // neutral-100
    200: '#EBEEF3',     // neutral-200
    300: '#E6E8EE',     // neutral-300
    400: '#E2E2E5',     // neutral-400
    500: '#D7DADF',     // neutral-500
    600: '#C2C7CE',     // neutral-600
    700: '#72787E',     // neutral-700
    800: '#42474E',     // neutral-800
    900: '#1A1C1E'      // neutral-900
  },
  semantic: {
    success: {
      lighter: '#C8FFC0',
      main: '#22892F',
      dark: '#006E1C'
    },
    error: {
      lighter: '#FFEDEA',
      main: '#DE3730',
      dark: '#BA1A1A'
    },
    warning: {
      lighter: '#FFEEE1',
      main: '#AE6600',
      dark: '#8B5000'
    },
    info: {
      lighter: '#D4F7FF',
      main: '#008394',
      dark: '#006876'
    }
  }
} as const;
