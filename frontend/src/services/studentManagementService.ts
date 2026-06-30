import { apiClient } from './api/client';
import { StudentAcademicRecord, VerificationStatus } from '@/types/institutionPortal';

export class StudentManagementService {
  public static async getStudents(): Promise<StudentAcademicRecord[]> {
    const response = await apiClient.get('/api/v1/institutions/students');
    const list = response.data.data || [];
    return list.map((s: any) => ({
      id: s.id,
      name: s.name,
      department: s.department,
      year: s.yearOfStudy,
      cgpa: 0, // Not exposed publicly for privacy
      skills: [],
      email: s.email,
      registrationNumber: s.enrollmentNo,
      verificationStatus: s.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      projects: [],
      participationHistory: []
    }));
  }

  public static async getStudentById(id: string): Promise<StudentAcademicRecord | undefined> {
    const list = await this.getStudents();
    return list.find((s) => s.id === id);
  }

  public static async verifyStudent(id: string, status: VerificationStatus): Promise<StudentAcademicRecord | null> {
    const response = await apiClient.patch(`/api/v1/institutions/students/${id}/verify`, { status });
    const s = response.data.data;
    if (!s) return null;
    return {
      id: s.id,
      name: s.name,
      department: s.department,
      year: s.yearOfStudy,
      cgpa: 0,
      skills: [],
      email: s.email,
      registrationNumber: s.enrollmentNo,
      verificationStatus: s.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      projects: [],
      participationHistory: []
    };
  }
}
export default StudentManagementService;
