"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const EventBus_1 = require("./EventBus");
const socket_server_1 = require("../realtime/socket.server");
const logger_1 = require("../config/logger");
class EventDispatcher {
    static initialize() {
        const bus = EventBus_1.EventBus.getInstance();
        const socketServer = socket_server_1.SocketServer.getInstance();
        logger_1.logger.info('Registering system domain event subscribers...');
        // Subscribe to Proposal Submitted
        bus.subscribe('PROPOSAL_SUBMITTED', (payload) => {
            logger_1.logger.info(`Reacting to PROPOSAL_SUBMITTED event: proposalId = ${payload.proposalId}`);
            if (payload.solverId) {
                socketServer.broadcastToUser(payload.solverId, 'PROPOSAL_STATUS_UPDATE', {
                    proposalId: payload.proposalId,
                    status: 'SUBMITTED',
                    message: 'Proposal successfully submitted',
                });
            }
        });
        // Subscribe to Proposal Verified
        bus.subscribe('PROPOSAL_INSTITUTION_VERIFIED', (payload) => {
            logger_1.logger.info(`Reacting to PROPOSAL_INSTITUTION_VERIFIED event: proposalId = ${payload.proposalId}`);
            if (payload.solverId) {
                socketServer.broadcastToUser(payload.solverId, 'PROPOSAL_STATUS_UPDATE', {
                    proposalId: payload.proposalId,
                    status: 'INSTITUTION_VERIFIED',
                    message: 'Proposal verified by institution',
                });
            }
        });
        // Subscribe to Reviews
        bus.subscribe('PROPOSAL_REVIEW_SUBMITTED', (payload) => {
            logger_1.logger.info(`Reacting to PROPOSAL_REVIEW_SUBMITTED event: proposalId = ${payload.proposalId}`);
            if (payload.solverId) {
                socketServer.broadcastToUser(payload.solverId, 'PROPOSAL_STATUS_UPDATE', {
                    proposalId: payload.proposalId,
                    status: 'REVIEW_COMPLETED',
                    message: 'Evaluation scores scorecard published',
                });
            }
        });
    }
}
exports.EventDispatcher = EventDispatcher;
exports.default = EventDispatcher;
