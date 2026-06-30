import { Schema, model, Document, Types } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  slug: string;
  description: string;
  problemStatement: string;
  objectives: string;
  expectedDeliverables: string;
  technologies: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: string;
  budget: string;
  companyId: Types.ObjectId;
  status:
    | 'DRAFT'
    | 'PENDING_APPROVAL'
    | 'PUBLISHED'
    | 'OPEN'
    | 'UNDER_REVIEW'
    | 'CLOSED'
    | 'ARCHIVED'
    | 'CANCELLED';
  isFeatured: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  datasetLinks: string[];
  submissionDeadline: Date;
  visibility: 'PUBLIC' | 'PRIVATE';
  cellId?: Types.ObjectId;
  institutionScope?: Types.ObjectId[];
  reviewerId?: Types.ObjectId;
  evaluationCriteria?: string;
  tags: string[];
  category?: string;
  industry?: string;
  skillsRequired?: string[];
  version: number;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    problemStatement: { type: String, required: true },
    objectives: { type: String, required: true },
    expectedDeliverables: { type: String, required: true },
    technologies: [{ type: String }],
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM', index: true },
    duration: { type: String, required: true },
    budget: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: [
        'DRAFT',
        'PENDING_APPROVAL',
        'PUBLISHED',
        'OPEN',
        'UNDER_REVIEW',
        'CLOSED',
        'ARCHIVED',
        'CANCELLED',
      ],
      default: 'DRAFT',
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
    datasetLinks: [{ type: String }],
    submissionDeadline: { type: Date, required: true, index: true },
    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC', index: true },
    cellId: { type: Schema.Types.ObjectId, ref: 'ExcellenceCell', index: true },
    institutionScope: [{ type: Schema.Types.ObjectId, ref: 'Institution', index: true }],
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    evaluationCriteria: { type: String },
    tags: [{ type: String, index: true }],
    category: { type: String },
    industry: { type: String },
    skillsRequired: [{ type: String }],
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

// Compound indexes
ChallengeSchema.index({ status: 1, submissionDeadline: 1, isDeleted: 1 });
ChallengeSchema.index({ companyId: 1, status: 1, isDeleted: 1 });
ChallengeSchema.index({ cellId: 1, isFeatured: 1, isDeleted: 1 });
ChallengeSchema.index({ institutionScope: 1, status: 1, isDeleted: 1 });

export const ChallengeModel = model<IChallenge>('Challenge', ChallengeSchema);
export default ChallengeModel;
