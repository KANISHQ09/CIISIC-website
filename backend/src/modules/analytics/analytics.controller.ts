import { Request, Response, NextFunction } from 'express';
import ChallengeModel from '../../database/schemas/Challenge';
import ProposalModel from '../../database/schemas/Proposal';
import UserModel from '../../database/schemas/User';
import InstitutionModel from '../../database/schemas/Institution';
import CompanyModel from '../../database/schemas/Company';
import { sendResponse } from '../../shared/responses/response';

export class AnalyticsController {
  public getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Execute Mongo Aggregation Pipelines for Platform Totals
      const stats = await UserModel.aggregate([
        {
          $facet: {
            userStats: [{ $group: { _id: '$role', count: { $sum: 1 } } }],
            challengeStats: [
              {
                $lookup: {
                  from: 'challenges',
                  pipeline: [
                    { $match: { isDeleted: { $ne: true } } },
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                  ],
                  as: 'challenges',
                },
              },
              { $limit: 1 },
            ],
            proposalStats: [
              {
                $lookup: {
                  from: 'proposals',
                  pipeline: [
                    { $match: { isDeleted: { $ne: true } } },
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                  ],
                  as: 'proposals',
                },
              },
              { $limit: 1 },
            ],
          },
        },
      ]);

      const totalStudents = await UserModel.countDocuments({
        role: 'STUDENT',
        isDeleted: { $ne: true },
      });
      const totalInstitutions = await InstitutionModel.countDocuments({ isDeleted: { $ne: true } });
      const totalCompanies = await CompanyModel.countDocuments({ isDeleted: { $ne: true } });
      const totalChallenges = await ChallengeModel.countDocuments({ isDeleted: { $ne: true } });

      sendResponse({
        res,
        message: 'Aggregated dashboard statistics retrieved successfully',
        data: {
          totals: {
            studentsCount: totalStudents,
            institutionsCount: totalInstitutions,
            companiesCount: totalCompanies,
            challengesCount: totalChallenges,
          },
          facets: stats[0],
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
