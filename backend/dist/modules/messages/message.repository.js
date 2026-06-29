"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Message_1 = require("../../database/schemas/Message");
class MessageRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Message_1.MessageModel);
    }
}
exports.MessageRepository = MessageRepository;
