import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';
import { AuthenticationError, AuthorizationError } from '../errors/AppError';
import { Permission, hasPermission } from '../security/permissions';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.ciisic_token;

  if (!token) {
    throw new AuthenticationError('Access token is missing');
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new AuthenticationError('Access token is invalid or expired');
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('User is not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Forbidden: Access is denied for this user role');
    }

    next();
  };
};

export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('User is not authenticated');
    }

    if (!hasPermission(req.user.role, permission)) {
      throw new AuthorizationError(`Forbidden: Missing required permission: ${permission}`);
    }

    next();
  };
};
