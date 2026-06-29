// @project
import { extendPaletteWithChannels, withAlpha } from '@/utils/colorUtils';
import { colors } from '@/tokens';

/***************************  DEFAULT - PALETTE  ***************************/

export function buildPalette() {
  const textPrimary = colors.neutral[900];
  const textSecondary = colors.neutral[800];

  const secondaryMain = colors.secondary.main;

  const divider = colors.neutral[200];
  const background = '#FFF';

  const disabled = colors.neutral[700];
  const disabledBackground = colors.neutral[400];

  const lightPalette = {
    primary: {
      lighter: colors.primary.lighter,
      light: colors.primary.light,
      main: colors.primary.main,
      dark: colors.primary.dark,
      darker: colors.primary.darker
    },
    secondary: {
      lighter: colors.secondary.lighter,
      light: colors.secondary.light,
      main: colors.secondary.main,
      dark: colors.secondary.dark,
      darker: colors.secondary.darker
    },
    error: {
      lighter: colors.semantic.error.lighter,
      light: colors.semantic.error.lighter,
      main: colors.semantic.error.main,
      dark: colors.semantic.error.dark,
      darker: colors.semantic.error.dark
    },
    warning: {
      lighter: colors.semantic.warning.lighter,
      light: colors.semantic.warning.lighter,
      main: colors.semantic.warning.main,
      dark: colors.semantic.warning.dark,
      darker: colors.semantic.warning.dark
    },
    success: {
      lighter: colors.semantic.success.lighter,
      light: colors.semantic.success.lighter,
      main: colors.semantic.success.main,
      dark: colors.semantic.success.dark,
      darker: colors.semantic.success.dark
    },
    info: {
      lighter: colors.semantic.info.lighter,
      light: colors.semantic.info.lighter,
      main: colors.semantic.info.main,
      dark: colors.semantic.info.dark,
      darker: colors.semantic.info.dark
    },
    grey: {
      50: colors.neutral[50],
      100: colors.neutral[100],
      200: divider,
      300: colors.neutral[300],
      400: disabledBackground,
      500: colors.neutral[500],
      600: colors.neutral[600],
      700: disabled,
      800: textSecondary,
      900: textPrimary
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: disabled
    },
    divider,
    background: {
      default: background
    },
    action: {
      hover: withAlpha(secondaryMain, 0.05),
      disabled: withAlpha(disabled, 0.6),
      disabledBackground: withAlpha(disabledBackground, 0.9)
    }
  };

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPalette);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight
    }
  };
}
