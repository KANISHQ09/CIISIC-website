import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC' | 'SUPER_ADMIN' | 'CII_ADMIN';
  isVerified: boolean;
  avatarUrl?: string;
  studentProfile?: {
    enrollmentNo: string;
    institutionId: string;
    department: string;
    yearOfStudy: number;
    skills: string[];
  };
  industryProfile?: {
    companyName: string;
    industry: string;
    websiteUrl?: string;
    isCIIMember: boolean;
  };
  institutionProfile?: {
    institutionId: string;
    designation: string;
    department: string;
  };
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'SUPER_ADMIN', 'CII_ADMIN'] 
  },
  isVerified: { type: Boolean, default: false },
  avatarUrl: { type: String },
  studentProfile: {
    enrollmentNo: { type: String },
    institutionId: { type: String },
    department: { type: String },
    yearOfStudy: { type: Number },
    skills: [{ type: String }]
  },
  industryProfile: {
    companyName: { type: String },
    industry: { type: String },
    websiteUrl: { type: String },
    isCIIMember: { type: Boolean, default: false }
  },
  institutionProfile: {
    institutionId: { type: String },
    designation: { type: String },
    department: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Method to verify passwords
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
