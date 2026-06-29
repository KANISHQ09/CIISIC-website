"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const Notification_1 = __importDefault(require("../../database/schemas/Notification"));
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
class NotificationController {
    getNotifications = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const list = await Notification_1.default.find({ userId, isDeleted: { $ne: true } })
                .sort({ createdAt: -1 })
                .exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Notifications list retrieved successfully',
                data: list,
            });
        }
        catch (error) {
            next(error);
        }
    };
    markAsRead = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const { id } = req.body;
            if (id) {
                await Notification_1.default.updateOne({ _id: id, userId }, { isRead: true }).exec();
            }
            else {
                await Notification_1.default.updateMany({ userId, isRead: false }, { isRead: true }).exec();
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Notifications marked as read',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.NotificationController = NotificationController;
