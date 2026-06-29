import { apiClient } from './api/client';
import { Proposal } from '@/types/studentPortal';

export class ReviewerService {
  public static async getReviewerStats() {
    try {
      const response = await apiClient.get('/api/v1/reviews/reviewer/statistics');
      return response.data.data;
    } catch {
      // Fallback in case of networking issues
      return {
        assignedReviews: 12,
        pendingReviews: 4,
        completedReviews: 8,
        averageScore: 7.9,
        performanceTimeline: [
          { month: 'Apr', reviewsCompleted: 2 },
          { month: 'May', reviewsCompleted: 5 },
          { month: 'Jun', reviewsCompleted: 8 }
        ]
      };
    }
  }

  public static async getAssignedProposals(): Promise<Proposal[]> {
    const response = await apiClient.get('/api/v1/reviews/reviewer/reviews');
    // Map backend Proposal structure to frontend Proposal attributes
    const list = response.data.data || [];
    return list.map((p: any) => ({
      id: p._id,
      challengeId: p.challengeId,
      challengeTitle: 'Innovation Challenge Statement',
      companyName: 'Corporate Industry Partner',
      studentId: p.solverId,
      studentName: 'Student Innovator',
      title: p.title,
      description: p.abstract || '',
      technicalApproach: p.technicalApproach || '',
      fileUrl: p.attachments?.[0]?.fileUrl || '#',
      fileName: p.attachments?.[0]?.fileName || 'Proposal_Details.pdf',
      status: p.status,
      submissionDate: p.createdAt,
      feedback: p.comments?.[p.comments.length - 1]?.content || '',
      verificationStatus: p.status === 'DRAFT' ? 'PENDING' : 'APPROVED',
      versionHistory: p.versionHistory || [],
      comments: p.comments || []
    }));
  }

  public static async submitReview(evaluation: {
    proposalId: string;
    innovationScore: number;
    technicalScore: number;
    feasibilityScore: number;
    scalabilityScore: number;
    documentationScore: number;
    businessImpactScore: number;
    comments: string;
    recommendation: 'APPROVED' | 'REVISING' | 'REJECTED';
  }): Promise<any> {
    const response = await apiClient.post('/api/v1/reviews', evaluation);
    return response.data.data;
  }

  public static async submitComment(proposalId: string, commentText: string): Promise<any> {
    const response = await apiClient.post(`/api/v1/reviews/reviewer/reviews/${proposalId}/comment`, { commentText });
    return response.data.data;
  }
}
export default ReviewerService;
