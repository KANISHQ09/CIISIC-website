import { ProposalEvaluation, ShortlistCandidate } from '@/types/industryPortal';
import { Proposal } from '@/types/studentPortal';
import { ProposalService } from './proposalService';
import { apiClient } from './api/client';

export class ProposalReviewService {
  public static async getProposalsToReview(): Promise<Proposal[]> {
    return ProposalService.getProposals();
  }

  public static async getProposalById(id: string): Promise<Proposal | undefined> {
    const p = await ProposalService.getProposalById(id);
    return p || undefined;
  }

  public static async submitEvaluation(evalData: ProposalEvaluation): Promise<ProposalEvaluation> {
    // Send to backend reviews endpoint
    await apiClient.post('/api/v1/reviews', {
      proposalId: evalData.proposalId,
      technicalScore: evalData.technicalScore,
      innovationScore: evalData.innovationScore,
      feasibilityScore: evalData.technicalScore,
      scalabilityScore: evalData.technicalScore,
      documentationScore: evalData.technicalScore,
      businessImpactScore: evalData.technicalScore,
      comments: evalData.comments,
      recommendation: evalData.recommendation === 'APPROVE' ? 'APPROVED' : evalData.recommendation === 'REQUEST_REVISION' ? 'REVISING' : 'REJECTED'
    });

    return evalData;
  }

  public static async getShortlist(): Promise<ShortlistCandidate[]> {
    const list = await ProposalService.getProposals();
    const shortlisted = list.filter((p) => p.status === 'ACCEPTED' || p.status === 'COMPLETED');
    return shortlisted.map((p) => ({
      studentId: p.studentId || 'student-id',
      studentName: p.studentName,
      major: 'Innovation & Tech',
      college: 'LNCT Bhopal',
      cgpa: 9.0,
      skills: [],
      achievementsCount: 0,
      proposalScore: 8.5,
      proposalId: p.id,
      proposalTitle: p.title,
      resumeUrl: p.fileUrl,
      githubUrl: '',
      portfolioUrl: ''
    }));
  }

  public static async addToShortlist(proposalId: string, score: number): Promise<void> {
    // Shortlisting is managed by setting the status to ACCEPTED on the backend
    await apiClient.post(`/api/v1/reviews`, {
      proposalId,
      technicalScore: score,
      innovationScore: score,
      feasibilityScore: score,
      scalabilityScore: score,
      documentationScore: score,
      businessImpactScore: score,
      comments: 'Automatically shortlisted based on score.',
      recommendation: 'APPROVED'
    });
  }

  public static async removeFromShortlist(proposalId: string): Promise<boolean> {
    // Rejecting / requesting revision moves it out of shortlist
    await apiClient.post(`/api/v1/reviews`, {
      proposalId,
      technicalScore: 5,
      innovationScore: 5,
      feasibilityScore: 5,
      scalabilityScore: 5,
      documentationScore: 5,
      businessImpactScore: 5,
      comments: 'Removed from shortlist.',
      recommendation: 'REJECTED'
    });
    return true;
  }
}
export default ProposalReviewService;
