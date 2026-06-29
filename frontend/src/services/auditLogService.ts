import { AuditLogEntry } from '@/types/adminPortal';

export class AuditLogService {
  private static STORAGE_KEY = 'ciisic_platform_audit_logs';

  public static async getLogs(): Promise<AuditLogEntry[]> {
    if (typeof window === 'undefined') return this.getMockLogs();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockLogs();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async logAction(
    userId: string,
    userName: string,
    action: string,
    description: string,
    category: AuditLogEntry['category']
  ): Promise<AuditLogEntry> {
    const logs = await this.getLogs();
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      userId,
      userName,
      action,
      description,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      category
    };

    logs.unshift(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    return entry;
  }

  private static getMockLogs(): AuditLogEntry[] {
    return [
      {
        id: 'log1',
        userId: 'usr5',
        userName: 'Global Administrator',
        action: 'ROLE_MODIFIED',
        description: 'Updated Dr. Ramesh RBAC access role permissions.',
        timestamp: '2026-06-29T10:00:00Z',
        ipAddress: '157.45.92.10',
        category: 'SETTINGS'
      },
      {
        id: 'log2',
        userId: 'usr5',
        userName: 'Global Administrator',
        action: 'USER_VERIFICATION',
        description: 'Verified Bhopal Institute of Science chapter registrants.',
        timestamp: '2026-06-29T09:12:00Z',
        ipAddress: '157.45.92.10',
        category: 'APPROVAL'
      },
      {
        id: 'log3',
        userId: 'usr2',
        userName: 'Amit Saxena',
        action: 'CHALLENGE_CREATED',
        description: 'Published EV Alarm Loop challenge brief.',
        timestamp: '2026-06-29T08:30:00Z',
        ipAddress: '110.12.84.4',
        category: 'SYSTEM'
      },
      {
        id: 'log4',
        userId: 'usr1',
        userName: 'Madhavan Singh',
        action: 'PROPOSAL_SUBMITTED',
        description: 'Submitted telemetry brief draft to Netlink.',
        timestamp: '2026-06-29T07:45:00Z',
        ipAddress: '110.45.12.8',
        category: 'ACCESS'
      }
    ];
  }
}
