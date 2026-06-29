export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type FacultyRole = 'COORDINATOR' | 'MENTOR' | 'FACULTY_MEMBER';

export interface StudentAcademicRecord {
  id: string;
  name: string;
  department: string;
  year: number;
  cgpa: number;
  skills: string[];
  projects: {
    title: string;
    description: string;
  }[];
  verificationStatus: VerificationStatus;
  email: string;
  registrationNumber: string;
  resumeUrl?: string;
  participationHistory: {
    challengeTitle: string;
    status: string;
    date: string;
  }[];
}

export interface ExcellenceCell {
  id: string;
  cellName: string;
  coordinatorName: string;
  domainFocus: string;
  projectsCount: number;
  studentCount: number;
  researchAreas: string[];
  eventsCount: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: FacultyRole;
  department: string;
  assignedCell?: string;
  researchInterests: string[];
  studentsMentoredCount: number;
  email: string;
}

export interface InstitutionProfileData {
  id: string;
  name: string;
  logo: string;
  departments: string[];
  programs: string[];
  facultyCount: number;
  studentCount: number;
  website: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  location: string;
}
