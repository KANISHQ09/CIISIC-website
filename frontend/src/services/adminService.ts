import { apiClient } from './api/client';
import { UserRecord, SystemHealthStatus } from '@/types/adminPortal';

export class AdminService {
  public static async getDashboardStats() {
    const response = await apiClient.get('/api/v1/analytics/admin-dashboard');
    return response.data.data;
  }

  public static async getUsers(params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<UserRecord[]> {
    const response = await apiClient.get('/api/v1/users', { params });
    const list = response.data.data || [];
    return list.map((u: any) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.isVerified ? 'ACTIVE' : 'PENDING',
      collegeName: u.institutionId?.name || '',
      companyName: u.companyId?.name || '',
      dateCreated: u.createdAt
    }));
  }

  public static async updateUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<UserRecord | null> {
    const response = await apiClient.patch(`/api/v1/users/${id}/status`, { status });
    const u = response.data.data;
    if (!u) return null;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.isVerified ? 'ACTIVE' : 'PENDING',
      collegeName: u.institutionId?.name || '',
      companyName: u.companyId?.name || '',
      dateCreated: u.createdAt
    };
  }

  public static async verifyUser(id: string): Promise<void> {
    await apiClient.patch(`/api/v1/users/${id}/verify`);
  }

  public static async getPlatformHealth(): Promise<SystemHealthStatus[]> {
    const response = await apiClient.get('/api/v1/platform/health');
    const data = response.data.data;
    return [
      { service: 'Backend API Server', status: data.status === 'operational' ? 'OPERATIONAL' : 'DEGRADED', latencyMs: 0 },
      { service: 'MongoDB Database', status: data.services?.database === 'healthy' ? 'OPERATIONAL' : 'DEGRADED', latencyMs: 0 }
    ];
  }
}
