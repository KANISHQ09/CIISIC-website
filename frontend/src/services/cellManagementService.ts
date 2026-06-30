import { apiClient } from './api/client';
import { ExcellenceCell } from '@/types/institutionPortal';

export class CellManagementService {
  public static async getCells(): Promise<ExcellenceCell[]> {
    const response = await apiClient.get('/api/v1/cells');
    const list = response.data.data || [];
    return list.map((c: any) => ({
      id: c._id,
      cellName: c.name,
      coordinatorName: c.facultySpocs?.[0]?.name || 'Dr. Alok Verma',
      domainFocus: c.researchDomain || c.theme || '',
      projectsCount: 0,
      studentCount: 0,
      researchAreas: c.description ? [c.description] : [],
      eventsCount: 0
    }));
  }

  public static async createCell(data: { name: string; theme: string; description: string; hostInstitutionId: string; researchDomain: string }): Promise<any> {
    const response = await apiClient.post('/api/v1/cells', data);
    return response.data.data;
  }
}
export default CellManagementService;
