'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

// @project
import OverviewCard from '@/components/cards/OverviewCard';
import { getRadiusStyles } from '@/utils/getRadiusStyles';

// @assets
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

/***************************  CARDS - BORDER WITH RADIUS  ***************************/

export function applyBorderWithRadius(radius, theme) {
  return {
    overflow: 'hidden',
    '--Grid-borderWidth': '1px',
    borderTop: 'var(--Grid-borderWidth) solid',
    borderLeft: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
    '& > div': {
      overflow: 'hidden',
      borderRight: 'var(--Grid-borderWidth) solid',
      borderBottom: 'var(--Grid-borderWidth) solid',
      borderColor: 'divider',
      [theme.breakpoints.down('md')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft'),
        '&:nth-of-type(4)': getRadiusStyles(radius, 'bottomRight')
      },
      [theme.breakpoints.up('md')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}

/***************************   OVERVIEW CARD -DATA  ***************************/

const overviewAnalytics = [
  {
    title: 'Active Challenges',
    value: '24',
    compare: 'Compare to last month',
    chip: {
      label: '12%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'Student Proposals',
    value: '142',
    compare: 'Compare to last month',
    chip: {
      label: '28.5%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'Institution Partners',
    value: '158',
    compare: 'Compare to last month',
    chip: {
      label: '8.4%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'Excellence Cells',
    value: '150',
    compare: 'Compare to last month',
    chip: {
      label: '15%',
      avatar: <IconArrowUp />
    }
  }
];

/***************************   OVERVIEW - CARDS  ***************************/

export default function AnalyticsOverviewCard() {
  const theme = useTheme();

  return (
    <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
      {overviewAnalytics.map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }}>
          <OverviewCard {...{ ...item, cardProps: { sx: { border: 'none', borderRadius: 0, boxShadow: 'none' } } }} />
        </Grid>
      ))}
    </Grid>
  );
}
