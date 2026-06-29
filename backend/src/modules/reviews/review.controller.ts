import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service';
import { sendResponse } from '../../shared/responses/response';
import { AuthenticationError, ValidationError } from '../../shared/errors/AppError';
import {
  ReviewerService,
  ReviewAnalyticsService,
  DiscussionService,
  EvaluationService,
} from './reviewer.services';
import ProposalModel from '../../database/schemas/Proposal';

export class ReviewController {
  private readonly reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      sendResponse({
        res,
        message: 'Review details retrieved successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  public submitEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const review = await EvaluationService.submitEvaluation(req.body, userId);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Evaluation scorecard submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  public getReviewerDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const stats = await ReviewAnalyticsService.getReviewerStats(userId);
      const assignedProposals = await ProposalModel.find({ reviewerId: userId }).limit(10).exec();

      sendResponse({
        res,
        message: 'Reviewer dashboard metrics aggregated successfully',
        data: {
          stats,
          assignedProposals,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getReviewerReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposals = await ProposalModel.find({ reviewerId: userId }).exec();
      sendResponse({
        res,
        message: 'Reviewer assigned proposal reviews queue list retrieved',
        data: proposals,
      });
    } catch (error) {
      next(error);
    }
  };

  public getReviewerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const user = await ReviewerService.getReviewerProfile(userId);
      sendResponse({
        res,
        message: 'Reviewer profile data retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public getReviewerStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const stats = await ReviewAnalyticsService.getReviewerStats(userId);
      sendResponse({
        res,
        message: 'Reviewer statistics aggregated successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const { commentText } = req.body;
      if (!commentText) {
        throw new ValidationError('commentText is required');
      }

      const proposal = await DiscussionService.addReviewerComment(
        req.params.id,
        commentText,
        userId,
      );
      sendResponse({
        res,
        message: 'Reviewer evaluation notes comment added successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };
}
