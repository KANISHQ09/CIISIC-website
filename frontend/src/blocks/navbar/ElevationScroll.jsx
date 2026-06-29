import PropTypes from 'prop-types';
import { cloneElement } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { useScrollTrigger } from '@mui/material';

// @project
import { withAlpha } from '@/utils/colorUtils';

/***************************  NAVBAR - ELEVATION SCROLL  ***************************/

export default function ElevationScroll({ children, window, isFixed, triggerSX }) {
  const theme = useTheme();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  if (!isFixed) {
    return children;
  }

  const defaultStyles = {
    bgcolor: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(16px) saturate(180%)',
    borderBottom: `1px solid ${withAlpha(theme.vars.palette.divider, 0.15)}`,
    boxShadow: 'none',
    backgroundImage: 'none',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  const triggerStyles = {
    bgcolor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px) saturate(190%)',
    borderBottom: `1px solid ${withAlpha(theme.vars.palette.divider, 0.25)}`,
    boxShadow: `${withAlpha(theme.vars.palette.text.primary, 0.04)} 0px 10px 30px -10px, ${withAlpha(theme.vars.palette.text.primary, 0.02)} 0px 1px 3px`,
    ...triggerSX
  };

  return children
    ? cloneElement(children, {
        sx: {
          ...defaultStyles,
          ...(trigger && { ...triggerStyles })
        }
      })
    : null;
}

ElevationScroll.propTypes = { children: PropTypes.node, window: PropTypes.func, isFixed: PropTypes.bool, triggerSX: PropTypes.any };
