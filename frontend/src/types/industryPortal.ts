export type ChallengeStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type RecommendationType = 'APPROVE' | 'REJECT' | 'REVISION_REQUESTED';

export interface ChallengeDraft {
  id?: string;
  title: string;
  category: string;
  problemStatement: string;
  requirements: string[];
  techStack: string[];
  deliverables: string[];
  eligibility: {
    branches: string[];
    minCGPA: number;
    yearOfStudy: number[];
  };
  timeline: {
    submissionDeadline: string;
    reviewCompleted: string;
    published: string;
  };
  attachments: {
    name: string;
    size: string;
    url: string;
  }[];
  status: ChallengeStatus;
}

export interface ChallengeManagement {
  id: string;
  title: string;
  category: string;
  companyName: string;
  status: ChallengeStatus;
  dateCreated: string;
  submissionsCount: number;
  pendingCount: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface ProposalEvaluation {
  proposalId: string;
  technicalScore: number; // 1-10
  innovationScore: number; // 1-10
  feasibilityScore: number; // 1-10
  impactScore: number; // 1-10
  totalScore: number; // calculated average
  recommendation: RecommendationType;
  comments: string;
  internalNotes?: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface ShortlistCandidate {
  studentId: string;
  studentName: string;
  major: string;
  college: string;
  cgpa: number;
  skills: string[];
  achievementsCount: number;
  proposalScore: number;
  proposalId: string;
  proposalTitle: string;
  resumeUrl: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface CompanyMember {
  id: string;
  name: string;
  email: string;
  role: 'SPOC' | 'TEAM_MEMBER';
}

export interface CompanyProfileData {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  domain: string;
  location: string;
  members: CompanyMember[];
  isVerified: boolean;
  statistics: {
    totalChallenges: number;
    activeChallenges: number;
    totalSubmissions: number;
    shortlistedCandidates: number;
  };
}

export interface PerformanceMetric {
  date: string;
  applications: number;
  shortlisted: number;
}
