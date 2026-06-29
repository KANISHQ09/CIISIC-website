import { StudentProfile, Badge, LeaderboardEntry } from '@/types/studentPortal';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Madhavan Singh',
  email: 'student@lnct.ac.in',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  role: 'STUDENT',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB'],
  projects: [
    {
      title: 'Smart Agro-Monitoring Grid',
      description: 'An IoT based sensor system to monitor soil hydration, temperature, and crop health metrics in real-time.',
      link: 'https://github.com/maddy/smart-agro'
    },
    {
      title: 'Decentralized Credit Vault',
      description: 'A Web3 project for secure micro-lending capabilities among rural smallholders.',
      link: 'https://github.com/maddy/credit-vault'
    }
  ],
  education: [
    {
      institution: 'Lakshmi Narain College of Technology (LNCT)',
      degree: 'B.Tech in Computer Science & Engineering',
      year: '2023 - 2027'
    }
  ],
  resumeUrl: '#',
  resumeName: 'Madhavan_Singh_Resume.pdf',
  portfolioUrl: 'https://maddy.dev',
  socialLinks: {
    github: 'https://github.com/maddy',
    linkedin: 'https://linkedin.com/in/maddy',
    twitter: 'https://twitter.com/maddy'
  },
  completionPercentage: 85,
  points: 1240,
  level: 4,
  rank: 12
};

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'First Venture',
    description: 'Submitted your first industrial proposal to a corporate sponsor.',
    icon: '🏆',
    unlockedAt: '2026-06-12T10:30:00Z'
  },
  {
    id: 'b2',
    title: 'Cell Champion',
    description: 'Earned recommendation for a challenge from an Academic Excellence Cell.',
    icon: '⚡',
    unlockedAt: '2026-06-18T14:45:00Z'
  },
  {
    id: 'b3',
    title: 'MERN Specialist',
    description: 'Successfully verified a solution written in the Node/React stack.',
    icon: '💻',
    unlockedAt: '2026-06-25T08:15:00Z'
  }
];

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Ananya Sharma', institution: 'IIT Bombay', points: 2890, avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { rank: 2, name: 'Rohan Deshmukh', institution: 'COEP Pune', points: 2540, avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
  {
    rank: 3,
    name: 'Sneha Patel',
    institution: 'LD College of Engineering',
    points: 2310,
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg'
  },
  { rank: 11, name: 'Ayush Verma', institution: 'LNCT Bhopal', points: 1320, avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
  {
    rank: 12,
    name: 'Madhavan Singh',
    institution: 'LNCT Bhopal',
    points: 1240,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isMe: true
  },
  { rank: 13, name: 'Priya Iyer', institution: 'VIT Vellore', points: 1210, avatar: 'https://randomuser.me/api/portraits/women/47.jpg' }
];

export class StudentService {
  private static getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  private static setStorageItem<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static async getProfile(): Promise<StudentProfile> {
    return this.getStorageItem('ciisic_student_profile', DEFAULT_PROFILE);
  }

  static async updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...profile };

    // Recalculate profile completion percentage
    let filledFields = 0;
    const totalFields = 8;
    if (updated.name) filledFields++;
    if (updated.email) filledFields++;
    if (updated.skills.length > 0) filledFields++;
    if (updated.projects.length > 0) filledFields++;
    if (updated.education.length > 0) filledFields++;
    if (updated.resumeName) filledFields++;
    if (updated.portfolioUrl) filledFields++;
    if (updated.socialLinks.github || updated.socialLinks.linkedin) filledFields++;

    updated.completionPercentage = Math.round((filledFields / totalFields) * 100);

    this.setStorageItem('ciisic_student_profile', updated);
    return updated;
  }

  static async getBadges(): Promise<Badge[]> {
    return this.getStorageItem('ciisic_student_badges', DEFAULT_BADGES);
  }

  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.getStorageItem('ciisic_student_leaderboard', DEFAULT_LEADERBOARD);
  }
}
