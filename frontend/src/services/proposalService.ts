import { apiClient } from './api/client';
import { Proposal } from '@/types/studentPortal';

function mapProposal(p: any): Proposal {
  return {
    id: p._id,
    challengeId: p.challengeId?._id || p.challengeId,
    challengeTitle: p.challengeId?.title || '',
    companyName: p.challengeId?.companyId?.name || '',
    studentId: p.solverId?._id || p.solverId,
    studentName: p.solverId?.name || '',
    title: p.title,
    description: p.abstract || '',
    technicalApproach: p.technicalApproach || '',
    fileUrl: p.approachDocument || p.attachments?.[0]?.fileUrl || '',
    fileName: p.attachments?.[0]?.fileName || (p.approachDocument ? 'Proposal_Document.pdf' : ''),
    status: p.status,
    submissionDate: p.createdAt,
    feedback: p.decisionHistory?.[p.decisionHistory.length - 1]?.comments || '',
    verificationStatus:
      p.institutionVerification?.status === 'APPROVED'
        ? 'APPROVED'
        : p.institutionVerification?.status === 'REJECTED'
          ? 'REJECTED'
          : 'PENDING',
    versionHistory: p.versionHistory || [],
    comments: (p.comments || []).map((c: any) => ({
      id: c._id,
      authorName: c.authorId?.name || c.authorName || '',
      authorRole: c.authorId?.role || c.authorRole || '',
      content: c.content,
      createdAt: c.createdAt
    }))
  };
}

export class ProposalService {
  static async getProposals(): Promise<Proposal[]> {
    const response = await apiClient.get('/api/v1/proposals');
    const list = response.data.data || [];
    return list.map(mapProposal);
  }

  static async getProposalById(id: string): Promise<Proposal | null> {
    const response = await apiClient.get(`/api/v1/proposals/${id}`);
    const p = response.data.data;
    if (!p) return null;
    return mapProposal(p);
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
    // Submit the draft immediately
    await apiClient.post(`/api/v1/proposals/${p._id}/submit`);
    return mapProposal(p);
  }

  static async submitRevision(proposalId: string, fileUrl: string, fileName: string, description: string): Promise<Proposal | null> {
    const response = await apiClient.post(`/api/v1/proposals/${proposalId}/submit`);
    return mapProposal(response.data.data);
  }

  static async addProposalComment(proposalId: string, content: string): Promise<Proposal | null> {
    const response = await apiClient.post(`/api/v1/proposals/${proposalId}/comment`, { content });
    const p = response.data.data;
    if (!p) return null;
    return mapProposal(p);
  }

  static async assignReviewer(proposalId: string, reviewerId: string): Promise<Proposal> {
    const response = await apiClient.post(`/api/v1/proposals/${proposalId}/reviewers`, { reviewerId });
    return mapProposal(response.data.data);
  }
}

export default ProposalService;
