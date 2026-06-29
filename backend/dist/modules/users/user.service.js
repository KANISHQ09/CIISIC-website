"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const AppError_1 = require("../../shared/errors/AppError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(dto) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) {
            throw new AppError_1.ConflictError('Email is already registered under another account');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(dto.password, salt);
        return this.userRepository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: dto.role,
        });
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.NotFoundError('User record not found');
        }
        return user;
    }
}
exports.UserService = UserService;
