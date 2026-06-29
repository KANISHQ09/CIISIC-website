import { ProposalRepository } from './proposal.repository';
import { IProposal } from '../../database/schemas/Proposal';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError';
import AuditLogModel from '../../database/schemas/AuditLog';
import ActivityLogModel from '../../database/schemas/ActivityLog';
import NotificationModel from '../../database/schemas/Notification';
import ChallengeModel from '../../database/schemas/Challenge';
import UserModel from '../../database/schemas/User';
import { EventBus } from '../../events/EventBus';

export class ProposalService {
  private readonly proposalRepository: ProposalRepository;

  constructor() {
    this.proposalRepository = new ProposalRepository();
  }

  public async createDraft(data: any, userId: string, userName: string): Promise<IProposal> {
    const challenge = await ChallengeModel.findById(data.challengeId);
    if (!challenge) {
      throw new NotFoundError('Challenge statement not found');
    }

    const solver = await UserModel.findById(userId);
    if (!solver) {
      throw new NotFoundError('Solver account not found');
    }

    const proposal = await this.proposalRepository.create({
      ...data,
      solverId: userId,
      companyId: challenge.companyId,
      status: 'DRAFT',
      proposalVersion: 1,
      decisionHistory: [],
      versionHistory: [],
    });

    await ActivityLogModel.create({
      userId,
      event: 'PROPOSAL_DRAFT_CREATED',
      metadata: { proposalId: proposal._id, challengeId: challenge._id },
    });

    return proposal;
  }

  public async getProposalById(id: string): Promise<IProposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }
    return proposal;
  }

  public async getProposals(filter: any = {}): Promise<IProposal[]> {
    const result = await this.proposalRepository.paginate(filter, { limit: 100 });
    return result.docs;
  }

  public async submitProposal(id: string, userId: string, userName: string): Promise<IProposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }

    if (proposal.status !== 'DRAFT' && proposal.status !== 'REVISION_REQUESTED') {
      throw new ValidationError('Only proposal drafts or revision requests can be submitted');
    }

    proposal.status = 'SUBMITTED';
    proposal.decisionHistory.push({
      status: 'SUBMITTED',
      actionBy: userId as any,
      comments: 'Proposal submitted by solver',
      timestamp: new Date(),
    });

    // Save previous snapshot version history
    proposal.versionHistory.push({
      version: proposal.proposalVersion,
      snapshot: JSON.stringify({ title: proposal.title, abstract: proposal.abstract }),
      modifiedBy: userId as any,
      timestamp: new Date(),
    });

    proposal.proposalVersion += 1;
    await proposal.save();

    // Trigger Notification for Institution SPOC to verify
    await NotificationModel.create({
      userId: proposal.solverId, // Also notify student
      type: 'SUCCESS',
      category: 'PROPOSAL',
      priority: 'MEDIUM',
      title: 'Proposal Submitted Successfully',
      content: `Your proposal "${proposal.title}" has been submitted and is awaiting institutional verification.`,
      deepLink: `/portal/student/proposals/${proposal._id}`,
    });

    // Activity Timeline Entry
    await ActivityLogModel.create({
      userId,
      event: 'PROPOSAL_SUBMITTED',
      metadata: { proposalId: proposal._id },
    });

    // Audit Log Entry
    await AuditLogModel.create({
      userId,
      userName,
      action: 'PROPOSAL_SUBMITTED',
      description: `Proposal "${proposal.title}" submitted by student solver`,
      ipAddress: '0.0.0.0',
      category: 'APPROVAL',
    });

    // Publish to Domain EventBus
    await EventBus.getInstance().publish('PROPOSAL_SUBMITTED', {
      proposalId: proposal._id,
      solverId: proposal.solverId,
    });

    return proposal;
  }

  public async verifyInstitution(
    id: string,
    isApproved: boolean,
    comments: string,
    userId: string,
    userName: string,
  ): Promise<IProposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }

    if (proposal.status !== 'SUBMITTED') {
      throw new ValidationError('Only submitted proposals can be verified by institutions');
    }

    const nextStatus = isApproved ? 'INSTITUTION_VERIFIED' : 'REJECTED';
    proposal.status = nextStatus;

    proposal.decisionHistory.push({
      status: nextStatus,
      actionBy: userId as any,
      comments,
      timestamp: new Date(),
    });

    await proposal.save();

    // Notify Student
    await NotificationModel.create({
      userId: proposal.solverId,
      type: isApproved ? 'SUCCESS' : 'ALERT',
      category: 'PROPOSAL',
      priority: 'HIGH',
      title: isApproved ? 'Proposal Institutionally Verified' : 'Proposal Rejected by Institution',
      content: isApproved
        ? `Your proposal "${proposal.title}" has been verified by LNCT and is awaiting reviewer allocation.`
        : `Your proposal "${proposal.title}" was rejected: ${comments}`,
      deepLink: `/portal/student/proposals/${proposal._id}`,
    });

    await ActivityLogModel.create({
      userId,
      event: isApproved ? 'PROPOSAL_INSTITUTION_VERIFIED' : 'PROPOSAL_INSTITUTION_REJECTED',
      metadata: { proposalId: proposal._id },
    });

    // Publish to Domain EventBus
    await EventBus.getInstance().publish('PROPOSAL_INSTITUTION_VERIFIED', {
      proposalId: proposal._id,
      solverId: proposal.solverId,
    });

    return proposal;
  }

  public async assignReviewer(
    id: string,
    reviewerId: string,
    userId: string,
    userName: string,
  ): Promise<IProposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }

    proposal.status = 'REVIEW_ASSIGNED';
    proposal.reviewerId = reviewerId as any;

    proposal.decisionHistory.push({
      status: 'REVIEW_ASSIGNED',
      actionBy: userId as any,
      comments: `Reviewer assigned by administrator`,
      timestamp: new Date(),
    });

    await proposal.save();

    // Notify Reviewer
    await NotificationModel.create({
      userId: reviewerId as any,
      type: 'INFO',
      category: 'REVIEW',
      priority: 'HIGH',
      title: 'New Evaluation Review Allocated',
      content: `You have been assigned to evaluate proposal: "${proposal.title}"`,
      deepLink: `/portal/reviewer/proposals/${proposal._id}`,
    });

    await ActivityLogModel.create({
      userId,
      event: 'PROPOSAL_REVIEWER_ASSIGNED',
      metadata: { proposalId: proposal._id, reviewerId },
    });

    return proposal;
  }

  public async companyDecision(
    id: string,
    decision: 'ACCEPTED' | 'REJECTED' | 'REVISION_REQUESTED',
    comments: string,
    userId: string,
    userName: string,
  ): Promise<IProposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) {
      throw new NotFoundError('Proposal not found');
    }

    proposal.status = decision;
    proposal.decisionHistory.push({
      status: decision,
      actionBy: userId as any,
      comments,
      timestamp: new Date(),
    });

    await proposal.save();

    // Notify Student
    await NotificationModel.create({
      userId: proposal.solverId,
      type: decision === 'ACCEPTED' ? 'SUCCESS' : 'ALERT',
      category: 'PROPOSAL',
      priority: 'HIGH',
      title: `Proposal ${decision}`,
      content: `Industry decision made on your proposal "${proposal.title}": ${decision}`,
      deepLink: `/portal/student/proposals/${proposal._id}`,
    });

    await ActivityLogModel.create({
      userId,
      event: `PROPOSAL_INDUSTRY_${decision}`,
      metadata: { proposalId: proposal._id },
    });

    return proposal;
  }
}
