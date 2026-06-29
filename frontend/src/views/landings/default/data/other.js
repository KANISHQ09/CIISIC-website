// @project
import { PAGE_PATH, SECTION_PATH } from '@/path';

// @assets
const imagePrefix = '/assets/images/presentation';

// @project
import branding from '@/branding.json';

export const other = {
  heading: 'Key Innovation Focus Areas',
  description: 'Students can register for challenges across multiple tech tracks sponsored by leading enterprises.',
  primaryBtn: { children: 'View All Challenges', href: '/challenges' },
  sections: [
    {
      animationDelay: 0.2,
      title: 'Artificial Intelligence',
      subTitle: 'Machine Learning & NLP',
      image: `${imagePrefix}/hero-light.svg`,
      link: '/challenges?category=ai'
    },
    {
      animationDelay: 0.3,
      title: 'Web3 & Blockchain',
      subTitle: 'Decentralized Networks',
      image: `${imagePrefix}/cta-light.svg`,
      link: '/challenges?category=blockchain'
    },
    {
      animationDelay: 0.4,
      title: 'CleanTech & Energy',
      subTitle: 'Sustainable Solutions',
      image: `${imagePrefix}/feature-light.svg`,
      link: '/challenges?category=cleantech'
    },
    {
      animationDelay: 0.2,
      title: 'Internet of Things',
      subTitle: 'Hardware & Connected Systems',
      image: `${imagePrefix}/metrics-light.svg`,
      link: '/challenges?category=iot'
    },
    {
      animationDelay: 0.3,
      title: 'Biotechnology',
      subTitle: 'Healthcare Innovations',
      image: `${imagePrefix}/process-light.svg`,
      link: '/challenges?category=biotech'
    },
    {
      animationDelay: 0.4,
      title: 'Advanced Robotics',
      subTitle: 'Automation & Drones',
      image: `${imagePrefix}/integration-light.svg`,
      link: '/challenges?category=robotics'
    }
  ]
};

export const other3 = {
  heading: 'Join a Winning Team',
  caption: 'Be a part of a winning culture that fosters collaboration, creativity, and success in every career path',
  other: [
    {
      title: 'Product Design',
      description: 'We’re looking for a mid-level product designer to join our team.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'Remote'
        },
        {
          icon: 'tabler-history',
          name: 'Full-Time'
        }
      ],
      btn: { children: 'View Job', href: '#' }
    },
    {
      title: 'Front-End Developer',
      description: 'We’re looking for a mid-level product designer to join our team.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'Remote'
        },
        {
          icon: 'tabler-history',
          name: 'Full-Time'
        }
      ],
      btn: { children: 'View Job', href: '#' }
    },
    {
      title: 'Back-End Developer',
      description: 'We’re looking for a mid-level product designer to join our team.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'Remote'
        },
        {
          icon: 'tabler-history',
          name: 'Full-Time'
        }
      ],
      btn: { children: 'View Job', href: '#' }
    },
    {
      title: 'Scrum Master',
      description: 'We’re looking for a mid-level product designer to join our team.',
      chips: [
        {
          icon: 'tabler-map-pin',
          name: 'Remote'
        },
        {
          icon: 'tabler-history',
          name: 'Full-Time'
        }
      ],
      btn: { children: 'View Job', href: '#' }
    }
  ]
};
