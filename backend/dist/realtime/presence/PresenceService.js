"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceService = void 0;
const logger_1 = require("../../config/logger");
class PresenceService {
    static instance;
    registry;
    constructor() {
        this.registry = new Map();
    }
    static getInstance() {
        if (!PresenceService.instance) {
            PresenceService.instance = new PresenceService();
        }
        return PresenceService.instance;
    }
    setUserOnline(userId, socketId) {
        this.registry.set(userId, {
            userId,
            socketId,
            online: true,
            lastActive: new Date(),
        });
        logger_1.logger.info(`Presence: User ${userId} marked as ONLINE (Socket: ${socketId})`);
    }
    setUserOffline(userId) {
        const presence = this.registry.get(userId);
        if (presence) {
            presence.online = false;
            presence.lastActive = new Date();
            logger_1.logger.info(`Presence: User ${userId} marked as OFFLINE`);
        }
    }
    setUserActiveRoom(userId, activeRoom) {
        const presence = this.registry.get(userId);
        if (presence) {
            presence.activeRoom = activeRoom;
            presence.lastActive = new Date();
        }
    }
    getPresence(userId) {
        return this.registry.get(userId);
    }
    getAllPresence() {
        return Array.from(this.registry.values());
    }
}
exports.PresenceService = PresenceService;
exports.default = PresenceService;
