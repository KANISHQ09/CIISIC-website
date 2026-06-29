import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  category: 'PROPOSAL' | 'REVIEW' | 'CHALLENGE' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  content: string;
  deepLink?: string;
  isRead: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  version: number;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, enum: ['INFO', 'WARNING', 'ALERT', 'SUCCESS'] },
    category: {
      type: String,
      required: true,
      enum: ['PROPOSAL', 'REVIEW', 'CHALLENGE', 'SYSTEM'],
      default: 'SYSTEM',
      index: true,
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW', index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    deepLink: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

// Compound index
NotificationSchema.index({ userId: 1, isRead: 1, isDeleted: 1 });

export const NotificationModel = model<INotification>('Notification', NotificationSchema);
export default NotificationModel;
