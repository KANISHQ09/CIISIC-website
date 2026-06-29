'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';

// @project
import branding from '@/branding.json';

/***************************  LOGO - ICON  ***************************/

export default function LogoIcon() {
  const theme = useTheme();
  const logoIconPath = branding.logo.logoIcon;

  return logoIconPath ? (
    <CardMedia src={logoIconPath} component="img" alt="logo" sx={{ height: 1 }} />
  ) : (
    <Box sx={{ bgcolor: 'primary.main', color: 'background.default', px: 1, py: 0.5, borderRadius: 1.25, fontWeight: 900, fontSize: '0.9rem', letterSpacing: 0.2 }}>
      CII
    </Box>
  );
}
