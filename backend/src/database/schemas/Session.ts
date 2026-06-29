import { Schema, model, Document, Types } from 'mongoose';

export interface ISession extends Document {
  userId: Types.ObjectId;
  token: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  isDeleted: boolean;
  version: number;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const SessionModel = model<ISession>('Session', SessionSchema);
export default SessionModel;
