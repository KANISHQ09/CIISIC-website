"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_repository_1 = require("./message.repository");
const Conversation_1 = __importDefault(require("../../database/schemas/Conversation"));
const AppError_1 = require("../../shared/errors/AppError");
class MessageService {
    messageRepository;
    constructor() {
        this.messageRepository = new message_repository_1.MessageRepository();
    }
    async getOrCreateConversation(participants, type, referenceId) {
        let conv = await Conversation_1.default.findOne({
            participants: { $all: participants },
            type,
            referenceId,
        });
        if (!conv) {
            conv = await Conversation_1.default.create({
                participants,
                type,
                referenceId,
            });
        }
        return conv;
    }
    async getMessagesByConversation(conversationId) {
        const result = await this.messageRepository.paginate({ conversationId }, { limit: 100, sort: { createdAt: 1 } });
        return result.docs;
    }
    async sendMessage(conversationId, senderId, content) {
        const conv = await Conversation_1.default.findById(conversationId);
        if (!conv) {
            throw new AppError_1.NotFoundError('Conversation not found');
        }
        return this.messageRepository.create({
            conversationId,
            senderId,
            content,
        });
    }
}
exports.MessageService = MessageService;
