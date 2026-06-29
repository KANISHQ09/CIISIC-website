'use client';
import React from 'react';
import PropTypes from 'prop-types';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { radius, motion } from '@/tokens';

const StyledButton = styled(MuiButton)(({ theme, variant, color }) => ({
  borderRadius: radius.btn,
  textTransform: 'capitalize',
  fontFamily: 'Figtree, sans-serif',
  fontWeight: 600,
  transition: `all ${motion.duration.fast} ${motion.easing.spring}`,
  padding: '8px 24px',
  boxShadow: 'none',

  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: 'none'
  },

  '&:active': {
    transform: 'scale(0.98)'
  },

  '&:focus-visible': {
    outline: `3px solid ${theme.palette.primary.light}`,
    outlineOffset: '2px'
  },

  ...(variant === 'contained' &&
    color === 'primary' && {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark
      }
    }),

  ...(variant === 'outlined' && {
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.text.secondary,
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    }
  })
}));

export default function Button({ children, variant = 'contained', color = 'primary', ...props }) {
  return (
    <StyledButton variant={variant} color={color} {...props}>
      {children}
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'info', 'success', 'warning'])
};
