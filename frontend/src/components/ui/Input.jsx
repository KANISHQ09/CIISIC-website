'use client';
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { radius } from '@/tokens';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: radius.input,
    fontFamily: 'Figtree, sans-serif',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',

    '& fieldset': {
      borderColor: theme.palette.divider
    },
    '&:hover fieldset': {
      borderColor: theme.palette.text.secondary
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px'
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${theme.palette.primary.light}80`
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Figtree, sans-serif',
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main
    }
  }
}));

export default function Input({ label, variant = 'outlined', fullWidth = true, ...props }) {
  return (
    <StyledTextField
      label={label}
      variant={variant}
      fullWidth={fullWidth}
      slotProps={{
        htmlInput: {
          'aria-label': typeof label === 'string' ? label : undefined
        }
      }}
      {...props}
    />
  );
}

Input.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  fullWidth: PropTypes.bool
};
