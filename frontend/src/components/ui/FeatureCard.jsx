'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { colors } from '@/tokens';
import Card from './Card';

const IconContainer = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary.lighter,
  color: colors.primary.main
}));

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card>
      <Stack sx={{ gap: 2 }}>
        {Icon && (
          <IconContainer>
            <Icon size={24} />
          </IconContainer>
        )}
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'Archivo, sans-serif' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Figtree, sans-serif' }}>
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
