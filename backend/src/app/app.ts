import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { corsOptions } from '../config/cors';
import { helmetConfig } from '../config/helmet';
import { requestIdMiddleware } from '../shared/middleware/requestId';
import { errorHandler } from '../shared/middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

// Secure Headers Configuration
app.use(helmetConfig);

// CORS Policy Configuration
app.use(cors(corsOptions));

// Global Middlewares
app.use(requestIdMiddleware);
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: '10mb' })); // Request payload size capping
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import { mongoSanitize } from '../shared/middleware/mongoSanitize';
app.use(mongoSanitize);

// Versioned APIs
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Interceptor
app.use(errorHandler);

export default app;
