import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { logger } from '../config/logger';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const socketAuth = (socket: AuthenticatedSocket, next: (err?: Error) => void): void => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1] ||
      parseCookie(socket.handshake.headers.cookie || '', 'ciisic_token');

    if (!token) {
      logger.warn(`Unauthorized socket connection attempt: ${socket.id}`);
      return next(new Error('Authentication failed: Missing token'));
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as {
      id: string;
      email: string;
      role: string;
    };

    socket.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    logger.info(
      `Socket authenticated: ${socket.id} (User: ${decoded.email}, Role: ${decoded.role})`,
    );
    next();
  } catch (error: any) {
    logger.warn(`Socket authentication error for ${socket.id}: ${error.message}`);
    next(new Error('Authentication failed: Invalid token'));
  }
};

function parseCookie(cookieString: string, cookieName: string): string | null {
  const matches = cookieString.match(
    new RegExp(
      '(?:^|; )' + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
