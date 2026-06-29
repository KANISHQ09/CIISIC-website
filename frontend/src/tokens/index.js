/**
 * CIISIC Design Tokens v1.0
 * The single source of truth for the CIISIC platform design values.
 */

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
};

export const spacing = {
  base: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  xxl: '64px'
};

export const radius = {
  btn: '9999px',
  input: '8px',
  card: '16px',
  section: '40px'
};

export const shadows = {
  ambient: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
  elevation: '0px 8px 30px 0px rgba(0, 0, 0, 0.05)'
};

export const motion = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms'
  },
  easing: {
    spring: 'cubic-bezier(0.25, 1, 0.5, 1)', // ease-out-quart
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export const breakpoints = {
  values: {
    xs: 0,
    sm: 768,
    md: 1024,
    lg: 1266,
    xl: 1440
  }
};

export const containerWidths = {
  max: '1266px',
  reading: '650px'
};
