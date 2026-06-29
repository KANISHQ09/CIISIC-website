import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: Types.ObjectId;
  enrollmentNo: string;
  institutionId: Types.ObjectId;
  department: string;
  yearOfStudy: number;
  skills: string[];
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
