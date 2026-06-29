import { Request, Response, NextFunction } from 'express';
import { ProposalService } from './proposal.service';
import { sendResponse } from '../../shared/responses/response';
import { ValidationError, AuthenticationError } from '../../shared/errors/AppError';
import ActivityLogModel from '../../database/schemas/ActivityLog';
import ProposalModel from '../../database/schemas/Proposal';

export class ProposalController {
  private readonly proposalService: ProposalService;

  constructor() {
    this.proposalService = new ProposalService();
  }

  public getProposals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      // Enforce data isolation scope
      const filter: any = {};
      if (user.role === 'STUDENT') {
        filter.solverId = user.id;
      } else if (user.role === 'INDUSTRY_SPOC') {
        filter.companyId = user.id; // Or associated company
      } else if (user.role === 'REVIEWER') {
        filter.reviewerId = user.id;
      }

      const proposals = await this.proposalService.getProposals(filter);
      sendResponse({
        res,
        message: 'Proposals list retrieved successfully',
        data: proposals,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProposalById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const proposal = await this.proposalService.getProposalById(req.params.id);
      sendResponse({
        res,
        message: 'Proposal details retrieved successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public createDraft = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Student Solver';
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await this.proposalService.createDraft(req.body, userId, userName);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Proposal draft created successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public submitProposal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Student Solver';
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await this.proposalService.submitProposal(req.params.id, userId, userName);
      sendResponse({
        res,
        message: 'Proposal submitted successfully for institutional verification',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyInstitution = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { isApproved, comments } = req.body;
      if (isApproved === undefined) {
        throw new ValidationError('isApproved flag is required');
      }

      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Institution Admin';

      const proposal = await this.proposalService.verifyInstitution(
        req.params.id,
        isApproved,
        comments || '',
        userId,
        userName,
      );
      sendResponse({
        res,
        message: `Proposal marked as institutionally verified: ${isApproved}`,
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public assignReviewer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { reviewerId } = req.body;
      if (!reviewerId) {
        throw new ValidationError('reviewerId is required');
      }

      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Admin';

      const proposal = await this.proposalService.assignReviewer(
        req.params.id,
        reviewerId,
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Reviewer allocated to evaluate proposal successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public companyDecision = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { decision, comments } = req.body;
      if (!decision) {
        throw new ValidationError('decision is required');
      }

      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Company Admin';

      const proposal = await this.proposalService.companyDecision(
        req.params.id,
        decision,
        comments || '',
        userId,
        userName,
      );
      sendResponse({
        res,
        message: `Company decision updated to ${decision} successfully`,
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logs = await ActivityLogModel.find({ 'metadata.proposalId': req.params.proposalId })
        .sort({ createdAt: 1 })
        .exec();
      sendResponse({
        res,
        message: 'Proposal activity timeline log history retrieved',
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const filter: any = { isDeleted: { $ne: true } };
      if (user.role === 'STUDENT') {
        filter.solverId = user.id;
      } else if (user.role === 'INDUSTRY_SPOC') {
        filter.companyId = user.id;
      } else if (user.role === 'REVIEWER') {
        filter.reviewerId = user.id;
      }

      const total = await ProposalModel.countDocuments(filter).exec();
      const accepted = await ProposalModel.countDocuments({ ...filter, status: 'ACCEPTED' }).exec();
      const rejected = await ProposalModel.countDocuments({ ...filter, status: 'REJECTED' }).exec();
      const pending = await ProposalModel.countDocuments({ ...filter, status: 'SUBMITTED' }).exec();

      sendResponse({
        res,
        message: 'Proposal analytics aggregated successfully',
        data: {
          totalProposalsCount: total,
          acceptedProposalsCount: accepted,
          rejectedProposalsCount: rejected,
          pendingProposalsCount: pending,
          acceptanceRatePercentage: total > 0 ? Math.round((accepted / total) * 100) : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
