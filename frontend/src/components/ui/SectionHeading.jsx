'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Badge from './Badge';

export default function SectionHeading({ badge, title, subtitle, align = 'left', ...props }) {
  return (
    <Stack sx={{ gap: 1.5, textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start', ...props }}>
      {badge && (
        <Badge label={badge} color="primary" />
      )}
      <Typography variant="h2" sx={{ fontWeight: 700, fontFamily: 'Archivo, sans-serif' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ maxW: '650px', fontFamily: 'Figtree, sans-serif' }}>
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}

SectionHeading.propTypes = {
  badge: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right'])
};
