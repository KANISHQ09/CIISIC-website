'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// @project
import branding from '@/branding.json';

/***************************  LOGO - MAIN  ***************************/

export default function LogoMain() {
  const theme = useTheme();
  const logoMainPath = branding.logo.main;

  return logoMainPath ? (
    <CardMedia src={logoMainPath} component="img" alt="logo" sx={{ width: { xs: 112, lg: 140 } }} />
  ) : (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Icon portion */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'background.default',
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          fontWeight: 900,
          fontSize: '1.1rem',
          letterSpacing: 0.5
        }}
      >
        CII
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textAlign: 'left' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.05rem', letterSpacing: 0.5, mb: -0.2 }}>
          CIISIC
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 600, letterSpacing: 0.2 }}>
          MP COLLABORATION NETWORK
        </Typography>
      </Box>
    </Box>
  );
}
