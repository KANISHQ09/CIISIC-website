'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { colors } from '@/tokens';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 6, px: 3, gap: 3, border: `1px dashed ${colors.neutral[300]}`, borderRadius: '16px' }}>
      {Icon && (
        <Icon size={48} stroke={1.5} color={colors.neutral[500]} />
      )}
      <Stack sx={{ gap: 1, maxWidth: '400px' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'Archivo, sans-serif' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Figtree, sans-serif' }}>
          {description}
        </Typography>
      </Stack>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func
};
