import { FacultyMember } from '@/types/institutionPortal';

export class FacultyService {
  private static STORAGE_KEY = 'ciisic_institution_faculty';

  public static async getFaculty(): Promise<FacultyMember[]> {
    if (typeof window === 'undefined') return this.getMockFaculty();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockFaculty();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private static getMockFaculty(): FacultyMember[] {
    return [
      {
        id: 'fac1',
        name: 'Dr. Alok Verma',
        role: 'COORDINATOR',
        department: 'Electronics & Comm. Engineering',
        assignedCell: 'Agritech Cell',
        researchInterests: ['IoT Sensor Meshes', 'Wireless Telemetry Systems', 'Microcontrollers'],
        studentsMentoredCount: 8,
        email: 'alok.verma@college.edu'
      },
      {
        id: 'fac2',
        name: 'Prof. Shruti Mishra',
        role: 'MENTOR',
        department: 'Chemical Engineering',
        assignedCell: 'Clean Energy Cell',
        researchInterests: ['Bio-fuel Kinetics', 'Fluid Thermodynamics', 'Industrial Catalyst'],
        studentsMentoredCount: 4,
        email: 'shruti.mishra@college.edu'
      },
      {
        id: 'fac3',
        name: 'Dr. Vivek Soni',
        role: 'FACULTY_MEMBER',
        department: 'Computer Science & Engineering',
        assignedCell: 'Smart Mobility Cell',
        researchInterests: ['Pre-emptive Edge Algorithms', 'Computer Vision ML', 'Battery State Models'],
        studentsMentoredCount: 12,
        email: 'vivek.soni@college.edu'
      }
    ];
  }
}
