import { Request, Response, NextFunction } from 'express';
import { ChallengeService } from './challenge.service';
import { sendResponse } from '../../shared/responses/response';
import { ValidationError } from '../../shared/errors/AppError';
import StudentProfileModel from '../../database/schemas/StudentProfile';

export class ChallengeController {
  private readonly challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

  public getChallenges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.challengeService.searchChallenges(req.query);
      sendResponse({
        res,
        message: 'Challenges search completed successfully',
        data: result.docs,
        meta: {
          totalDocs: result.totalDocs,
          limit: result.limit,
          page: result.page,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getChallengeById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const challenge = await this.challengeService.getChallengeById(req.params.id);
      sendResponse({
        res,
        message: 'Challenge detail retrieved successfully',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  };

  public createChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'System';
      const challenge = await this.challengeService.createChallenge(req.body, userId, userName);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Challenge statement draft created successfully',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'System';
      const challenge = await this.challengeService.updateChallenge(
        req.params.id,
        req.body,
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Challenge statement updated successfully',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  };

  public publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'System';
      const challenge = await this.challengeService.transitionStatus(
        req.params.id,
        'PUBLISHED',
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Challenge statement published successfully',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  };

  public archive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'System';
      const challenge = await this.challengeService.transitionStatus(
        req.params.id,
        'ARCHIVED',
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Challenge statement archived successfully',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  };

  public close = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'System';
      const challenge = await this.challengeService.transitionStatus(
        req.params.id,
        'CLOSED',
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Challenge statement closed successfully',
        data: challenge,
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
        throw new ValidationError('reviewerId is required in request payload');
      }

      const userId = (req as any).user?.id || 'system';
      const userName = (req as any).user?.name || 'System';
      const challenge = await this.challengeService.assignReviewer(
        req.params.id,
        reviewerId,
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Reviewer allocated to challenge successfully',
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  };

  public toggleBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const challengeId = req.params.id;

      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const profile = await StudentProfileModel.findOne({ userId });
      if (!profile) {
        throw new ValidationError('Student profile not found');
      }

      if (!profile.bookmarkedChallenges) {
        profile.bookmarkedChallenges = [];
      }

      const idIndex = profile.bookmarkedChallenges.indexOf(challengeId as any);
      let bookmarked = false;
      if (idIndex > -1) {
        profile.bookmarkedChallenges.splice(idIndex, 1);
      } else {
        profile.bookmarkedChallenges.push(challengeId as any);
        bookmarked = true;
      }

      await profile.save();

      sendResponse({
        res,
        message: bookmarked ? 'Challenge bookmarked' : 'Bookmark removed',
        data: { bookmarked },
      });
    } catch (error) {
      next(error);
    }
  };

  public getBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const profile = await StudentProfileModel.findOne({ userId })
        .populate('bookmarkedChallenges')
        .exec();

      sendResponse({
        res,
        message: 'Bookmarks fetched successfully',
        data: profile?.bookmarkedChallenges || [],
      });
    } catch (error) {
      next(error);
    }
  };
}
