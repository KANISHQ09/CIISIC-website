"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require("socket.io");
const socket_auth_1 = require("./socket.auth");
const logger_1 = require("../config/logger");
class SocketServer {
    static instance;
    io;
    constructor() { }
    static getInstance() {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer();
        }
        return SocketServer.instance;
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                credentials: true,
            },
        });
        logger_1.logger.info('Initializing Socket.IO Server instances...');
        // Apply namespace routes & auth handshakes
        const namespaces = ['/notifications', '/messages', '/dashboard', '/admin', '/presence'];
        namespaces.forEach((ns) => {
            const nsp = this.io.of(ns);
            nsp.use(socket_auth_1.socketAuth);
            nsp.on('connection', (socket) => {
                logger_1.logger.info(`Socket connected to namespace ${ns}: ${socket.id} (User: ${socket.user?.email})`);
                // Connect user to their personal user:id room
                if (socket.user?.id) {
                    socket.join(`user:${socket.user.id}`);
                    if (socket.user.role === 'SUPER_ADMIN') {
                        socket.join('admin');
                    }
                }
                socket.on('disconnect', () => {
                    logger_1.logger.info(`Socket disconnected from namespace ${ns}: ${socket.id}`);
                });
            });
        });
        return this.io;
    }
    broadcastToUser(userId, event, payload) {
        if (!this.io)
            return;
        this.io.of('/notifications').to(`user:${userId}`).emit(event, payload);
        this.io.of('/dashboard').to(`user:${userId}`).emit(event, payload);
    }
    broadcastToRoom(namespace, room, event, payload) {
        if (!this.io)
            return;
        this.io.of(namespace).to(room).emit(event, payload);
    }
    broadcastToAll(namespace, event, payload) {
        if (!this.io)
            return;
        this.io.of(namespace).emit(event, payload);
    }
}
exports.SocketServer = SocketServer;
exports.default = SocketServer;
