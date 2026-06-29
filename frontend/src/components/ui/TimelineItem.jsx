'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { colors } from '@/tokens';

const NodeDot = styled(Box)(({ theme, active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: active ? colors.primary.main : colors.neutral[400],
  border: `3px solid ${active ? colors.primary.lighter : colors.neutral[100]}`,
  position: 'relative',
  zIndex: 2,
}));

const TimelineLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  bottom: '-12px',
  left: '5px',
  width: '2px',
  backgroundColor: colors.neutral[200],
  zIndex: 1,
}));

export default function TimelineItem({ title, description, time, active = false, isLast = false }) {
  return (
    <Stack direction="row" sx={{ position: 'relative', gap: 3, pb: 3 }}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <NodeDot active={active} />
        {!isLast && <TimelineLine />}
      </Box>
      <Stack sx={{ gap: 0.5, flex: 1 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontFamily: 'Figtree, sans-serif' }}>
            {title}
          </Typography>
          {time && (
            <Typography variant="caption" color="text.secondary">
              {time}
            </Typography>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Figtree, sans-serif' }}>
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}

TimelineItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  time: PropTypes.string,
  active: PropTypes.bool,
  isLast: PropTypes.bool
};
