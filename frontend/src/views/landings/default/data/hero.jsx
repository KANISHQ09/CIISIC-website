// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { SECTION_PATH } from '@/path';

export const hero = {
  headLine: 'Bridging Academia and Industry for Innovation Excellence',
  captionLine:
    'A state-level collaborative platform linking students, academic institutions, and leading industries to tackle real-world challenges through innovation.',
  primaryBtn: { children: 'Browse Challenges', href: '/challenges' },
  videoSrc: 'https://d2elhhoq00m1pj.cloudfront.net/saasable-intro.mp4',
  videoThumbnail: '/assets/videos/thumbnails/intro-thumbnail.png',
  listData: [
    { image: '/assets/images/shared/celebration.svg', title: 'Excellence Cells' },
    { image: '/assets/images/shared/celebration.svg', title: 'Corporate Challenges' },
    { image: '/assets/images/shared/celebration.svg', title: 'Student Internships' },
    { image: '/assets/images/shared/celebration.svg', title: 'Verifiable Badges' }
  ]
};
