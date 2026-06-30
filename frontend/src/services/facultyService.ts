import { apiClient } from './api/client';
import { FacultyMember } from '@/types/institutionPortal';

export class FacultyService {
  public static async getFaculty(): Promise<FacultyMember[]> {
    const response = await apiClient.get('/api/v1/institutions/faculty');
    const list = response.data.data || [];
    return list.map((f: any) => ({
      id: f._id,
      name: f.name,
      role: f.role === 'INSTITUTION_SPOC' ? 'COORDINATOR' : 'MENTOR',
      department: f.department || 'Engineering',
      assignedCell: f.assignedCell || 'Excellence Cell',
      researchInterests: f.researchInterests || [],
      studentsMentoredCount: 0,
      email: f.email
    }));
  }
}
export default FacultyService;
