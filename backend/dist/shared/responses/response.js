"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = ({ res, statusCode = 200, message, data = null, meta = null, }) => {
    const requestId = res.getHeader('x-request-id') || undefined;
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
        meta,
        requestId,
        timestamp: new Date().toISOString(),
    });
};
exports.sendResponse = sendResponse;
