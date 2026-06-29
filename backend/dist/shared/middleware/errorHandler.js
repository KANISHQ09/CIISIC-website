"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const logger_1 = require("../../config/logger");
const env_1 = require("../../config/env");
const errorHandler = (err, req, res, next) => {
    const reqId = res.getHeader('x-request-id') || undefined;
    if (err instanceof AppError_1.AppError) {
        logger_1.logger.warn({
            message: err.message,
            statusCode: err.statusCode,
            requestId: reqId,
            stack: env_1.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err instanceof AppError_1.ValidationError ? err.errors : undefined,
            requestId: reqId,
            timestamp: new Date().toISOString(),
        });
        return;
    }
    // Fallback for unhandled native exceptions
    logger_1.logger.error({
        message: err.message,
        requestId: reqId,
        stack: err.stack,
    });
    res.status(500).json({
        success: false,
        message: env_1.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        requestId: reqId,
        timestamp: new Date().toISOString(),
    });
};
exports.errorHandler = errorHandler;
