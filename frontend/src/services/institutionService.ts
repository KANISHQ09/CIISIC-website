import { apiClient } from './api/client';

export class InstitutionService {
  public static async getDashboardStats() {
    const response = await apiClient.get('/api/v1/analytics/institution-dashboard');
    return response.data.data;
  }

  public static async getInstitutions(): Promise<any[]> {
    const response = await apiClient.get('/api/v1/institutions');
    return response.data.data || [];
  }
}
export default InstitutionService;
