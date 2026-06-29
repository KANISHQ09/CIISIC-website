import { ReviewRepository } from './review.repository';
import { IReview } from '../../database/schemas/Review';
import { NotFoundError } from '../../shared/errors/AppError';
import ProposalModel from '../../database/schemas/Proposal';
import ActivityLogModel from '../../database/schemas/ActivityLog';
import NotificationModel from '../../database/schemas/Notification';

export class ReviewService {
  private readonly reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  public async getReviewById(id: string): Promise<IReview> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError('Evaluation scorecard review not found');
    }
    return review;
  }

  public async submitEvaluation(data: any, userId: string, userName: string): Promise<IReview> {
    const proposal = await ProposalModel.findById(data.proposalId);
    if (!proposal) {
      throw new NotFoundError('Proposal statement not found');
    }

    // Weighted overall score logic
    const totalScore = Math.round(
      (data.innovationScore +
        data.technicalScore +
        data.feasibilityScore +
        data.scalabilityScore +
        data.documentationScore +
        data.businessImpactScore) /
        6,
    );

    const review = await this.reviewRepository.create({
      ...data,
      totalScore,
      evaluatedBy: userId,
    });

    // Update Proposal reviews overview summary scores block
    proposal.status = 'REVIEW_COMPLETED';
    proposal.reviewScores = {
      innovation: data.innovationScore,
      technical: data.technicalScore,
      feasibility: data.feasibilityScore,
      scalability: data.scalabilityScore,
      documentation: data.documentationScore,
      businessImpact: data.businessImpactScore,
      weightedScore: totalScore,
    };

    proposal.decisionHistory.push({
      status: 'REVIEW_COMPLETED',
      actionBy: userId as any,
      comments: `Evaluation scorecard completed: Overall score ${totalScore}/10`,
      timestamp: new Date(),
    });

    await proposal.save();

    // Trigger Notification for Student and Industry Spoc
    await NotificationModel.create({
      userId: proposal.solverId,
      type: 'SUCCESS',
      category: 'REVIEW',
      priority: 'MEDIUM',
      title: 'Proposal Review Completed',
      content: `Your proposal "${proposal.title}" evaluation scoring has been completed.`,
      deepLink: `/portal/student/proposals/${proposal._id}`,
    });

    await ActivityLogModel.create({
      userId,
      event: 'PROPOSAL_REVIEW_SUBMITTED',
      metadata: { proposalId: proposal._id, reviewId: review._id, totalScore },
    });

    // Publish to Domain EventBus
    const { EventBus } = await import('../../events/EventBus');
    await EventBus.getInstance().publish('PROPOSAL_REVIEW_SUBMITTED', {
      proposalId: proposal._id,
      solverId: proposal.solverId,
    });

    return review;
  }
}
