import { apiClient } from './api/client';

export class IndustryService {
  public static async getDashboardStats() {
    const response = await apiClient.get('/api/v1/analytics/industry-dashboard');
    return response.data.data;
  }
}
export default IndustryService;
