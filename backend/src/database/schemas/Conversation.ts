import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  type: 'PROPOSAL' | 'CHALLENGE' | 'SYSTEM';
  referenceId?: Types.ObjectId; // Links to Proposal or Challenge
  isDeleted: boolean;
  deletedAt?: Date;
  version: number;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    type: {
      type: String,
      enum: ['PROPOSAL', 'CHALLENGE', 'SYSTEM'],
      default: 'PROPOSAL',
      index: true,
    },
    referenceId: { type: Schema.Types.ObjectId, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const ConversationModel = model<IConversation>('Conversation', ConversationSchema);
export default ConversationModel;
