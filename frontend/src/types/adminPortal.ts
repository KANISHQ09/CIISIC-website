export type PlatformRole = 'STUDENT' | 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC' | 'REVIEWER' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  status: UserStatus;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  companyName?: string;
  collegeName?: string;
  dateCreated: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  category: 'AUTH' | 'APPROVAL' | 'SETTINGS' | 'ACCESS' | 'SYSTEM';
}

export interface CMSContentData {
  id: string;
  category: 'LANDING' | 'FAQ' | 'RESOURCES' | 'PARTNERS';
  key: string;
  title: string;
  content: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface RBACPermission {
  key: string;
  label: string;
  allowedRoles: PlatformRole[];
}

export interface SystemHealthStatus {
  service: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
}
