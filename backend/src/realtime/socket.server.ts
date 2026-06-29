import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { socketAuth, AuthenticatedSocket } from './socket.auth';
import { logger } from '../config/logger';

export class SocketServer {
  private static instance: SocketServer;
  private io!: SocketIOServer;

  private constructor() {}

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  public initialize(server: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
      },
    });

    logger.info('Initializing Socket.IO Server instances...');

    // Apply namespace routes & auth handshakes
    const namespaces = ['/notifications', '/messages', '/dashboard', '/admin', '/presence'];

    namespaces.forEach((ns) => {
      const nsp = this.io.of(ns);
      nsp.use(socketAuth as any);
      nsp.on('connection', (socket: AuthenticatedSocket) => {
        logger.info(
          `Socket connected to namespace ${ns}: ${socket.id} (User: ${socket.user?.email})`,
        );

        // Connect user to their personal user:id room
        if (socket.user?.id) {
          socket.join(`user:${socket.user.id}`);

          if (socket.user.role === 'SUPER_ADMIN') {
            socket.join('admin');
          }
        }

        socket.on('disconnect', () => {
          logger.info(`Socket disconnected from namespace ${ns}: ${socket.id}`);
        });
      });
    });

    return this.io;
  }

  public broadcastToUser(userId: string, event: string, payload: any): void {
    if (!this.io) return;
    this.io.of('/notifications').to(`user:${userId}`).emit(event, payload);
    this.io.of('/dashboard').to(`user:${userId}`).emit(event, payload);
  }

  public broadcastToRoom(namespace: string, room: string, event: string, payload: any): void {
    if (!this.io) return;
    this.io.of(namespace).to(room).emit(event, payload);
  }

  public broadcastToAll(namespace: string, event: string, payload: any): void {
    if (!this.io) return;
    this.io.of(namespace).emit(event, payload);
  }
}

export default SocketServer;
