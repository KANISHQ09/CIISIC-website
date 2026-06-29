import { Schema, model, Document, Types } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  uploadedBy: Types.ObjectId;
  hash?: string;
  isDeleted: boolean;
  version: number;
}

const FileSchema = new Schema<IFile>(
  {
    filename: { type: String, required: true, unique: true, index: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storageKey: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hash: { type: String, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const FileModel = model<IFile>('File', FileSchema);
export default FileModel;
