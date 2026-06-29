export interface CellDetails {
  theme: string;
  name: string;
  hostName: string;
  hostId: string;
  primaryColor: string;
  accentColor: string;
  softColor: string;
  imagePath: string;
  tagline: string;
}

export const cells: Record<string, CellDetails> = {
  FAMILY_BUSINESS: {
    theme: 'FAMILY_BUSINESS',
    name: 'Family Business & Entrepreneurship',
    hostName: 'Jagran Lakecity University, Bhopal',
    hostId: 'inst-1',
    primaryColor: '#1B3A6B',
    accentColor: '#D4A017',
    softColor: '#EBF0FA',
    imagePath: '/assets/images/cells/1.jpg',
    tagline: 'Preserving Legacy. Fueling Growth.'
  },
  TALENT_READINESS: {
    theme: 'TALENT_READINESS',
    name: 'Talent Readiness & Employability',
    hostName: 'Lakshmi Narain College of Technology, Bhopal',
    hostId: 'inst-10',
    primaryColor: '#1A5E3A',
    accentColor: '#F5A623',
    softColor: '#EAF5EE',
    imagePath: '/assets/images/cells/2.jpg',
    tagline: 'Bridging Skills. Shaping Professionals.'
  },
  RESEARCH_INNOVATION: {
    theme: 'RESEARCH_INNOVATION',
    name: 'Research & Innovation',
    hostName: 'LNCT University, Bhopal',
    hostId: 'inst-17',
    primaryColor: '#3D1A78',
    accentColor: '#D4A017',
    softColor: '#F0EAF9',
    imagePath: '/assets/images/cells/3.jpg',
    tagline: 'Inquiring Minds. Breakthrough Discoveries.'
  },
  AI_IN_BUSINESS: {
    theme: 'AI_IN_BUSINESS',
    name: 'AI in Business',
    hostName: 'Oriental Group of Institutes, Bhopal',
    hostId: 'inst-18',
    primaryColor: '#C0390A',
    accentColor: '#D4A017',
    softColor: '#FDF0EB',
    imagePath: '/assets/images/cells/4.jpg',
    tagline: 'Intelligent Enterprise. Smart Ecosystems.'
  },
  AGRITECH: {
    theme: 'AGRITECH',
    name: 'AgriTech',
    hostName: 'Rabindranath Tagore University (RNTU), Bhopal',
    hostId: 'inst-5',
    primaryColor: '#2E6B35',
    accentColor: '#8BC34A',
    softColor: '#EBF5EC',
    imagePath: '/assets/images/cells/5.jpg',
    tagline: 'Sustainable Farming. Tech-Driven Yields.'
  },
  SKILL_DEVELOPMENT: {
    theme: 'SKILL_DEVELOPMENT',
    name: 'Skill Development',
    hostName: 'Scope Global Skills University, Bhopal',
    hostId: 'inst-19',
    primaryColor: '#1B3A6B',
    accentColor: '#D4A017',
    softColor: '#EBF0FA',
    imagePath: '/assets/images/cells/6.jpg',
    tagline: 'Hands-on Learning. Global Capabilities.'
  },
  STARTUP: {
    theme: 'STARTUP',
    name: 'Startup Cell',
    hostName: 'Rabindranath Tagore University (RNTU), Bhopal',
    hostId: 'inst-5',
    primaryColor: '#0D1B2A',
    accentColor: '#E63B2E',
    softColor: '#FAEBEA',
    imagePath: '/assets/images/cells/7.jpg',
    tagline: 'Ideate. Incubate. Scale.'
  }
};
export default cells;
