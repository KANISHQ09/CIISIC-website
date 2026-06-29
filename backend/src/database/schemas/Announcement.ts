import { Schema, model, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category: 'GENERAL' | 'CHALLENGE' | 'SYSTEM' | 'EVENT';
  targetRoles: string[]; // ['STUDENT', 'REVIEWER', etc]
  isPinned: boolean;
  isPublished: boolean;
  version: number;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['GENERAL', 'CHALLENGE', 'SYSTEM', 'EVENT'],
      index: true,
    },
    targetRoles: [{ type: String }],
    isPinned: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const AnnouncementModel = model<IAnnouncement>('Announcement', AnnouncementSchema);
export default AnnouncementModel;
