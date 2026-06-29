import { Schema, model, Document, Types } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
  code: string;
  location: string;
  universityType: string;
  city: string;
  state: string;
  address: string;
  website?: string;
  email: string;
  phone?: string;
  logo?: string;
  banner?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  primarySpoc?: Types.ObjectId;
  facultyMembers: Types.ObjectId[];
  departments: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  version: number;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    location: { type: String, required: true },
    universityType: { type: String, required: true, default: 'Private' },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    address: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    logo: { type: String },
    banner: { type: String },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'SUSPENDED'],
      default: 'PENDING',
      index: true,
    },
    primarySpoc: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    facultyMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    departments: [{ type: String }],
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

export const InstitutionModel = model<IInstitution>('Institution', InstitutionSchema);
export default InstitutionModel;
