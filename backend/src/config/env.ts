import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string({
    message: 'MONGODB_URI is required for database connections',
  }),
  JWT_SECRET: z
    .string({
      message: 'JWT_SECRET signature key is required',
    })
    .min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_REFRESH_SECRET: z
    .string({
      message: 'JWT_REFRESH_SECRET key is required',
    })
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters long'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Environment configuration validation failed:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
