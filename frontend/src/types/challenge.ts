export type ChallengeStatus = 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'JUDGING' | 'COMPLETED';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  bounty?: string;
  skillsRequired: string[];
  companyId: string;
  companyName: string;
  timeline: {
    startDate: string;
    endDate: string;
    judgingDate: string;
  };
  status: ChallengeStatus;
  createdAt: string;
}

export interface Submission {
  id: string;
  challengeId: string;
  teamId?: string;
  submittedBy: string; // User ID
  githubUrl: string;
  demoUrl?: string;
  notes?: string;
  grade?: {
    score: number;
    feedback: string;
    gradedBy: string; // Company User ID
  };
  createdAt: string;
}
