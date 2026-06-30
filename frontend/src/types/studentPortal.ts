export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ChallengeStatus = 'OPEN' | 'CLOSED' | 'UNDER_REVIEW';

export interface ChallengeFAQ {
  question: string;
  answer: string;
}

export interface DiscussionMessage {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  companyName: string;
  companyLogo?: string;
  institutionName?: string;
  difficulty: ChallengeDifficulty;
  skillsRequired: string[];
  techStack: string[];
  deliverables: string[];
  timeline: {
    published: string;
    submissionDeadline: string;
    reviewCompleted: string;
  };
  attachments?: { name: string; url: string; size: string }[];
  faqs?: ChallengeFAQ[];
  discussion?: DiscussionMessage[];
  status: ChallengeStatus;
  deadline: string;
  bookmarkCount: number;
  category: string;
  industry: string;
}

export type ProposalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'INSTITUTION_VERIFIED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'REVISION_REQUESTED';

export interface ProposalVersion {
  version: number;
  submissionDate: string;
  fileUrl: string;
  fileName: string;
  description: string;
}

export interface Proposal {
  id: string;
  challengeId: string;
  challengeTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  technicalApproach: string;
  fileUrl: string;
  fileName: string;
  status: ProposalStatus;
  submissionDate: string;
  feedback?: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  versionHistory: ProposalVersion[];
  comments?: DiscussionMessage[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'CHALLENGE' | 'PROPOSAL' | 'MESSAGE' | 'SYSTEM';
  date: string;
  isRead: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: string;
  online: boolean;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
}

export interface StudentProject {
  title: string;
  description: string;
  link?: string;
}

export interface StudentEducation {
  institution: string;
  degree: string;
  year: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  skills: string[];
  projects: StudentProject[];
  education: StudentEducation[];
  resumeUrl?: string;
  resumeName?: string;
  portfolioUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  completionPercentage: number;
  points: number;
  level: number;
  rank: number;
  enrollmentNo: string;
  department: string;
  yearOfStudy: number;
  institutionName: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  institution: string;
  points: number;
  avatar?: string;
  isMe?: boolean;
}
