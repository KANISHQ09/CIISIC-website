"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const User_1 = require("../../database/schemas/User");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.UserModel);
    }
    async findByEmail(email) {
        return this.findOne({ email });
    }
}
exports.UserRepository = UserRepository;
