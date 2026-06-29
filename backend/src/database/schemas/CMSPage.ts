import { Schema, model, Document } from 'mongoose';

export interface ICMSPage extends Document {
  slug: string;
  title: string;
  content: string;
  sections: Array<{ name: string; value: any }>;
  isPublished: boolean;
  version: number;
}

const CMSPageSchema = new Schema<ICMSPage>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    sections: [{ name: String, value: Schema.Types.Mixed }],
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  },
);

export const CMSPageModel = model<ICMSPage>('CMSPage', CMSPageSchema);
export default CMSPageModel;
