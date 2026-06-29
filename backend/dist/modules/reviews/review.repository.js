"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Review_1 = require("../../database/schemas/Review");
class ReviewRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Review_1.ReviewModel);
    }
    async findByProposal(proposalId) {
        return this.model.find({ proposalId, isDeleted: { $ne: true } }).exec();
    }
}
exports.ReviewRepository = ReviewRepository;
