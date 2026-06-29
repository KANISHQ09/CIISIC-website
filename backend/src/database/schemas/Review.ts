import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  proposalId: Types.ObjectId;
  innovationScore: number;
  technicalScore: number;
  feasibilityScore: number;
  scalabilityScore: number;
  documentationScore: number;
  businessImpactScore: number;
  totalScore: number;
  comments: string;
  recommendation: 'APPROVED' | 'REVISING' | 'REJECTED';
  evaluatedBy: Types.ObjectId;
  confidentialNotes?: string;
  publicFeedback?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  version: number;
}

const ReviewSchema = new Schema<IReview>(
  {
    proposalId: { type: Schema.Types.ObjectId, ref: 'Proposal', required: true, index: true },
    innovationScore: { type: Number, required: true, min: 1, max: 10 },
    technicalScore: { type: Number, required: true, min: 1, max: 10, default: 5 },
    feasibilityScore: { type: Number, required: true, min: 1, max: 10 },
    scalabilityScore: { type: Number, required: true, min: 1, max: 10, default: 5 },
    documentationScore: { type: Number, required: true, min: 1, max: 10 },
    businessImpactScore: { type: Number, required: true, min: 1, max: 10, default: 5 },
    totalScore: { type: Number, required: true },
    comments: { type: String, required: true },
    recommendation: {
      type: String,
      required: true,
      enum: ['APPROVED', 'REVISING', 'REJECTED'],
      index: true,
    },
    evaluatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    confidentialNotes: { type: String },
    publicFeedback: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

ReviewSchema.index({ recommendation: 1, totalScore: -1, isDeleted: 1 });

export const ReviewModel = model<IReview>('Review', ReviewSchema);
export default ReviewModel;
