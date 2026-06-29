export const typography = {
  fontFamily: {
    headers: 'Archivo, sans-serif',
    body: 'Figtree, sans-serif'
  },
  fontSize: {
    h1: {
      desktop: '57px',
      mobile: '32px',
      lineHeight: '1.12'
    },
    h2: {
      desktop: '45px',
      mobile: '24px',
      lineHeight: '1.15'
    },
    body1: {
      desktop: '16px',
      mobile: '14px',
      lineHeight: '1.5'
    },
    caption: {
      desktop: '12px',
      mobile: '11px',
      lineHeight: '1.33'
    }
  },
  maxWidths: {
    readingWidth: '650px'
  }
} as const;
