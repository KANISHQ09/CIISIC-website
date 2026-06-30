"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeController = void 0;
const challenge_service_1 = require("./challenge.service");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
const StudentProfile_1 = __importDefault(require("../../database/schemas/StudentProfile"));
class ChallengeController {
    challengeService;
    constructor() {
        this.challengeService = new challenge_service_1.ChallengeService();
    }
    getChallenges = async (req, res, next) => {
        try {
            const result = await this.challengeService.searchChallenges(req.query);
            (0, response_1.sendResponse)({
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
        }
        catch (error) {
            next(error);
        }
    };
    getChallengeById = async (req, res, next) => {
        try {
            const challenge = await this.challengeService.getChallengeById(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Challenge detail retrieved successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    createChallenge = async (req, res, next) => {
        try {
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'System';
            const challenge = await this.challengeService.createChallenge(req.body, userId, userName);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Challenge statement draft created successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateChallenge = async (req, res, next) => {
        try {
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'System';
            const challenge = await this.challengeService.updateChallenge(req.params.id, req.body, userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Challenge statement updated successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    publish = async (req, res, next) => {
        try {
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'System';
            const challenge = await this.challengeService.transitionStatus(req.params.id, 'PUBLISHED', userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Challenge statement published successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    archive = async (req, res, next) => {
        try {
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'System';
            const challenge = await this.challengeService.transitionStatus(req.params.id, 'ARCHIVED', userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Challenge statement archived successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    close = async (req, res, next) => {
        try {
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'System';
            const challenge = await this.challengeService.transitionStatus(req.params.id, 'CLOSED', userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Challenge statement closed successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    assignReviewer = async (req, res, next) => {
        try {
            const { reviewerId } = req.body;
            if (!reviewerId) {
                throw new AppError_1.ValidationError('reviewerId is required in request payload');
            }
            const userId = req.user?.id || 'system';
            const userName = req.user?.name || 'System';
            const challenge = await this.challengeService.assignReviewer(req.params.id, reviewerId, userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer allocated to challenge successfully',
                data: challenge,
            });
        }
        catch (error) {
            next(error);
        }
    };
    toggleBookmark = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const challengeId = req.params.id;
            if (!userId) {
                throw new AppError_1.ValidationError('Authentication required');
            }
            const profile = await StudentProfile_1.default.findOne({ userId });
            if (!profile) {
                throw new AppError_1.ValidationError('Student profile not found');
            }
            if (!profile.bookmarkedChallenges) {
                profile.bookmarkedChallenges = [];
            }
            const idIndex = profile.bookmarkedChallenges.indexOf(challengeId);
            let bookmarked = false;
            if (idIndex > -1) {
                profile.bookmarkedChallenges.splice(idIndex, 1);
            }
            else {
                profile.bookmarkedChallenges.push(challengeId);
                bookmarked = true;
            }
            await profile.save();
            (0, response_1.sendResponse)({
                res,
                message: bookmarked ? 'Challenge bookmarked' : 'Bookmark removed',
                data: { bookmarked },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getBookmarks = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.ValidationError('Authentication required');
            }
            const profile = await StudentProfile_1.default.findOne({ userId })
                .populate('bookmarkedChallenges')
                .exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Bookmarks fetched successfully',
                data: profile?.bookmarkedChallenges || [],
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ChallengeController = ChallengeController;
