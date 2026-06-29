import { apiClient } from './api/client';
import { Proposal } from '@/types/studentPortal';

export class ProposalService {
  static async getProposals(): Promise<Proposal[]> {
    const response = await apiClient.get('/api/v1/proposals');
    const list = response.data.data || [];
    return list.map((p: any) => ({
      id: p._id,
      challengeId: p.challengeId,
      challengeTitle: 'Agro-Crop Scheduling Challenge Statement',
      companyName: 'TATA AgriTech Solutions',
      studentId: p.solverId,
      studentName: 'Student Innovator',
      title: p.title,
      description: p.abstract || '',
      technicalApproach: p.technicalApproach || '',
      fileUrl: p.approachDocument || '#',
      fileName: p.approachDocument ? 'Proposal_Approach_Details.pdf' : 'No_Document.pdf',
      status: p.status,
      submissionDate: p.createdAt,
      feedback: p.decisionHistory?.[p.decisionHistory.length - 1]?.comments || '',
      verificationStatus: p.status === 'DRAFT' ? 'PENDING' : 'APPROVED',
      versionHistory: p.versionHistory || [],
      comments: p.comments || []
    }));
  }

  static async getProposalById(id: string): Promise<Proposal | null> {
    const response = await apiClient.get(`/api/v1/proposals/${id}`);
    const p = response.data.data;
    if (!p) return null;
    return {
      id: p._id,
      challengeId: p.challengeId,
      challengeTitle: 'Agro-Crop Scheduling Challenge Statement',
      companyName: 'TATA AgriTech Solutions',
      studentId: p.solverId,
      studentName: 'Student Innovator',
      title: p.title,
      description: p.abstract || '',
      technicalApproach: p.technicalApproach || '',
      fileUrl: p.approachDocument || '#',
      fileName: p.approachDocument ? 'Proposal_Approach_Details.pdf' : 'No_Document.pdf',
      status: p.status,
      submissionDate: p.createdAt,
      feedback: p.decisionHistory?.[p.decisionHistory.length - 1]?.comments || '',
      verificationStatus: p.status === 'DRAFT' ? 'PENDING' : 'APPROVED',
      versionHistory: p.versionHistory || [],
      comments: p.comments || []
    };
  }

  static async submitProposal(
    proposal: Omit<Proposal, 'id' | 'submissionDate' | 'versionHistory' | 'comments' | 'verificationStatus'>
  ): Promise<Proposal> {
    const response = await apiClient.post('/api/v1/proposals', {
      challengeId: proposal.challengeId,
      title: proposal.title,
      abstract: proposal.description,
      technicalApproach: proposal.technicalApproach,
      approachDocument: proposal.fileUrl
    });

    const p = response.data.data;
    // Auto trigger submission verification
    await apiClient.post(`/api/v1/proposals/${p._id}/submit`);

    return p;
  }

  static async submitRevision(proposalId: string, fileUrl: string, fileName: string, description: string): Promise<Proposal | null> {
    const response = await apiClient.post(`/api/v1/proposals/${proposalId}/submit`);
    return response.data.data;
  }

  static async addProposalComment(proposalId: string, authorName: string, authorRole: string, content: string): Promise<Proposal | null> {
    const response = await apiClient.post(`/api/v1/reviews/reviewer/reviews/${proposalId}/comment`, { commentText: content });
    return response.data.data;
  }
}
export default ProposalService;
