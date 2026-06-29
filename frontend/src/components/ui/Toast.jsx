'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { IconCheck, IconAlertCircle, IconInfoCircle, IconX } from '@tabler/icons-react';
import { colors, radius } from '@/tokens';

const StyledPaper = styled(Paper)(({ theme, type }) => ({
  borderRadius: radius.input,
  padding: '12px 16px',
  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.05)',
  borderLeft: '4px solid',
  maxWidth: '400px',

  ...(type === 'success' && {
    borderLeftColor: colors.semantic.success.main,
    backgroundColor: colors.neutral[50],
  }),
  ...(type === 'error' && {
    borderLeftColor: colors.semantic.error.main,
    backgroundColor: colors.neutral[50],
  }),
  ...(type === 'info' && {
    borderLeftColor: colors.semantic.info.main,
    backgroundColor: colors.neutral[50],
  }),
  ...(type === 'warning' && {
    borderLeftColor: colors.semantic.warning.main,
    backgroundColor: colors.neutral[50],
  })
}));

const IconMap = {
  success: <IconCheck size={20} color={colors.semantic.success.main} />,
  error: <IconX size={20} color={colors.semantic.error.main} />,
  info: <IconInfoCircle size={20} color={colors.semantic.info.main} />,
  warning: <IconAlertCircle size={20} color={colors.semantic.warning.main} />
};

export default function Toast({ message, type = 'success' }) {
  return (
    <StyledPaper elevation={0} type={type}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
        {IconMap[type]}
        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Figtree, sans-serif' }}>
          {message}
        </Typography>
      </Stack>
    </StyledPaper>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning'])
};
