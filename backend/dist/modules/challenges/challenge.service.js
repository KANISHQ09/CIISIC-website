"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeService = void 0;
const challenge_repository_1 = require("./challenge.repository");
const AppError_1 = require("../../shared/errors/AppError");
const AuditLog_1 = __importDefault(require("../../database/schemas/AuditLog"));
class ChallengeService {
    challengeRepository;
    constructor() {
        this.challengeRepository = new challenge_repository_1.ChallengeRepository();
    }
    generateSlug(title) {
        return (title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') +
            '-' +
            Date.now().toString().slice(-4));
    }
    async createChallenge(data, userId, userName) {
        const slug = this.generateSlug(data.title);
        const challenge = await this.challengeRepository.create({
            ...data,
            slug,
            status: 'DRAFT',
        });
        await AuditLog_1.default.create({
            userId,
            userName,
            action: 'CHALLENGE_CREATED',
            description: `Challenge draft created: "${challenge.title}"`,
            ipAddress: '0.0.0.0',
            category: 'APPROVAL',
        });
        return challenge;
    }
    async getChallengeById(id) {
        const challenge = await this.challengeRepository.findById(id);
        if (!challenge) {
            throw new AppError_1.NotFoundError('Challenge statement not found');
        }
        return challenge;
    }
    async updateChallenge(id, data, userId, userName) {
        const challenge = await this.challengeRepository.update(id, data);
        if (!challenge) {
            throw new AppError_1.NotFoundError('Challenge statement not found');
        }
        await AuditLog_1.default.create({
            userId,
            userName,
            action: 'CHALLENGE_UPDATED',
            description: `Challenge updated: "${challenge.title}"`,
            ipAddress: '0.0.0.0',
            category: 'APPROVAL',
        });
        return challenge;
    }
    async transitionStatus(id, status, userId, userName) {
        const challenge = await this.challengeRepository.update(id, { status });
        if (!challenge) {
            throw new AppError_1.NotFoundError('Challenge statement not found');
        }
        await AuditLog_1.default.create({
            userId,
            userName,
            action: 'CHALLENGE_STATUS_TRANSITION',
            description: `Challenge status transitioned to ${status} for "${challenge.title}"`,
            ipAddress: '0.0.0.0',
            category: 'APPROVAL',
        });
        return challenge;
    }
    async assignReviewer(id, reviewerId, userId, userName) {
        const challenge = await this.challengeRepository.update(id, { reviewerId });
        if (!challenge) {
            throw new AppError_1.NotFoundError('Challenge statement not found');
        }
        await AuditLog_1.default.create({
            userId,
            userName,
            action: 'CHALLENGE_REVIEWER_ASSIGNED',
            description: `Reviewer allocated to challenge: "${challenge.title}"`,
            ipAddress: '0.0.0.0',
            category: 'APPROVAL',
        });
        return challenge;
    }
    async searchChallenges(queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const search = queryParams.search || '';
        const category = queryParams.category || '';
        const difficulty = queryParams.difficulty || '';
        const status = queryParams.status || 'PUBLISHED';
        const isFeatured = queryParams.isFeatured === 'true';
        const filter = { isDeleted: { $ne: true } };
        if (status) {
            filter.status = status;
        }
        if (isFeatured) {
            filter.isFeatured = true;
        }
        if (category) {
            filter.category = category;
        }
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }
        return this.challengeRepository.paginate(filter, {
            page,
            limit,
            sort: { createdAt: -1 },
        });
    }
}
exports.ChallengeService = ChallengeService;
