import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: Types.ObjectId;
  enrollmentNo: string;
  institutionId: Types.ObjectId;
  department: string;
  yearOfStudy: number;
  skills: string[];
  projects?: Array<{ title: string; description: string; link?: string }>;
  education?: Array<{ institution: string; degree: string; year: string }>;
  resumeUrl?: string;
  resumeName?: string;
  portfolioUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  completionPercentage?: number;
  points?: number;
  level?: number;
  rank?: number;
  bookmarkedChallenges?: Types.ObjectId[];
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  version: number;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    enrollmentNo: { type: String, required: true, unique: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
    department: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    skills: [{ type: String }],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        link: { type: String }
      }
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        year: { type: String }
      }
    ],
    resumeUrl: { type: String },
    resumeName: { type: String },
    portfolioUrl: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String }
    },
    completionPercentage: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: Number, default: 0 },
    bookmarkedChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

// Compound index for department and year of study filters
StudentProfileSchema.index({ department: 1, yearOfStudy: 1, isDeleted: 1 });

export const StudentProfileModel = model<IStudentProfile>('StudentProfile', StudentProfileSchema);
export default StudentProfileModel;
