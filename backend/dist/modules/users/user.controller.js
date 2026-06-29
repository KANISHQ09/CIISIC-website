"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../shared/responses/response");
const user_dto_1 = require("./user.dto");
const AppError_1 = require("../../shared/errors/AppError");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    register = async (req, res, next) => {
        try {
            const parsed = user_dto_1.RegisterUserSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Validation failed', parsed.error.format());
            }
            const user = await this.userService.register(parsed.data);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'User account registered successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const user = await this.userService.getUserById(userId);
            (0, response_1.sendResponse)({
                res,
                message: 'Profile details fetched successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
