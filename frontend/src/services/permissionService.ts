import { apiClient } from './api/client';
import { RBACPermission, PlatformRole } from '@/types/adminPortal';

export class PermissionService {
  public static async getPermissions(): Promise<RBACPermission[]> {
    const response = await apiClient.get('/api/v1/platform/permissions');
    const list = response.data.data || [];
    return list.map((p: any) => ({
      key: p.key,
      label: p.label,
      allowedRoles: p.allowedRoles
    }));
  }

  public static async updatePermission(key: string, allowedRoles: PlatformRole[]): Promise<RBACPermission | null> {
    const response = await apiClient.patch(`/api/v1/platform/permissions/${key}`, { allowedRoles });
    const p = response.data.data;
    if (!p) return null;
    return {
      key: p.key,
      label: p.label,
      allowedRoles: p.allowedRoles
    };
  }
}
export default PermissionService;
