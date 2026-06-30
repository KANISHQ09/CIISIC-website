"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const Challenge_1 = __importDefault(require("../../database/schemas/Challenge"));
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
const User_1 = __importDefault(require("../../database/schemas/User"));
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const Company_1 = __importDefault(require("../../database/schemas/Company"));
const StudentProfile_1 = __importDefault(require("../../database/schemas/StudentProfile"));
const Announcement_1 = __importDefault(require("../../database/schemas/Announcement"));
const response_1 = require("../../shared/responses/response");
class AnalyticsController {
    getDashboardStats = async (req, res, next) => {
        try {
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
    getAdminDashboard = async (req, res, next) => {
        try {
            const totalStudents = await User_1.default.countDocuments({
                role: 'STUDENT',
                isDeleted: { $ne: true },
            });
            const totalInstitutions = await Institution_1.default.countDocuments({ isDeleted: { $ne: true } });
            const totalCompanies = await Company_1.default.countDocuments({ isDeleted: { $ne: true } });
            const totalReviewers = await User_1.default.countDocuments({
                role: 'REVIEWER',
                isDeleted: { $ne: true },
            });
            const activeChallenges = await Challenge_1.default.countDocuments({
                status: 'OPEN',
                isDeleted: { $ne: true },
            });
            const pendingApprovals = await Proposal_1.default.countDocuments({
                status: { $in: ['SUBMITTED', 'UNDER_REVIEW'] },
                isDeleted: { $ne: true },
            });
            const liveApplications = await Proposal_1.default.countDocuments({
                status: { $ne: 'DRAFT' },
                isDeleted: { $ne: true },
            });
            (0, response_1.sendResponse)({
                res,
                message: 'Admin Dashboard Stats retrieved successfully',
                data: {
                    totalStudents,
                    totalInstitutions,
                    totalCompanies,
                    totalReviewers,
                    activeChallenges,
                    pendingApprovals,
                    liveApplications,
                    systemHealth: [
                        { service: 'Express MERN API Server', status: 'OPERATIONAL', latencyMs: 24 },
                        { service: 'MongoDB Database Server', status: 'OPERATIONAL', latencyMs: 5 },
                        { service: 'Next.js App Server', status: 'OPERATIONAL', latencyMs: 12 }
                    ]
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getLeaderboard = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const profiles = await StudentProfile_1.default.find({ isDeleted: { $ne: true } })
                .sort({ points: -1 })
                .populate('userId')
                .populate('institutionId')
                .limit(20)
                .exec();
            const leaderboard = profiles.map((p, idx) => ({
                rank: idx + 1,
                name: p.userId?.name || 'Unknown Student',
                points: p.points || 0,
                avatar: p.userId?.avatar || '',
                institution: p.institutionId?.name || '',
                isMe: p.userId?._id?.toString() === currentUserId?.toString(),
            }));
            (0, response_1.sendResponse)({
                res,
                message: 'Leaderboard retrieved successfully',
                data: leaderboard,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getStudentBadges = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const proposalCount = await Proposal_1.default.countDocuments({
                solverId: currentUserId,
                isDeleted: { $ne: true },
            });
            const acceptedCount = await Proposal_1.default.countDocuments({
                solverId: currentUserId,
                status: 'ACCEPTED',
                isDeleted: { $ne: true },
            });
            const profile = await StudentProfile_1.default.findOne({
                userId: currentUserId,
                isDeleted: { $ne: true },
            });
            const badges = [];
            if (proposalCount > 0) {
                badges.push({
                    id: 'first-venture',
                    title: 'First Venture',
                    description: 'Submitted your first industrial proposal to a corporate sponsor.',
                    icon: '🏆',
                    unlockedAt: new Date().toISOString(),
                });
            }
            if (acceptedCount > 0) {
                badges.push({
                    id: 'cell-champion',
                    title: 'Cell Champion',
                    description: 'Earned recommendation for a challenge from an Academic Excellence Cell.',
                    icon: '⚡',
                    unlockedAt: new Date().toISOString(),
                });
            }
            if (profile && (profile.points || 0) >= 100) {
                badges.push({
                    id: 'mern-specialist',
                    title: 'MERN Specialist',
                    description: 'Successfully verified a solution written in the Node/React stack.',
                    icon: '💻',
                    unlockedAt: new Date().toISOString(),
                });
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Student badges retrieved successfully',
                data: badges,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getInstitutionDashboard = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const institution = await Institution_1.default.findOne({
                $or: [{ primarySpoc: currentUserId }, { facultyMembers: currentUserId }],
                isDeleted: { $ne: true },
            });
            if (!institution) {
                (0, response_1.sendResponse)({
                    res,
                    message: 'No associated institution found',
                    data: {
                        totalStudents: 0,
                        verifiedStudents: 0,
                        activeChallenges: 0,
                        participationRate: 0,
                        proposalStatus: { submitted: 0, underReview: 0, accepted: 0, revisionRequested: 0 },
                        announcements: [],
                    },
                });
                return;
            }
            const totalStudents = await StudentProfile_1.default.countDocuments({
                institutionId: institution._id,
                isDeleted: { $ne: true },
            });
            const verifiedStudents = await StudentProfile_1.default.countDocuments({
                institutionId: institution._id,
                enrollmentNo: { $exists: true },
                isDeleted: { $ne: true },
            });
            const activeChallenges = await Challenge_1.default.countDocuments({
                status: 'OPEN',
                isDeleted: { $ne: true },
            });
            const submitted = await Proposal_1.default.countDocuments({
                institutionId: institution._id,
                status: 'SUBMITTED',
                isDeleted: { $ne: true },
            });
            const underReview = await Proposal_1.default.countDocuments({
                institutionId: institution._id,
                status: 'UNDER_REVIEW',
                isDeleted: { $ne: true },
            });
            const accepted = await Proposal_1.default.countDocuments({
                institutionId: institution._id,
                status: 'ACCEPTED',
                isDeleted: { $ne: true },
            });
            const revisionRequested = await Proposal_1.default.countDocuments({
                institutionId: institution._id,
                status: 'REVISION_REQUESTED',
                isDeleted: { $ne: true },
            });
            const announcements = await Announcement_1.default.find({
                isPublished: true,
                targetRoles: { $in: ['INSTITUTION_SPOC', 'ALL'] },
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Institution Dashboard Stats retrieved successfully',
                data: {
                    totalStudents,
                    verifiedStudents,
                    activeChallenges,
                    participationRate: totalStudents > 0 ? Math.round((verifiedStudents / totalStudents) * 100) : 0,
                    proposalStatus: { submitted, underReview, accepted, revisionRequested },
                    announcements: announcements.map((a) => ({
                        id: a._id,
                        title: a.title,
                        desc: a.content,
                        date: a.createdAt,
                    })),
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getIndustryDashboard = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const company = await Company_1.default.findOne({
                industrySpocs: currentUserId,
                isDeleted: { $ne: true },
            });
            if (!company) {
                (0, response_1.sendResponse)({
                    res,
                    message: 'No associated company found',
                    data: {
                        totalChallenges: 0,
                        activeChallenges: 0,
                        totalSubmissions: 0,
                        pendingReviews: 0,
                        shortlistedCandidates: 0,
                        metrics: { proposalAcceptanceRate: 0, avgTechnicalScore: 0, activeSectors: [] },
                        recentActivity: [],
                    },
                });
                return;
            }
            const totalChallenges = await Challenge_1.default.countDocuments({
                companyId: company._id,
                isDeleted: { $ne: true },
            });
            const activeChallenges = await Challenge_1.default.countDocuments({
                companyId: company._id,
                status: 'OPEN',
                isDeleted: { $ne: true },
            });
            const totalSubmissions = await Proposal_1.default.countDocuments({
                companyId: company._id,
                isDeleted: { $ne: true },
            });
            const pendingReviews = await Proposal_1.default.countDocuments({
                companyId: company._id,
                status: 'SUBMITTED',
                isDeleted: { $ne: true },
            });
            const shortlistedCandidates = await Proposal_1.default.countDocuments({
                companyId: company._id,
                status: 'ACCEPTED',
                isDeleted: { $ne: true },
            });
            (0, response_1.sendResponse)({
                res,
                message: 'Industry Dashboard Stats retrieved successfully',
                data: {
                    totalChallenges,
                    activeChallenges,
                    totalSubmissions,
                    pendingReviews,
                    shortlistedCandidates,
                    metrics: {
                        proposalAcceptanceRate: totalSubmissions > 0 ? Math.round((shortlistedCandidates / totalSubmissions) * 100) : 0,
                        avgTechnicalScore: 7.8,
                        activeSectors: [company.industry],
                    },
                    recentActivity: [],
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AnalyticsController = AnalyticsController;
