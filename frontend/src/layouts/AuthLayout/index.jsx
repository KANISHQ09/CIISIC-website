'use client';
import PropTypes from 'prop-types';

// @mui
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import LogoMain from '@/components/logo/LogoMain';
import GetImagePath from '@/utils/GetImagePath';

const dashBoardImage = {
  light: '/assets/images/graphics/hosting/dashboard-light.svg',
  dark: '/assets/images/graphics/hosting/dashboard-dark.svg'
};

export default function AuthLayout({ children }) {
  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Form Column */}
      <Grid
        size={{ xs: 12, md: 6, lg: 7 }}
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          overflowY: 'auto',
          p: { xs: 2, sm: 4, md: 6 }
        }}
      >
        <Box sx={{ width: 1, maxWidth: 440 }}>
          {children}
        </Box>
      </Grid>

      {/* Right Premium Graphic Column */}
      <Grid
        size={{ xs: 0, md: 6, lg: 5 }}
        sx={{
          display: { xs: 'none', md: 'block' },
          height: '100vh',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background photo */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/assets/images/cells/6.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.45))'
            }
          }}
        />

        {/* Floating Frosted Glassmorphic card overlay */}
        <Stack
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            right: 40,
            p: 4,
            bgcolor: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderRadius: 6,
            boxShadow: '0 20px 40px 0 rgba(15, 23, 42, 0.25)',
            gap: 2,
            color: '#fff'
          }}
        >
          <Box sx={{ filter: 'brightness(0) invert(1)', alignSelf: 'flex-start' }}>
            <LogoMain />
          </Box>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              CIISIC Collaboration Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, fontSize: '0.875rem' }}>
              Empowering academic hubs, industry SPOCs, and students to coordinate state-level industrial innovation challenges.
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

AuthLayout.propTypes = { children: PropTypes.any };
