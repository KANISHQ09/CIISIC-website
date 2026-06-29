"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    MONGODB_URI: zod_1.z.string({
        message: 'MONGODB_URI is required for database connections',
    }),
    JWT_SECRET: zod_1.z
        .string({
        message: 'JWT_SECRET signature key is required',
    })
        .min(16, 'JWT_SECRET must be at least 16 characters long'),
    JWT_REFRESH_SECRET: zod_1.z
        .string({
        message: 'JWT_REFRESH_SECRET key is required',
    })
        .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters long'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Environment configuration validation failed:');
    console.error(JSON.stringify(_env.error.format(), null, 2));
    process.exit(1);
}
exports.env = _env.data;
