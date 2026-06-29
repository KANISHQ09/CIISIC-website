'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingState({ variant = 'spinner', count = 3 }) {
  if (variant === 'spinner') {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={40} thickness={4} />
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: 2, width: '100%', py: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Stack key={index} sx={{ gap: 1 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="rounded" width="100%" height={80} />
        </Stack>
      ))}
    </Stack>
  );
}

LoadingState.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'skeleton']),
  count: PropTypes.number
};
