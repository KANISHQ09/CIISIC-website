// @project
import { landingMegamenu, pagesMegamenu } from '../../common-data';
import SvgIcon from '@/components/SvgIcon';
import { SECTION_PATH, ADMIN_PATH, BUY_NOW_URL, DOCS_URL, FREEBIES_URL } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: false,
  primaryBtn: { children: 'Access Portal', href: '/auth/login' },
  navItems: [
    { id: 'home', title: 'Home', link: '/' },
    { id: 'about', title: 'About', link: '/about' },
    { id: 'excellence-cells', title: 'Excellence Cells', link: '/cells' },
    { id: 'challenges', title: 'Challenges', link: '/challenges' },
    { id: 'partners', title: 'Partners', link: '/partners' },
    { id: 'resources', title: 'Resources', link: '/resources' },
    { id: 'gallery', title: 'Gallery', link: '/gallery' },
    { id: 'faq', title: 'FAQ', link: '/faq' }
  ]
};
