import { RBACPermission, PlatformRole } from '@/types/adminPortal';

export class PermissionService {
  private static STORAGE_KEY = 'ciisic_rbac_permissions';

  public static async getPermissions(): Promise<RBACPermission[]> {
    if (typeof window === 'undefined') return this.getMockPermissions();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockPermissions();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async updatePermission(key: string, allowedRoles: PlatformRole[]): Promise<RBACPermission | null> {
    const list = await this.getPermissions();
    const index = list.findIndex((p) => p.key === key);
    if (index === -1) return null;

    list[index].allowedRoles = allowedRoles;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return list[index];
  }

  private static getMockPermissions(): RBACPermission[] {
    return [
      {
        key: 'submit_proposal',
        label: 'Upload Solution Proposals',
        allowedRoles: ['STUDENT', 'SUPER_ADMIN']
      },
      {
        key: 'create_challenge',
        label: 'Create Corporate Challenge Statement',
        allowedRoles: ['INDUSTRY_SPOC', 'SUPER_ADMIN']
      },
      {
        key: 'evaluate_solution',
        label: 'Evaluate & Score Solution Sheets',
        allowedRoles: ['INDUSTRY_SPOC', 'REVIEWER', 'SUPER_ADMIN']
      },
      {
        key: 'verify_student',
        label: 'Verify Registrant Enrollment Accounts',
        allowedRoles: ['INSTITUTION_SPOC', 'SUPER_ADMIN']
      },
      {
        key: 'view_audit_logs',
        label: 'View Immutable Audit Timeline Logs',
        allowedRoles: ['SUPER_ADMIN']
      }
    ];
  }
}
