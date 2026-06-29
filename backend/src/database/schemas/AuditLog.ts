import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  userName: string;
  action: string;
  description: string;
  ipAddress: string;
  category: 'AUTH' | 'APPROVAL' | 'SETTINGS' | 'ACCESS' | 'SYSTEM';
  isDeleted: boolean;
  version: number;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    description: { type: String, required: true },
    ipAddress: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['AUTH', 'APPROVAL', 'SETTINGS', 'ACCESS', 'SYSTEM'],
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

// Compound index for querying log actions by category and date
AuditLogSchema.index({ category: 1, createdAt: -1, isDeleted: 1 });

export const AuditLogModel = model<IAuditLog>('AuditLog', AuditLogSchema);
export default AuditLogModel;
