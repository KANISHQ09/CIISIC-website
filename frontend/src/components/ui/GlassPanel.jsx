'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { radius } from '@/tokens';

const StyledGlassBox = styled(Box)(({ theme }) => ({
  borderRadius: radius.card,
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
  padding: '24px',
}));

export default function GlassPanel({ children, ...props }) {
  return (
    <StyledGlassBox {...props}>
      {children}
    </StyledGlassBox>
  );
}

GlassPanel.propTypes = {
  children: PropTypes.node.isRequired
};
