import { apiClient } from './api/client';
import { Challenge } from '@/types/studentPortal';

function mapChallenge(c: any): Challenge {
  return {
    id: c._id,
    title: c.title,
    description: c.description,
    companyName: c.companyId?.name || c.companyName || '',
    companyLogo: c.companyId?.logo || c.companyLogo || '',
    institutionName: c.institutionScope?.[0]?.name || '',
    difficulty: c.difficulty || 'MEDIUM',
    skillsRequired: c.skillsRequired || c.technologies || [],
    techStack: c.techStack || c.technologies || [],
    deliverables: c.deliverables || [],
    timeline: c.timeline || {
      published: c.createdAt,
      submissionDeadline: c.createdAt,
      reviewCompleted: c.createdAt
    },
    attachments: c.attachments || [],
    faqs: c.faqs || [],
    discussion: c.discussion || [],
    status: c.status,
    deadline: c.deadline || (c.timeline?.submissionDeadline ? new Date(c.timeline.submissionDeadline).toDateString() : ''),
    bookmarkCount: c.bookmarkCount || 0,
    category: c.category || '',
    industry: c.industry || ''
  };
}

export class ChallengeService {
  static async getChallenges(): Promise<Challenge[]> {
    const response = await apiClient.get('/api/v1/challenges');
    const list = response.data.data || [];
    return list.map(mapChallenge);
  }

  static async getChallengeById(id: string): Promise<Challenge | null> {
    const response = await apiClient.get(`/api/v1/challenges/${id}`);
    const c = response.data.data;
    if (!c) return null;
    return mapChallenge(c);
  }

  static async getSavedChallenges(): Promise<Challenge[]> {
    const response = await apiClient.get('/api/v1/challenges/bookmarks/list');
    const list = response.data.data || [];
    return list.map(mapChallenge);
  }

  static async toggleBookmark(id: string): Promise<boolean> {
    const response = await apiClient.post(`/api/v1/challenges/${id}/bookmark`);
    return response.data.data?.bookmarked || false;
  }

  static async isBookmarked(id: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/api/v1/challenges/${id}/bookmark`);
      return response.data.data?.bookmarked || false;
    } catch {
      return false;
    }
  }

  static async addDiscussionComment(
    challengeId: string,
    content: string
  ): Promise<void> {
    await apiClient.post(`/api/v1/challenges/${challengeId}/comment`, { content });
  }
}

export default ChallengeService;
