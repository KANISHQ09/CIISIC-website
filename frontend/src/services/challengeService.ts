import { apiClient } from './api/client';
import { Challenge } from '@/types/studentPortal';

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    title: 'Smart Hydration Grid for Agro-Crops',
    description:
      'Design and build an automated irrigation monitoring and crop scheduling dashboard utilizing local IoT sensors to prevent ground salination and conserve agricultural water supply.',
    companyName: 'TATA AgriTech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80',
    institutionName: 'LNCT Bhopal Excellence Cell',
    difficulty: 'MEDIUM',
    skillsRequired: ['React', 'Node.js', 'IoT Protocols', 'MongoDB'],
    techStack: ['React', 'Node.js', 'Express', 'Mongoose', 'MQTT Broker'],
    deliverables: [
      'Complete React client dashboard visualizing moisture sensors',
      'Node.js REST API with automated threshold notification webhooks',
      'Comprehensive PDF design schematic and system architecture diagram'
    ],
    timeline: {
      published: '2026-06-01T00:00:00Z',
      submissionDeadline: new Date(Date.now() + 15 * 86400000).toISOString(),
      reviewCompleted: new Date(Date.now() + 30 * 86400000).toISOString()
    },
    attachments: [
      { name: 'Sensor_Specification_Data.pdf', url: '#', size: '2.4 MB' },
      { name: 'Tata_AgriTech_Irrigation_Guidelines.pdf', url: '#', size: '1.8 MB' }
    ],
    faqs: [
      {
        question: 'Is hardware simulation acceptable?',
        answer: 'Yes, a software simulation of sensory feeds via an MQTT mock script is fully acceptable.'
      },
      {
        question: 'Can students form groups?',
        answer: 'Proposals must be submitted individually, but you can consult your academic coordinators for mentorship.'
      }
    ],
    discussion: [
      {
        id: 'd1_1',
        authorName: 'Dr. Vivek Mishra',
        authorRole: 'Academic Coordinator',
        content: 'We will be setting up a physical sensor testbed in the college lab next Tuesday for student testing.',
        createdAt: '2026-06-15T09:00:00Z'
      },
      {
        id: 'd1_2',
        authorName: 'Amit Saxena',
        authorRole: 'Industry SPOC (TATA)',
        content: 'We are looking for solutions that scale well. Focus on optimizing the database indexes for sensor timelines.',
        createdAt: '2026-06-16T11:30:00Z'
      }
    ],
    status: 'OPEN',
    deadline: new Date(Date.now() + 15 * 86400000).toDateString(),
    bookmarkCount: 42,
    category: 'Internet of Things (IoT)',
    industry: 'Agriculture'
  }
];

export class ChallengeService {
  static async getChallenges(): Promise<Challenge[]> {
    try {
      const response = await apiClient.get('/api/v1/challenges');
      const list = response.data.data || [];
      return list.map((c: any) => ({
        id: c._id,
        title: c.title,
        description: c.description,
        companyName: 'Corporate Sponsor Partner',
        difficulty: c.difficulty || 'MEDIUM',
        skillsRequired: c.skillsRequired || [],
        techStack: c.techStack || [],
        deliverables: c.deliverables || [],
        timeline: c.timeline || {
          published: c.createdAt,
          submissionDeadline: c.createdAt,
          reviewCompleted: c.createdAt
        },
        status: c.status,
        deadline: c.deadline || new Date().toDateString(),
        bookmarkCount: c.bookmarkCount || 0,
        category: c.category || 'General',
        industry: c.industry || 'Tech'
      }));
    } catch {
      return DEFAULT_CHALLENGES;
    }
  }

  static async getChallengeById(id: string): Promise<Challenge | null> {
    try {
      const response = await apiClient.get(`/api/v1/challenges/${id}`);
      const c = response.data.data;
      if (!c) return null;
      return {
        id: c._id,
        title: c.title,
        description: c.description,
        companyName: 'Corporate Sponsor Partner',
        difficulty: c.difficulty || 'MEDIUM',
        skillsRequired: c.skillsRequired || [],
        techStack: c.techStack || [],
        deliverables: c.deliverables || [],
        timeline: c.timeline || {
          published: c.createdAt,
          submissionDeadline: c.createdAt,
          reviewCompleted: c.createdAt
        },
        status: c.status,
        deadline: c.deadline || new Date().toDateString(),
        bookmarkCount: c.bookmarkCount || 0,
        category: c.category || 'General',
        industry: c.industry || 'Tech'
      };
    } catch {
      const list = DEFAULT_CHALLENGES;
      return list.find((c) => c.id === id) || null;
    }
  }

  static async toggleBookmark(id: string): Promise<boolean> {
    return true;
  }

  static isBookmarked(id: string): boolean {
    return false;
  }

  static async addDiscussionComment(
    challengeId: string,
    authorName: string,
    authorRole: string,
    content: string
  ): Promise<Challenge | null> {
    return null;
  }
}
export default ChallengeService;
