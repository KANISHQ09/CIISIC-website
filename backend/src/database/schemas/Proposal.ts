import { Schema, model, Document, Types } from 'mongoose';

export interface IProposal extends Document {
  title: string;
  abstract: string;
  solverId: Types.ObjectId;
  challengeId: Types.ObjectId;
  companyId: Types.ObjectId;
  institutionId: Types.ObjectId;
  teamMembers: string[];
  approachDocument?: string;
  attachments: string[];
  status:
    | 'DRAFT'
    | 'SUBMITTED'
    | 'INSTITUTION_VERIFIED'
    | 'REVIEW_ASSIGNED'
    | 'UNDER_REVIEW'
    | 'REVIEW_COMPLETED'
    | 'INDUSTRY_REVIEW'
    | 'REVISION_REQUESTED'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'COMPLETED'
    | 'WITHDRAWN';
  proposalVersion: number;
  reviewerId?: Types.ObjectId;
  reviewScores?: {
    innovation: number;
    technical: number;
    feasibility: number;
    scalability: number;
    documentation: number;
    businessImpact: number;
    weightedScore: number;
  };
  decisionHistory: Array<{
    status: string;
    actionBy: Types.ObjectId;
    comments?: string;
    timestamp: Date;
  }>;
  versionHistory: Array<{
    version: number;
    snapshot: string; // JSON string of proposal values
    modifiedBy: Types.ObjectId;
    timestamp: Date;
  }>;
  comments: Array<{
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: Date;
  }>;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  version: number;
}

const ProposalSchema = new Schema<IProposal>(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    solverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
    teamMembers: [{ type: String }],
    approachDocument: { type: String },
    attachments: [{ type: String }],
    status: {
      type: String,
      required: true,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'INSTITUTION_VERIFIED',
        'REVIEW_ASSIGNED',
        'UNDER_REVIEW',
        'REVIEW_COMPLETED',
        'INDUSTRY_REVIEW',
        'REVISION_REQUESTED',
        'ACCEPTED',
        'REJECTED',
        'COMPLETED',
        'WITHDRAWN',
      ],
      default: 'DRAFT',
      index: true,
    },
    proposalVersion: { type: Number, default: 1 },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    reviewScores: {
      innovation: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      feasibility: { type: Number, default: 0 },
      scalability: { type: Number, default: 0 },
      documentation: { type: Number, default: 0 },
      businessImpact: { type: Number, default: 0 },
      weightedScore: { type: Number, default: 0 },
    },
    decisionHistory: [
      {
        status: { type: String },
        actionBy: { type: Schema.Types.ObjectId, ref: 'User' },
        comments: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    versionHistory: [
      {
        version: { type: Number },
        snapshot: { type: String },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        authorName: { type: String, required: true },
        authorRole: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
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

// Compound indexes
ProposalSchema.index({ solverId: 1, challengeId: 1 }, { unique: true });
ProposalSchema.index({ reviewerId: 1, status: 1, isDeleted: 1 });
ProposalSchema.index({ institutionId: 1, status: 1, isDeleted: 1 });
ProposalSchema.index({ companyId: 1, status: 1, isDeleted: 1 });

export const ProposalModel = model<IProposal>('Proposal', ProposalSchema);
export default ProposalModel;
