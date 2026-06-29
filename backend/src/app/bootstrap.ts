import { env } from '../config/env';
import { connectDB } from '../config/database';
import { logger } from '../config/logger';
import { seedDatabase } from '../database/seeds';

export const bootstrap = async (): Promise<void> => {
  logger.info('Initializing CIISIC Enterprise Engine Bootstrap Sequence...');

  // Ensure database connects before API listening
  await connectDB();

  // Run seed database helper
  await seedDatabase();

  logger.info('Bootstrap sequence completed successfully. Environment variables validated.');
};
