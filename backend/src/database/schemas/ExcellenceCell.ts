import { Schema, model, Document, Types } from 'mongoose';

export interface IExcellenceCell extends Document {
  name: string;
  theme: string;
  description: string;
  banner?: string;
  icon?: string;
  hostInstitutionId: Types.ObjectId;
  facultySpocs: Types.ObjectId[];
  industryPartners: Types.ObjectId[];
  status: 'ACTIVE' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE';
  researchDomain: string;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  version: number;
}

const ExcellenceCellSchema = new Schema<IExcellenceCell>(
  {
    name: { type: String, required: true },
    theme: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String },
    icon: { type: String },
    hostInstitutionId: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    facultySpocs: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    industryPartners: [{ type: Schema.Types.ObjectId, ref: 'Company', index: true }],
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE', index: true },
    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC', index: true },
    researchDomain: { type: String, required: true, index: true },
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

// Compound index for domain filtering per institution
ExcellenceCellSchema.index({ hostInstitutionId: 1, researchDomain: 1, isDeleted: 1 });
ExcellenceCellSchema.index({ status: 1, visibility: 1, isDeleted: 1 });

export const ExcellenceCellModel = model<IExcellenceCell>('ExcellenceCell', ExcellenceCellSchema);
export default ExcellenceCellModel;
