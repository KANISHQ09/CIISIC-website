import { env } from './env';

export const jwtConfig = {
  secret: env.JWT_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  accessExpiration: '15m',
  refreshExpiration: '7d',
};
