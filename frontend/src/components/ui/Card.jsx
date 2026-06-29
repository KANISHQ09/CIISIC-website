'use client';
import React from 'react';
import PropTypes from 'prop-types';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { radius, shadows } from '@/tokens';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: radius.card,
  boxShadow: shadows.ambient,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper || '#ffffff',
  padding: '24px',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: shadows.elevation,
  }
}));

export default function Card({ children, ...props }) {
  return (
    <StyledCard elevation={0} {...props}>
      {children}
    </StyledCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired
};
