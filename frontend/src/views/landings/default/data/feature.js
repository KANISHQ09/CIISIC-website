// @project
import branding from '@/branding.json';
import { IconType } from '@/enum';
import { SECTION_PATH, BUY_NOW_URL, ADMIN_PATH, DOCS_URL } from '@/path';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

export const feature2 = {
  heading: 'Culture of Innovation',
  caption:
    'Join a team that embraces forward-thinking ideas, fosters innovation, and cultivates an environment where your creativity can flourish.',
  features: [
    {
      icon: { name: 'tabler-users', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Teamwork',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: { name: 'tabler-star', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Inclusivity',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: { name: 'tabler-chart-histogram', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Growth',
      content: 'Our culture prioritizes continuous learning, encouraging personal and professional development. '
    }
  ]
};

export const feature5 = {
  heading: 'Beyond the 9-to-5',
  caption: 'Our benefits go beyond the standard, ensuring your life outside of work is just as fulfilling.',
  image1: '/assets/images/graphics/ai/graphics3-light.svg',
  image2: '/assets/images/graphics/ai/graphics2-light.svg',
  features: [
    {
      icon: 'tabler-coin',
      title: 'Compensation',
      content: 'Enjoy a competitive salary that recognizes your skills and contributions.'
    },
    {
      icon: 'tabler-health-recognition',
      title: 'Healthcare',
      content: "Access to a comprehensive healthcare plan, ensuring you and your family's well-being."
    }
  ],
  features2: [
    {
      icon: 'tabler-briefcase',
      title: 'Automated Scaling',
      content: 'Embrace a flexible work environment, allowing you to balance work.'
    },
    {
      icon: 'tabler-users',
      title: 'Real-Time',
      content: 'Support your family commitments with family-friendly policies and benefits.'
    }
  ],
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '10k+ Reviews (4.5 out of 5)'
  },
  content: 'Explore diverse career paths within the company through our internal mobility programs.',
  actionBtn: { children: 'Explore all Features', href: '#' }
};

export const feature20 = {
  heading: 'Core Capabilities of the CIISIC Platform',
  caption: 'Empowering collaboration between academic institutions, corporate partners, and student innovators.',
  actionBtn: { children: 'Access Portal', href: '/auth/login' },
  secondaryBtn: { children: 'Browse Challenges', href: '/challenges' },
  features: [
    {
      icon: 'tabler-building-community',
      title: 'Innovation Cells',
      content: 'Establish and coordinate Innovation and Excellence Cells at partner universities.'
    },
    {
      icon: 'tabler-target',
      title: 'Corporate Challenges',
      content: 'Tackle industry-defined challenges with realistic timelines and clear rubrics.'
    },
    {
      icon: 'tabler-users',
      title: 'Expert Mentorship',
      content: 'Receive direct design feedback and technical reviews from industry professionals.'
    },
    {
      icon: 'tabler-award',
      title: 'Verifiable Badges',
      content: 'Earn secure, verifiable digital certificates that can be shared with potential employers.'
    },
    {
      icon: 'tabler-shield-check',
      title: 'Secure Validation',
      content: 'Maintain absolute academic integrity via multi-tier coordinator endorsements.'
    },
    {
      icon: 'tabler-chart-bar',
      title: 'Detailed Analytics',
      content: 'Track engagement rates, skill distributions, and project placements.'
    }
  ]
};

export const feature21 = {
  heading: 'Synergistic Collaboration Ecosystem',
  caption: 'Aligning corporate demand with student talent and academic research infrastructure.',
  image: '/assets/images/cells/5.jpg',
  primaryBtn: { children: 'Access Portal', href: '/auth/login' },
  secondaryBtn: {
    children: 'Read Guidelines',
    href: '/resources'
  },
  features: [
    {
      animationDelay: 0.1,
      icon: 'tabler-building-fortress',
      title: 'Excellence Cells'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-lock-check',
      title: 'KYC Verification'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-user-check',
      title: 'Affiliated Rosters'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-checkbox',
      title: 'Evaluated Submissions'
    },
    {
      animationDelay: 0.1,
      icon: 'tabler-timeline',
      title: 'Structured Timelines'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-school',
      title: 'Academic Integrations'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-messages',
      title: 'Live Mentorship'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-briefcase',
      title: 'Placement Pipelines'
    }
  ]
};

export const feature = {
  heading: `What’s Inside of ${branding.brandName} Plus Version`,
  features: [
    {
      image: '/assets/images/shared/react.svg',
      title: 'CRA JavaScript',
      content: 'Ensure accessibility with WCAG compliant design for browsing.'
    },
    {
      image: '/assets/images/shared/next-js.svg',
      title: 'Next.js JavaScript',
      content: 'Tailor typography for optimal readability across all screen sizes.'
    },
    {
      image: '/assets/images/shared/react.svg',
      title: 'CRA TypeScript',
      content: 'Customize Material 3 design MUI components for enhanced aesthetics.'
    },
    {
      image: '/assets/images/shared/next-js.svg',
      title: 'Next.js TypeScript',
      content: 'Adjust content layout for visual coherence on various screen sizes.'
    },
    {
      image: '/assets/images/shared/figma.svg',
      title: 'Figma ',
      content: 'Boost visibility with SEO-friendly features for better search rankings.'
    },
    {
      title: 'Check Out Our Pricing Plan',
      content: 'Choose the plan that aligns with your SaaS product requirements.',
      actionBtn: { children: 'Pricing Plan', href: BUY_NOW_URL, ...linkProps }
    }
  ]
};

export const feature7 = {
  heading: 'Real-Time Performance Insights',
  caption: 'Gain a competitive edge with real-time performance monitoring.',
  testimonials: [
    {
      image: '/assets/images/graphics/ai/graphics6-light.svg',
      features: [
        {
          icon: 'tabler-star',
          title: 'Core Value',
          content: 'Unlock growth potential through continuous monitoring, enabling proactive strategies in a competitive landscape.'
        }
      ]
    },
    {
      image: '/assets/images/graphics/ai/graphics8-light.svg',
      features: [
        {
          icon: 'tabler-route',
          title: 'Multi-Cloud Orchestration',
          content: 'Enhances flexibility and resilience in a multi-cloud environment.'
        }
      ]
    },
    {
      image: '/assets/images/graphics/ai/graphics3-light.svg',
      features: [
        {
          icon: 'tabler-history',
          title: 'Story',
          content: 'Real-time performance insights empower teams to respond swiftly, optimizing operations and driving growth.'
        }
      ]
    }
  ],
  breadcrumbs: [{ title: 'Core Value' }, { title: 'Culture' }, { title: 'Story' }]
};

export const feature23 = {
  heading: 'Culture of Innovation',
  caption:
    'Join a team that embraces forward-thinking ideas, fosters innovation, and cultivates an environment where your creativity can flourish.',
  heading2: 'Growth',
  caption2: 'Our culture prioritizes continuous learning, encouraging personal and professional development. ',
  image: '/assets/images/graphics/default/feature23-light.png',
  primaryBtn: { children: 'Join  Our Team', href: '#' },

  features: [
    {
      icon: 'tabler-users',
      title: 'Teamwork',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: 'tabler-star',
      title: 'Inclusivity',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    }
  ]
};

export const feature18 = {
  heading: 'Tailored Portal Interfaces',
  caption: 'Customized workspaces for students, faculty coordinators, industry partners, and global administrators.',
  topics: [
    {
      icon: 'tabler-school',
      title: 'Student Workspace',
      title2: 'An Integrated Learning & Submission Portal',
      description: 'Students track tasks, manage team portfolios, submit code solutions, and consult industry mentors directly.',
      image: '/assets/images/cells/1.jpg',
      isCoverImage: true,
      list: [
        { primary: 'Personalized Learning Agenda' },
        { primary: 'Active Challenge Tracking' },
        { primary: 'Verifiable Certificates Vault' },
        { primary: 'Direct Mentor Messaging' }
      ],
      actionBtn: { children: 'Access Portal', href: '/auth/login' }
    },
    {
      icon: 'tabler-briefcase',
      title: 'Industry Workspace',
      title2: 'Talent Sourcing & Challenge Hub',
      description: 'Corporates publish custom hackathons, moderate candidate selections, and track evaluations in real-time.',
      image: '/assets/images/cells/2.jpg',
      isCoverImage: true,
      list: [
        { primary: 'Challenge Creation Wizard' },
        { primary: 'Submissions Grading Rubrics' },
        { primary: 'Shortlisted Talent Manager' },
        { primary: 'Institutional Performance Analytics' }
      ],
      actionBtn: { children: 'Access Portal', href: '/auth/login' }
    },
    {
      icon: 'tabler-building-university',
      title: 'Academic Workspace',
      title2: 'Institutional Oversight Desk',
      description: 'Universities verify enrolled students, manage Excellence Cells coordinators, and endorse challenge solutions.',
      image: '/assets/images/cells/3.jpg',
      isCoverImage: true,
      list: [
        { primary: 'Student Registry Verifications' },
        { primary: 'Excellence Cell Dashboard' },
        { primary: 'Multi-stage Solution Sign-offs' },
        { primary: 'Academic Reports Generator' }
      ],
      actionBtn: { children: 'Access Portal', href: '/auth/login' }
    },
    {
      icon: 'tabler-lock-check',
      title: 'Governance Panel',
      title2: 'Super Administrator Controls',
      description: 'System administrators moderate corporate registrations, monitor system audits, and manage parameters.',
      image: '/assets/images/cells/4.jpg',
      isCoverImage: true,
      list: [
        { primary: 'Partners Approval Queue' },
        { primary: 'Central Security Audit Logs' },
        { primary: 'CMS Content Moderation' },
        { primary: 'System Health Uptime Monitors' }
      ],
      actionBtn: { children: 'Access Portal', href: '/auth/login' }
    }
  ]
};
