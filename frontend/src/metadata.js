// @project
import branding from '@/branding.json';
import { PAGE_PATH, SECTION_PATH } from '@/path';

/***************************  SEO METADATA - MAIN LAYOUT  ***************************/

const title = 'CIISIC | Confederation of Indian Industry';
const description =
  'Collaborative Institutional Cooperation for Industrial Innovation Platform connecting students and corporate partners.';

const ogCommonMetadata = {
  locale: 'en_US',
  type: 'website',
  siteName: 'CIISIC',
  images: '/assets/images/metadata/og.png'
};

export const mainMetadata = {
  title: {
    template: `%s | ${title}`,
    default: title
  },
  description,
  applicationName: title,
  keywords: [
    'CIISIC',
    'CII',
    'Madhya Pradesh Industrial Cooperation',
    'Institutional Innovation',
    'Industrial Research Collaboration',
    'Excellence Cells'
  ],
  creator: 'CIISIC',
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title,
    description,
    url: '/',
    ...ogCommonMetadata
  }
};

/***************************  SEO METADATA - SECTIONS  ***************************/

const sectionCommonMeta = {
  title: 'Innovation Directories',
  description: `Explore ${branding.brandName} directories of challenges, active excellence cells, and academic institutions cooperating to bridge the industry-academia gap.`
};

const aboutPageCommonMeta = {
  title: 'About CIISIC',
  description: `${branding.brandName} is a dedicated platform designed to foster collaboration between the Confederation of Indian Industry (CII), academic institutions, student innovators, and expert reviewers.`
};

const careerPageCommonMeta = {
  title: 'Careers',
  description: `Join the team driving industrial-academic cooperation and innovation excellence across India.`
};

const faqPageCommonMeta = {
  title: 'FAQ',
  description: `Find answers to common questions about CIISIC challenge submissions, student verifications, reviewer scorecards, and excellence cells.`
};

const metricsPageCommonMeta = {
  title: 'Innovation Statistics',
  description: `Track metrics and statistics of active research collaborations, verified students, and completed industry project evaluations.`
};

const comingSoonPageCommonMeta = { title: 'Coming soon', description: 'Coming soon' };

const privacyPolicyCommonMeta = {
  title: 'Privacy Policy',
  description: `${branding.brandName} privacy policy details how student, institution, industry, and reviewer data is securely stored, processed, and protected.`
};

const contactUsCommonMeta = {
  title: 'Contact CIISIC Support',
  description: `Get in touch with the CIISIC team for partnership inquiries, support, or system assistance.`
};

const error404PageCommonMeta = { title: 'Error 404', description: 'Error 404' };
const error500PageCommonMeta = { title: 'Error 500', description: 'Error 500' };

const underMaintenanceCommonMeta = {
  title: 'Under Maintenance',
  description: `${branding.brandName} is undergoing scheduled system updates to improve performance for industrial-academic cooperation.`
};

