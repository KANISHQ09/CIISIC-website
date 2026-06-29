import { StudentAcademicRecord, VerificationStatus } from '@/types/institutionPortal';

export class StudentManagementService {
  private static STORAGE_KEY = 'ciisic_institution_students';

  public static async getStudents(): Promise<StudentAcademicRecord[]> {
    if (typeof window === 'undefined') return this.getMockStudents();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockStudents();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async getStudentById(id: string): Promise<StudentAcademicRecord | undefined> {
    const list = await this.getStudents();
    return list.find((s) => s.id === id);
  }

  public static async verifyStudent(id: string, status: VerificationStatus): Promise<StudentAcademicRecord | null> {
    const list = await this.getStudents();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return null;

    list[index].verificationStatus = status;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return list[index];
  }

  private static getMockStudents(): StudentAcademicRecord[] {
    return [
      {
        id: 'stud-101',
        name: 'Madhavan Singh',
        department: 'Electronics & Communication',
        year: 4,
        cgpa: 9.1,
        skills: ['Embedded C', 'LoRaWAN', 'Python', 'Raspberry Pi'],
        email: 'madhavan.singh@college.edu',
        registrationNumber: 'LNCT-EC-2022-0941',
        verificationStatus: 'VERIFIED',
        projects: [
          {
            title: 'IoT Soil Moisture Sensor Edge Node',
            description: 'Built an edge telemetry nodule reporting humidity patterns over MQTT queue links.'
          }
        ],
        participationHistory: [{ challengeTitle: 'IoT Soil Moisture Telemetry Optimizations', status: 'SUBMITTED', date: '2026-06-15' }]
      },
      {
        id: 'stud-102',
        name: 'Ayush Sharma',
        department: 'Chemical Engineering',
        year: 4,
        cgpa: 8.6,
        skills: ['Fluid Kinetics', 'ASPEN Viscosity', 'MATLAB'],
        email: 'ayush.sharma@college.edu',
        registrationNumber: 'LNCT-CH-2022-0312',
        verificationStatus: 'VERIFIED',
        projects: [
          {
            title: 'Viscosity Stabilizer Catalyst Formulation',
            description: 'Tested surfactant sediment coefficients on standard biofuel viscosity levels.'
          }
        ],
        participationHistory: [{ challengeTitle: 'Bio-Fuel Catalyst Viscosity Enhancement', status: 'UNDER_REVIEW', date: '2026-06-18' }]
      },
      {
        id: 'stud-103',
        name: 'Rohan Deshmukh',
        department: 'Computer Science',
        year: 3,
        cgpa: 8.9,
        skills: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
        email: 'rohan.d@college.edu',
        registrationNumber: 'LNCT-CS-2023-0104',
        verificationStatus: 'PENDING',
        projects: [
          { title: 'Decentralized Exam Authenticator Mesh', description: 'A local peer ledger verifying examination hall tickets offline.' }
        ],
        participationHistory: []
      }
    ];
  }
}
