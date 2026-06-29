'use client';
import React from 'react';
import PropTypes from 'prop-types';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { IconX } from '@tabler/icons-react';
import { styled } from '@mui/material/styles';
import { radius } from '@/tokens';
import Button from './Button';

const StyledDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: radius.card,
    padding: '16px',
    boxShadow: theme.vars.customShadows.tooltip,
  }
}));

export default function Dialog({ open, onClose, title, children, actions, ...props }) {
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm" {...props}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Archivo, sans-serif' }}>
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            <IconX size={20} />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ p: 2, fontFamily: 'Figtree, sans-serif' }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ p: 2, gap: 1 }}>
          {actions}
        </DialogActions>
      )}
    </StyledDialog>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node
};
