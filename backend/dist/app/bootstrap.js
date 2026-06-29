"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const database_1 = require("../config/database");
const logger_1 = require("../config/logger");
const seeds_1 = require("../database/seeds");
const bootstrap = async () => {
    logger_1.logger.info('Initializing CIISIC Enterprise Engine Bootstrap Sequence...');
    // Ensure database connects before API listening
    await (0, database_1.connectDB)();
    // Run seed database helper
    await (0, seeds_1.seedDatabase)();
    logger_1.logger.info('Bootstrap sequence completed successfully. Environment variables validated.');
};
exports.bootstrap = bootstrap;
