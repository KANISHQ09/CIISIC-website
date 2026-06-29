import { User } from './user';

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  role: 'STUDENT' | 'INDUSTRY' | 'INSTITUTION';
  affiliationName?: string;
}
