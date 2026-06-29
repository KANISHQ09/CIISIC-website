import { Schema, model, Document, Types } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  fileId?: Types.ObjectId; // Links to uploaded File
  category: 'GUIDELINE' | 'TEMPLATE' | 'POLICY' | 'TUTORIAL';
  isPublic: boolean;
  isDeleted: boolean;
  version: number;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileId: { type: Schema.Types.ObjectId, ref: 'File', index: true },
    category: {
      type: String,
      required: true,
      enum: ['GUIDELINE', 'TEMPLATE', 'POLICY', 'TUTORIAL'],
      index: true,
    },
    isPublic: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const ResourceModel = model<IResource>('Resource', ResourceSchema);
export default ResourceModel;
