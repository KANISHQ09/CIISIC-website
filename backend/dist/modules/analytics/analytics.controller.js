"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const Challenge_1 = __importDefault(require("../../database/schemas/Challenge"));
const User_1 = __importDefault(require("../../database/schemas/User"));
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const Company_1 = __importDefault(require("../../database/schemas/Company"));
const response_1 = require("../../shared/responses/response");
class AnalyticsController {
    getDashboardStats = async (req, res, next) => {
        try {
            // Execute Mongo Aggregation Pipelines for Platform Totals
            const stats = await User_1.default.aggregate([
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
            const totalStudents = await User_1.default.countDocuments({
                role: 'STUDENT',
                isDeleted: { $ne: true },
            });
            const totalInstitutions = await Institution_1.default.countDocuments({ isDeleted: { $ne: true } });
            const totalCompanies = await Company_1.default.countDocuments({ isDeleted: { $ne: true } });
            const totalChallenges = await Challenge_1.default.countDocuments({ isDeleted: { $ne: true } });
            (0, response_1.sendResponse)({
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
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AnalyticsController = AnalyticsController;
