'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import ProgressCard from '@/components/cards/ProgressCard';
import { TabsType } from '@/enum';
import { getRadiusStyles } from '@/utils/getRadiusStyles';

/***************************  TABS - DATA  ***************************/

const openChallenges = [
  { title: 'Soil Moisture Telemetry', value: '18 Proposals', progress: { value: 85 } },
  { title: 'Supply Chain Optimization', value: '12 Proposals', progress: { value: 65 } },
  { title: 'EV Battery Cooling System', value: '9 Proposals', progress: { value: 45 } },
  { title: 'Smart Agricultural Drone Control', value: '15 Proposals', progress: { value: 75 } },
  { title: 'Automated Defect Detection', value: '7 Proposals', progress: { value: 35 } }
];

const inProgressChallenges = [
  { title: 'Rural Water Filtration', value: 'Under Review', progress: { value: 90 } },
  { title: 'Smart Grid Logistics', value: 'Prototype Phase', progress: { value: 50 } },
  { title: 'Solar Tracking Array', value: 'In Incubation', progress: { value: 75 } },
  { title: 'IoT Soil Sensor Node', value: 'Field Testing', progress: { value: 60 } }
];

const completedChallenges = [
  { title: 'Medical Image Analyzer', value: 'Verified', progress: { value: 100 } },
  { title: 'Logistics Routing Portal', value: 'Deployed', progress: { value: 100 } },
  { title: 'Smart Pesticide Sprayer', value: 'Transferred', progress: { value: 100 } }
];

const topColleges = [
  { title: 'MANIT Bhopal', value: '42 Active Solutions', progress: { value: 92 } },
  { title: 'SGSITS Indore', value: '35 Active Solutions', progress: { value: 85 } },
  { title: 'IIT Indore', value: '28 Active Solutions', progress: { value: 78 } },
  { title: 'DAVV Indore', value: '22 Active Solutions', progress: { value: 60 } },
  { title: 'LNCT Bhopal', value: '18 Active Solutions', progress: { value: 55 } }
];

const regionalCells = [
  { title: 'Bhopal Agritech Excellence Hub', value: 'Active', progress: { value: 95 } },
  { title: 'Indore Smart Cities Lab', value: 'Active', progress: { value: 88 } },
  { title: 'Jabalpur Clean Energy Hub', value: 'Active', progress: { value: 72 } },
  { title: 'Gwalior Robotics Cell', value: 'Active', progress: { value: 65 } }
];

const corporatePartners = [
  { title: 'Tata Group', value: '14 Active Challenges', progress: { value: 90 } },
  { title: 'BHEL', value: '8 Active Challenges', progress: { value: 75 } },
  { title: 'Netlink Technologies', value: '6 Active Challenges', progress: { value: 60 } },
  { title: 'Eicher Motors', value: '5 Active Challenges', progress: { value: 55 } },
  { title: 'Lupin Pharma', value: '3 Active Challenges', progress: { value: 40 } }
];

const govtDepartments = [
  { title: 'MP Science & Tech Council', value: 'Partner', progress: { value: 95 } },
  { title: 'MSME Department MP', value: 'Partner', progress: { value: 85 } },
  { title: 'Innovation Madhya Pradesh', value: 'Partner', progress: { value: 90 } }
];

const innovationHubs = [
  { title: 'MP Incubator Network', value: 'Active', progress: { value: 85 } },
  { title: 'Bhopal Smart City Incubation', value: 'Active', progress: { value: 80 } },
  { title: 'CII-Young Indians Hub', value: 'Active', progress: { value: 75 } }
];

/***************************  TABS - A11Y  ***************************/

function a11yProps(value) {
  return { value: value, id: `simple-tab-${value}`, 'aria-controls': `simple-tabpanel-${value}` };
}

/***************************  TABS - PANEL  ***************************/

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 1.5 }}>{children}</Box>}
    </div>
  );
}

/***************************  TABS - CONTENT  ***************************/

function TabContent({ data }) {
  return (
    <Stack sx={{ gap: 1.25 }}>
      {data.map((item, index) => (
        <ProgressCard key={index} {...item} />
      ))}
    </Stack>
  );
}

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
      [theme.breakpoints.only('xs')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'topRight'),
        '&:last-of-type': getRadiusStyles(radius, 'bottomLeft', 'bottomRight')
      },
      [theme.breakpoints.between('sm', 'md')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft', 'bottomRight')
      },
      [theme.breakpoints.up('md')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}

/***************************  CARDS - TOP REFERRERS  ***************************/
export default function TopReferrers() {
  const theme = useTheme();
  const [challenges, setChallenges] = useState('open');
  const [hubs, setHubs] = useState('colleges');
  const [partners, setPartners] = useState('corporate');

  const handleChallenges = (event, newValue) => {
    setChallenges(newValue);
  };

  const handleHubs = (event, newValue) => {
    setHubs(newValue);
  };

  const handlePartners = (event, newValue) => {
    setPartners(newValue);
  };

  return (
    <>
      <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">Active Challenges</Typography>
            <Box>
              <Tabs
                variant="fullWidth"
                value={challenges}
                onChange={handleChallenges}
                aria-label="challenges filter"
                type={TabsType.SEGMENTED}
              >
                <Tab label="Open" {...a11yProps('open')} />
                <Tab label="Active" {...a11yProps('active')} />
                <Tab label="Closed" {...a11yProps('closed')} />
              </Tabs>
              <TabPanel value={challenges} index="open">
                <TabContent data={openChallenges} />
              </TabPanel>
              <TabPanel value={challenges} index="active">
                <TabContent data={inProgressChallenges} />
              </TabPanel>
              <TabPanel value={challenges} index="closed">
                <TabContent data={completedChallenges} />
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">Institutional Hubs</Typography>
            <Box>
              <Tabs variant="fullWidth" value={hubs} onChange={handleHubs} aria-label="institutions filter" type={TabsType.SEGMENTED}>
                <Tab label="Colleges" {...a11yProps('colleges')} />
                <Tab label="Excellence Cells" {...a11yProps('cells')} />
              </Tabs>
              <TabPanel value={hubs} index="colleges">
                <TabContent data={topColleges} />
              </TabPanel>
              <TabPanel value={hubs} index="cells">
                <TabContent data={regionalCells} />
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">Collaboration Partners</Typography>
            <Box>
              <Tabs variant="fullWidth" value={partners} onChange={handlePartners} aria-label="partners filter" type={TabsType.SEGMENTED}>
                <Tab label="Corporate" {...a11yProps('corporate')} />
                <Tab label="Govt" {...a11yProps('govt')} />
                <Tab label="Hubs" {...a11yProps('hubs')} />
              </Tabs>
              <TabPanel value={partners} index="corporate">
                <TabContent data={corporatePartners} />
              </TabPanel>
              <TabPanel value={partners} index="govt">
                <TabContent data={govtDepartments} />
              </TabPanel>
              <TabPanel value={partners} index="hubs">
                <TabContent data={innovationHubs} />
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  other: PropTypes.any
};

TabContent.propTypes = { data: PropTypes.array };
