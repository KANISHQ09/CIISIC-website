import { apiClient } from './api/client';
import { AuditLogEntry } from '@/types/adminPortal';

export class AuditLogService {
  public static async getLogs(): Promise<AuditLogEntry[]> {
    const response = await apiClient.get('/api/v1/audit');
    const list = response.data.data || [];
    return list.map((l: any) => ({
      id: l._id,
      userId: l.userId,
      userName: l.userName,
      action: l.action,
      description: l.description,
      timestamp: l.createdAt,
      ipAddress: l.ipAddress,
      category: l.category
    }));
  }

  public static async logAction(
    action: string,
    description: string,
    category: AuditLogEntry['category']
  ): Promise<AuditLogEntry> {
    const response = await apiClient.post('/api/v1/audit', {
      action,
      description,
      category
    });
    const l = response.data.data;
    return {
      id: l._id,
      userId: l.userId,
      userName: l.userName,
      action: l.action,
      description: l.description,
      timestamp: l.createdAt,
      ipAddress: l.ipAddress,
      category: l.category
    };
  }
}
export default AuditLogService;
