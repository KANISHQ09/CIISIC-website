export type UserRole = 'STUDENT' | 'INDUSTRY' | 'INSTITUTION' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  affiliationId?: string; // ID of Academic Institution or Company Partner
  profileImage?: string;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'STUDENT';
  skills: string[];
  bio?: string;
  resumeUrl?: string;
  badges: string[]; // Verifiable badge IDs
}

export interface IndustryProfile extends User {
  role: 'INDUSTRY';
  companyName: string;
  website: string;
  description?: string;
  isVerified: boolean;
}

export interface InstitutionProfile extends User {
  role: 'INSTITUTION';
  institutionName: string;
  code: string;
  isVerified: boolean;
}
