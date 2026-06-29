import rateLimit from 'express-rate-limit';
import { sendResponse } from '../responses/response';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 authentication requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    res.status(429).json({
      success: false,
      message: options.message,
      requestId: res.getHeader('x-request-id') || undefined,
      timestamp: new Date().toISOString(),
    });
  },
});
