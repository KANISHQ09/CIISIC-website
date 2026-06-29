'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from './Card';
import Badge from './Badge';

export default function MetricCard({ title, value, change, trend = 'success', caption }) {
  return (
    <Card>
      <Stack sx={{ gap: 2 }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'Figtree, sans-serif' }}>
          {title}
        </Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'Archivo, sans-serif' }}>
              {value}
            </Typography>
            {caption && (
              <Typography variant="caption" color="text.secondary">
                {caption}
              </Typography>
            )}
          </Stack>
          {change && <Badge label={change} color={trend} />}
        </Stack>
      </Stack>
    </Card>
  );
}

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
  trend: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'primary']),
  caption: PropTypes.string
};
