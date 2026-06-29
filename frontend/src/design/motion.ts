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
} as const;
