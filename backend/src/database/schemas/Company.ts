import { Schema, model, Document, Types } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  websiteUrl?: string;
  logo?: string;
  description?: string;
  address?: string;
  gst?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isCIIMember: boolean;
  industrySpocs: Types.ObjectId[];
  hiringStatus: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  version: number;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, unique: true, index: true },
    industry: { type: String, required: true },
    websiteUrl: { type: String },
    logo: { type: String },
    description: { type: String },
    address: { type: String },
    gst: { type: String },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    isCIIMember: { type: Boolean, default: false },
    industrySpocs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    hiringStatus: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
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

export const CompanyModel = model<ICompany>('Company', CompanySchema);
export default CompanyModel;
