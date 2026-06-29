// @mui
import branding from '@/branding.json';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// @project
import { NextLink } from '@/components/routes';

export const cta4 = {
  headLine: 'Why Choose CIISIC for Collaborative Innovation?',
  primaryBtn: {
    children: 'Read Our Mission',
    href: '/about'
  },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '50,000+ Enrolled Students'
  },
  list: [
    { primary: 'Verified Partnerships' },
    { primary: 'Industry-Relevant Skills' },
    { primary: 'Continuous Mentorship' },
    { primary: 'Verifiable Achievement Badges' },
    { primary: 'Transparent Evaluation Rubrics' },
    { primary: 'Placement Opportunities' }
  ],
  clientContent: 'Learn More'
};

function DescriptionLine() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Have questions? Our support team is here to help.{' '}
      <Link component={NextLink} variant="caption2" color="primary" href="/faq" underline="hover">
        Read FAQ
      </Link>
    </Typography>
  );
}

export const cta5 = {
  label: 'Start Innovating Today',
  heading: 'Join the Innovation Cells Network',
  caption: 'Empowering universities and students to build state-of-the-art solutions.',
  primaryBtn: {
    children: 'Access Portal',
    href: '/auth/login'
  },
  description: <DescriptionLine />,
  saleData: { count: 150, defaultUnit: '+', caption: 'Active Excellence Cells' },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '150+ Academic Partners'
  }
};

export const cta10 = {
  heading: "Couldn't find the perfect role for you?",
  caption: 'No worries – we encourage you to apply anyway! Your unique skills and talents might be just what we need.',
  primaryBtn: { children: 'Send Your Resume', href: '#' },
  secondaryBtn: { children: 'Contact Us', href: '#' },
  image: '/assets/images/graphics/ai/graphics15-light.svg',
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '10k+ Reviews (4.5 out of 5)'
  }
};
