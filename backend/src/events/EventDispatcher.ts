import { EventBus } from './EventBus';
import { SocketServer } from '../realtime/socket.server';
import { logger } from '../config/logger';

export class EventDispatcher {
  public static initialize(): void {
    const bus = EventBus.getInstance();
    const socketServer = SocketServer.getInstance();

    logger.info('Registering system domain event subscribers...');

    // Subscribe to Proposal Submitted
    bus.subscribe('PROPOSAL_SUBMITTED', (payload: any) => {
      logger.info(`Reacting to PROPOSAL_SUBMITTED event: proposalId = ${payload.proposalId}`);
      if (payload.solverId) {
        socketServer.broadcastToUser(payload.solverId, 'PROPOSAL_STATUS_UPDATE', {
          proposalId: payload.proposalId,
          status: 'SUBMITTED',
          message: 'Proposal successfully submitted',
        });
      }
    });

    // Subscribe to Proposal Verified
    bus.subscribe('PROPOSAL_INSTITUTION_VERIFIED', (payload: any) => {
      logger.info(
        `Reacting to PROPOSAL_INSTITUTION_VERIFIED event: proposalId = ${payload.proposalId}`,
      );
      if (payload.solverId) {
        socketServer.broadcastToUser(payload.solverId, 'PROPOSAL_STATUS_UPDATE', {
          proposalId: payload.proposalId,
          status: 'INSTITUTION_VERIFIED',
          message: 'Proposal verified by institution',
        });
      }
    });

    // Subscribe to Reviews
    bus.subscribe('PROPOSAL_REVIEW_SUBMITTED', (payload: any) => {
      logger.info(
        `Reacting to PROPOSAL_REVIEW_SUBMITTED event: proposalId = ${payload.proposalId}`,
      );
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

export default EventDispatcher;
