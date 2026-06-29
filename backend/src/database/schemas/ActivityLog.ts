import { Schema, model, Document, Types } from 'mongoose';

export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  event: string;
  metadata?: Record<string, any>;
  isDeleted: boolean;
  version: number;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const ActivityLogModel = model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLogModel;
