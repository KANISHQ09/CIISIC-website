"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Challenge_1 = require("../../database/schemas/Challenge");
class ChallengeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Challenge_1.ChallengeModel);
    }
}
exports.ChallengeRepository = ChallengeRepository;
