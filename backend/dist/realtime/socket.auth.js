"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const logger_1 = require("../config/logger");
const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers.authorization?.split(' ')[1] ||
            parseCookie(socket.handshake.headers.cookie || '', 'ciisic_token');
        if (!token) {
            logger_1.logger.warn(`Unauthorized socket connection attempt: ${socket.id}`);
            return next(new Error('Authentication failed: Missing token'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        socket.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        logger_1.logger.info(`Socket authenticated: ${socket.id} (User: ${decoded.email}, Role: ${decoded.role})`);
        next();
    }
    catch (error) {
        logger_1.logger.warn(`Socket authentication error for ${socket.id}: ${error.message}`);
        next(new Error('Authentication failed: Invalid token'));
    }
};
exports.socketAuth = socketAuth;
function parseCookie(cookieString, cookieName) {
    const matches = cookieString.match(new RegExp('(?:^|; )' + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
}
