"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_2 = require("../config/cors");
const helmet_1 = require("../config/helmet");
const requestId_1 = require("../shared/middleware/requestId");
const errorHandler_1 = require("../shared/middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Secure Headers Configuration
app.use(helmet_1.helmetConfig);
// CORS Policy Configuration
app.use((0, cors_1.default)(cors_2.corsOptions));
// Global Middlewares
app.use(requestId_1.requestIdMiddleware);
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' })); // Request payload size capping
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const mongoSanitize_1 = require("../shared/middleware/mongoSanitize");
app.use(mongoSanitize_1.mongoSanitize);
// Versioned APIs
app.use('/api', routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'UP',
        timestamp: new Date().toISOString(),
    });
});
// Global Error Interceptor
app.use(errorHandler_1.errorHandler);
exports.default = app;
