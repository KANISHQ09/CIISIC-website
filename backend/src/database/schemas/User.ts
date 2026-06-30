import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC' | 'REVIEWER' | 'SUPER_ADMIN';
  isVerified: boolean;
  isDeleted: boolean;
  isSuspended?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'REVIEWER', 'SUPER_ADMIN'],
      index: true,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    isSuspended: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

// Compound index for filtering active users by role
UserSchema.index({ role: 1, isDeleted: 1 });

export const UserModel = model<IUser>('User', UserSchema);
export default UserModel;
