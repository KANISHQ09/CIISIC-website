import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { bootstrap } from './bootstrap';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { SocketServer } from '../realtime/socket.server';
import { EventDispatcher } from '../events/EventDispatcher';

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Run bootstrapper
    await bootstrap();

    const httpServer = http.createServer(app);

    // Initialize Socket Server
    SocketServer.getInstance().initialize(httpServer);

    // Initialize Event Dispatcher
    EventDispatcher.initialize();

    const server = httpServer.listen(PORT, () => {
      logger.info(`CIISIC Engine operational in ${env.NODE_ENV} mode listening on port ${PORT}`);
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal: string) => {
      logger.warn(`Process caught signal ${signal}. Initiating graceful termination...`);

      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await mongoose.connection.close(false);
          logger.info('Database connection pooled connections terminated.');
          process.exit(0);
        } catch (err) {
          logger.error(`Database disconnect failure: ${(err as Error).message}`);
          process.exit(1);
        }
      });

      // Force terminate after 10s if graceful shut down hangs
      setTimeout(() => {
        logger.error('Forceful termination sequence activated.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.fatal(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();
