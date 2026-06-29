import { logger } from '../../config/logger';

export interface UserPresence {
  userId: string;
  socketId: string;
  online: boolean;
  lastActive: Date;
  activeRoom?: string;
}

export class PresenceService {
  private static instance: PresenceService;
  private readonly registry: Map<string, UserPresence>;

  private constructor() {
    this.registry = new Map();
  }

  public static getInstance(): PresenceService {
    if (!PresenceService.instance) {
      PresenceService.instance = new PresenceService();
    }
    return PresenceService.instance;
  }

  public setUserOnline(userId: string, socketId: string): void {
    this.registry.set(userId, {
      userId,
      socketId,
      online: true,
      lastActive: new Date(),
    });
    logger.info(`Presence: User ${userId} marked as ONLINE (Socket: ${socketId})`);
  }

  public setUserOffline(userId: string): void {
    const presence = this.registry.get(userId);
    if (presence) {
      presence.online = false;
      presence.lastActive = new Date();
      logger.info(`Presence: User ${userId} marked as OFFLINE`);
    }
  }

  public setUserActiveRoom(userId: string, activeRoom: string): void {
    const presence = this.registry.get(userId);
    if (presence) {
      presence.activeRoom = activeRoom;
      presence.lastActive = new Date();
    }
  }

  public getPresence(userId: string): UserPresence | undefined {
    return this.registry.get(userId);
  }

  public getAllPresence(): UserPresence[] {
    return Array.from(this.registry.values());
  }
}

export default PresenceService;
