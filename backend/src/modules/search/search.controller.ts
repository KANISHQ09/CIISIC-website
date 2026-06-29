import { Request, Response, NextFunction } from 'express';
import ChallengeModel from '../../database/schemas/Challenge';
import InstitutionModel from '../../database/schemas/Institution';
import CompanyModel from '../../database/schemas/Company';
import { sendResponse } from '../../shared/responses/response';

export class SearchController {
  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.query as string;
      const type = req.query.type as string; // 'challenges' | 'institutions' | 'companies' | 'all'

      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const regex = new RegExp(query, 'i');
      const results: any = {};

      if (!type || type === 'all' || type === 'challenges') {
        results.challenges = await ChallengeModel.find({
          isDeleted: { $ne: true },
          $or: [{ title: regex }, { description: regex }, { tags: { $in: [regex] } }],
        })
          .skip(skip)
          .limit(limit)
          .exec();
      }

      if (!type || type === 'all' || type === 'institutions') {
        results.institutions = await InstitutionModel.find({
          isDeleted: { $ne: true },
          $or: [{ name: regex }, { location: regex }, { code: regex }],
        })
          .skip(skip)
          .limit(limit)
          .exec();
      }

      if (!type || type === 'all' || type === 'companies') {
        results.companies = await CompanyModel.find({
          isDeleted: { $ne: true },
          $or: [{ name: regex }, { industry: regex }],
        })
          .skip(skip)
          .limit(limit)
          .exec();
      }

      sendResponse({
        res,
        message: 'Search query processed successfully',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };
}
