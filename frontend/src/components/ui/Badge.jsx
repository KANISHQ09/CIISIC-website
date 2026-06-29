'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { radius } from '@/tokens';

const StyledChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: radius.btn,
  fontFamily: 'Figtree, sans-serif',
  fontWeight: 600,
  fontSize: '12px',
  height: '24px',

  ...(color === 'primary' && {
    backgroundColor: theme.palette.primary.lighter,
    color: theme.palette.primary.dark
  }),

  ...(color === 'success' && {
    backgroundColor: theme.palette.success.lighter,
    color: theme.palette.success.dark
  }),

  ...(color === 'error' && {
    backgroundColor: theme.palette.error.lighter,
    color: theme.palette.error.dark
  }),

  ...(color === 'warning' && {
    backgroundColor: theme.palette.warning.lighter,
    color: theme.palette.warning.dark
  }),

  ...(color === 'info' && {
    backgroundColor: theme.palette.info.lighter,
    color: theme.palette.info.dark
  })
}));

export default function Badge({ label, color = 'primary', ...props }) {
  return <StyledChip label={label} color={color} size="small" {...props} />;
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info'])
};
