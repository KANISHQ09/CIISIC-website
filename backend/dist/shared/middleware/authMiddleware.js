"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../config/jwt");
const AppError_1 = require("../errors/AppError");
const permissions_1 = require("../security/permissions");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.ciisic_token;
    if (!token) {
        throw new AppError_1.AuthenticationError('Access token is missing');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        throw new AppError_1.AuthenticationError('Access token is invalid or expired');
    }
};
exports.authenticate = authenticate;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError_1.AuthenticationError('User is not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            throw new AppError_1.AuthorizationError('Forbidden: Access is denied for this user role');
        }
        next();
    };
};
exports.requireRole = requireRole;
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError_1.AuthenticationError('User is not authenticated');
        }
        if (!(0, permissions_1.hasPermission)(req.user.role, permission)) {
            throw new AppError_1.AuthorizationError(`Forbidden: Missing required permission: ${permission}`);
        }
        next();
    };
};
exports.requirePermission = requirePermission;
