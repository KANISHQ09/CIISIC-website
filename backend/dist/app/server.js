"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const bootstrap_1 = require("./bootstrap");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const socket_server_1 = require("../realtime/socket.server");
const EventDispatcher_1 = require("../events/EventDispatcher");
const PORT = env_1.env.PORT;
const startServer = async () => {
    try {
        // Run bootstrapper
        await (0, bootstrap_1.bootstrap)();
        const httpServer = http_1.default.createServer(app_1.default);
        // Initialize Socket Server
        socket_server_1.SocketServer.getInstance().initialize(httpServer);
        // Initialize Event Dispatcher
        EventDispatcher_1.EventDispatcher.initialize();
        const server = httpServer.listen(PORT, () => {
            logger_1.logger.info(`CIISIC Engine operational in ${env_1.env.NODE_ENV} mode listening on port ${PORT}`);
        });
        // Graceful Shutdown Handler
        const shutdown = async (signal) => {
            logger_1.logger.warn(`Process caught signal ${signal}. Initiating graceful termination...`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed.');
                try {
                    await mongoose_1.default.connection.close(false);
                    logger_1.logger.info('Database connection pooled connections terminated.');
                    process.exit(0);
                }
                catch (err) {
                    logger_1.logger.error(`Database disconnect failure: ${err.message}`);
                    process.exit(1);
                }
            });
            // Force terminate after 10s if graceful shut down hangs
            setTimeout(() => {
                logger_1.logger.error('Forceful termination sequence activated.');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.fatal(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};
startServer();