export const SEO_CONTENT = {
  section: { ...sectionCommonMeta, openGraph: { ...sectionCommonMeta, ...ogCommonMetadata, url: SECTION_PATH } },
  aboutPage: { ...aboutPageCommonMeta, openGraph: { ...aboutPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.aboutPage } },
  careerPage: { ...careerPageCommonMeta, openGraph: { ...careerPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.careerPage } },
  faqPage: { ...faqPageCommonMeta, openGraph: { ...faqPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.faqPage } },
  metricsPage: { ...metricsPageCommonMeta, openGraph: { ...metricsPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.metricsPage } },
  comingSoonPage: {
    ...comingSoonPageCommonMeta,
    openGraph: { ...comingSoonPageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.comingSoon }
  },
  privacyPolicy: {
    ...privacyPolicyCommonMeta,
    openGraph: { ...privacyPolicyCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.privacyPolicyPage }
  },
  contactUs: { ...contactUsCommonMeta, openGraph: { ...contactUsCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.contactPage } },
  error404Page: { ...error404PageCommonMeta, openGraph: { ...error404PageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.error404 } },
  error500Page: { ...error500PageCommonMeta, openGraph: { ...error500PageCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.error500 } },
  underMaintenance: {
    ...underMaintenanceCommonMeta,
    openGraph: { ...underMaintenanceCommonMeta, ...ogCommonMetadata, url: PAGE_PATH.underMaintenance }
  },
  featurePage: {
    title: 'Industry Challenges',
    description: 'Discover active industrial challenge briefs posted by verified corporate partners needing innovation solutions.'
  },
  blogPage: {
    title: 'Announcements',
    description: 'Explore latest updates, news, and notifications from the CII Madhya Pradesh board.'
  },
  collaboratePage: {
    title: 'Collaborative Projects',
    description: 'Partner on research, joint development, and industrial mentorship programs.'
  },
  solutionPage: {
    title: 'Solution Proposals',
    description:
      'Submit solution designs, technical blueprints, and prototypes to industrial briefs.'
  },

  about: {
    title: 'About CIISIC',
    description: `Learn how ${branding.brandName} coordinates student solvers, academic institutions, and corporate mentors to drive regional innovation.`
  },

  metrics: {
    title: 'Ecosystem Benefits',
    description: `Track cooperation growth, student verified directories, and research project outcomes.`
  },

  forgotPassword: {
    title: 'Recover Account Access',
    description: `Recover your registered ${branding.brandName} account credentials securely.`
  },

  login: {
    title: 'Portal Authentication',
    description: `Sign in to access your student, institution, industry SPOC, or reviewer workspace.`
  },

  newPassword: {
    title: 'Create Secure Password',
    description: `Update and verify your new account access credentials.`
  },

  otpVerification: {
    title: 'Verify Secure OTP',
    description: `Complete two-factor authentication to secure your platform access.`
  },

  register: {
    title: 'Student Solver Onboarding',
    description: `Register as a student solver to begin working on active industry briefs.`
  },

  clientele: {
    title: 'Corporate Partners',
    description: `Highlighting the verified industrial partners supporting innovation programs.`
  },

  blog: {
    title: 'Ecosystem News',
    description: `Keep up with announcements and collaboration milestones from the CII board.`
  },

  color: {
    title: 'Color Palettes',
    description: `Consistent design tokens and palettes matching the official CII branding guidelines.`
  },

  comingSoon: {
    title: 'Upcoming Modules',
    description: `Preview upcoming collaboration workspaces and reporting features.`
  },

  cookie: {
    title: 'Cookie Consent',
    description: `Manage cookie preferences to personalize your platform usage.`
  },

  cta: {
    title: 'Get Involved',
    description: `Participate in the innovation ecosystem as a student solver or industry partner.`
  },

  earlyAccess: {
    title: 'Partnership Requests',
    description: `Apply as a new industrial partner or academic institution affiliate.`
  },

  error404: {
    title: 'Workspace Not Found',
    description: `The requested dashboard page or workspace could not be located.`
  },

  error500: {
    title: 'Server Error',
    description: `Encountered a server-side exception. The support team has been notified.`
  },

  faq: {
    title: 'Help Center',
    description: `Find answers to common questions about submitting solutions, verifying credentials, and grading guidelines.`
  },

  feature: {
    title: 'Active Modules',
    description: `Explore workspaces for Student Solvers, Industry SPOCs, Institution SPOCs, Reviewers, and Super Admins.`
  },

  footer: {
    title: 'CIISIC Navigation Links',
    description: `Access legal policies, support directories, and regional CII resources.`
  },

  gallery: {
    title: 'Innovation Showcase',
    description: `View past successful prototypes and resolved industrial challenges.`
  },

  hero: {
    title: 'Industrial Collaboration Hub',
    description: `Instantly connect university talent with industrial research challenges.`
  },

  icon: {
    title: 'Icons System',
    description: `Curated standard lucide icons used across all portals for visual consistency.`
  },

  integration: {
    title: 'Platform Integrations',
    description: `Connect workspaces with secure email alerts, file upload servers, and Socket.IO real-time pipelines.`
  },

  megaMenu: {
    title: 'Main Navigation Directory',
    description: `Quickly navigate between landing pages, directories, and profiles.`
  },

  navbar: {
    title: 'Site Header Navigation',
    description: `Secure access points and shortcuts for active dashboard sessions.`
  },

  onBoard: {
    title: 'Solver Verification',
    description: `Complete verification steps to access active industry briefs.`
  },

  other: {
    title: 'Other Settings',
    description: 'System-wide preferences and tools.'
  },

  metrics: {
    title: 'Ecosystem Analytics',
    description: `Review participation indexes, verified student numbers, and evaluation statistics.`
  },

  process: {
    title: 'Cooperation Pipeline',
    description: `Understand the workflow: from challenge posting to student submission, evaluation, and shortlisting.`
  },

  smallHero: {
    title: 'Workspace Header',
    description: `Access custom settings and details for the selected project.`
  },

  team: {
    title: 'Executive Council',
    description: `The advisory board managing industrial-academic collaboration programs.`
  },

  testimonial: {
    title: 'Success Stories',
    description: `Read feedback from corporate partners, college deans, and student innovators.`
  },

  termsCondition: {
    title: 'Terms of Service',
    description: `Legal agreements and guidelines governing platform interactions.`
  },

  topOffer: {
    title: 'Important Announcements',
    description: `Top banner announcements regarding challenge deadlines or program milestones.`
  },

  typography: {
    title: 'Typography System',
    description: `Typography definitions ensuring legible, consistent text sizing.`
  }
};
