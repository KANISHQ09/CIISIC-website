import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { motion } from './motion';
import { breakpoints } from './breakpoints';

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  breakpoints,
  containerWidths: {
    max: '1266px',
    reading: '650px'
  }
} as const;

export type DesignTokens = typeof tokens;
