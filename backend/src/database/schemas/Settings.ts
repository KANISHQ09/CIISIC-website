import { Schema, model, Document } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
  description?: string;
  category: 'BRANDING' | 'SECURITY' | 'UPLOAD_LIMITS' | 'EMAIL';
  version: number;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: ['BRANDING', 'SECURITY', 'UPLOAD_LIMITS', 'EMAIL'],
      index: true,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const SettingsModel = model<ISettings>('Settings', SettingsSchema);
export default SettingsModel;
