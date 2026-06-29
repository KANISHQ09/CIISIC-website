"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = exports.SessionRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Session_1 = require("../../database/schemas/Session");
const RefreshToken_1 = require("../../database/schemas/RefreshToken");
class SessionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Session_1.SessionModel);
    }
    async findActiveByUser(userId) {
        return this.model.find({ userId, isDeleted: { $ne: true } }).exec();
    }
    async findByToken(token) {
        return this.findOne({ token });
    }
}
exports.SessionRepository = SessionRepository;
class RefreshTokenRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(RefreshToken_1.RefreshTokenModel);
    }
    async findActiveToken(token) {
        return this.findOne({ token, isRevoked: false });
    }
    async revokeAllUserTokens(userId) {
        await this.model
            .updateMany({ userId, isRevoked: false }, { isRevoked: true, updatedAt: new Date() })
            .exec();
    }
}
exports.RefreshTokenRepository = RefreshTokenRepository;
