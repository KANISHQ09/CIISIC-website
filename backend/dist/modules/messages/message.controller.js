"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const message_service_1 = require("./message.service");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
class MessageController {
    messageService;
    constructor() {
        this.messageService = new message_service_1.MessageService();
    }
    getOrCreateConversation = async (req, res, next) => {
        try {
            const { participants, type, referenceId } = req.body;
            const conv = await this.messageService.getOrCreateConversation(participants, type, referenceId);
            (0, response_1.sendResponse)({
                res,
                message: 'Conversation established successfully',
                data: conv,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getMessages = async (req, res, next) => {
        try {
            const messages = await this.messageService.getMessagesByConversation(req.query.conversationId);
            (0, response_1.sendResponse)({
                res,
                message: 'Messages conversation thread retrieved',
                data: messages,
            });
        }
        catch (error) {
            next(error);
        }
    };
    sendMessage = async (req, res, next) => {
        try {
            const senderId = req.user?.id;
            if (!senderId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const { conversationId, content } = req.body;
            const message = await this.messageService.sendMessage(conversationId, senderId, content);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Message sent successfully',
                data: message,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.MessageController = MessageController;
