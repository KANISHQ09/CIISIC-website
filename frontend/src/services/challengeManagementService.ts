import { apiClient } from './api/client';
import { ChallengeManagement, ChallengeDraft } from '@/types/industryPortal';

function mapChallengeManagement(c: any): ChallengeManagement {
  return {
    id: c._id,
    title: c.title,
    category: c.category || 'General',
    companyName: c.companyId?.name || '',
    status: c.status || 'PUBLISHED',
    dateCreated: c.createdAt,
    submissionsCount: c.submissionsCount || 0,
    pendingCount: c.pendingCount || 0,
    difficulty: c.difficulty || 'MEDIUM'
  };
}

export class ChallengeManagementService {
  public static async getChallenges(): Promise<ChallengeManagement[]> {
    const response = await apiClient.get('/api/v1/challenges');
    const list = response.data.data || [];
    return list.map(mapChallengeManagement);
  }

  public static async getChallengeById(id: string): Promise<ChallengeManagement | undefined> {
    const response = await apiClient.get(`/api/v1/challenges/${id}`);
    const c = response.data.data;
    if (!c) return undefined;
    return mapChallengeManagement(c);
  }

  public static async createChallenge(draft: ChallengeDraft): Promise<ChallengeManagement> {
    const response = await apiClient.post('/api/v1/challenges', {
      title: draft.title,
      description: draft.problemStatement,
      problemStatement: draft.problemStatement,
      objectives: draft.objectives || draft.problemStatement,
      expectedDeliverables: draft.deliverables?.join('\n') || 'Deliverables list',
      technologies: draft.techStack || [],
      skillsRequired: draft.techStack || [],
      difficulty: draft.difficulty || 'MEDIUM',
      duration: '3 months',
      budget: 'N/A',
      submissionDeadline: draft.timeline?.submissionDeadline || new Date().toISOString(),
      visibility: 'PUBLIC',
      category: draft.category || 'General',
      industry: draft.category || 'Tech',
      status: draft.status || 'DRAFT'
    });
    return mapChallengeManagement(response.data.data);
  }

  public static async updateChallenge(id: string, updates: Partial<ChallengeManagement>): Promise<ChallengeManagement | null> {
    const response = await apiClient.patch(`/api/v1/challenges/${id}`, updates);
    const c = response.data.data;
    if (!c) return null;
    return mapChallengeManagement(c);
  }

  public static async duplicateChallenge(id: string): Promise<ChallengeManagement | null> {
    const item = await this.getChallengeById(id);
    if (!item) return null;

    const response = await apiClient.post('/api/v1/challenges', {
      title: `${item.title} (Copy)`,
      category: item.category,
      difficulty: item.difficulty,
      status: 'DRAFT',
      description: 'Copied challenge statement',
      problemStatement: 'Copied challenge statement',
      objectives: 'Copied challenge statement',
      expectedDeliverables: 'Copied deliverables',
      duration: '3 months',
      budget: 'N/A',
      submissionDeadline: new Date().toISOString()
    });
    return mapChallengeManagement(response.data.data);
  }

  public static async deleteChallenge(id: string): Promise<boolean> {
    await apiClient.delete(`/api/v1/challenges/${id}`);
    return true;
  }
}
export default ChallengeManagementService;
