import { Schema, model, Document } from 'mongoose';

export interface IPlatformPermission extends Document {
  key: string;
  label: string;
  allowedRoles: string[];
}

const PlatformPermissionSchema = new Schema<IPlatformPermission>({
  key: { type: String, required: true, unique: true, index: true },
  label: { type: String, required: true },
  allowedRoles: [{ type: String }],
});

export const PlatformPermissionModel = model<IPlatformPermission>('PlatformPermission', PlatformPermissionSchema);
export default PlatformPermissionModel;
