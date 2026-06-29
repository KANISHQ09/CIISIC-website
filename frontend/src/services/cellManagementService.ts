import { ExcellenceCell } from '@/types/institutionPortal';

export class CellManagementService {
  private static STORAGE_KEY = 'ciisic_institution_cells';

  public static async getCells(): Promise<ExcellenceCell[]> {
    if (typeof window === 'undefined') return this.getMockCells();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockCells();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private static getMockCells(): ExcellenceCell[] {
    return [
      {
        id: 'cell1',
        cellName: 'Agritech Cell',
        coordinatorName: 'Dr. Alok Verma',
        domainFocus: 'Agricultural IoT & Edge Telemetry',
        projectsCount: 14,
        studentCount: 85,
        researchAreas: ['Soil moisture sensors', 'LoRaWAN networks', 'Automated drip triggers'],
        eventsCount: 4
      },
      {
        id: 'cell2',
        cellName: 'Clean Energy Cell',
        coordinatorName: 'Prof. Shruti Mishra',
        domainFocus: 'Bio-Sciences & Biofuel kinetics',
        projectsCount: 8,
        studentCount: 42,
        researchAreas: ['Catalyst suspension dynamics', 'Biofuel viscosity formulas'],
        eventsCount: 2
      },
      {
        id: 'cell3',
        cellName: 'Smart Mobility Cell',
        coordinatorName: 'Dr. Vivek Soni',
        domainFocus: 'BMS Edge firmware & Thermal controls',
        projectsCount: 12,
        studentCount: 64,
        researchAreas: ['Pre-emptive lithium runaway warnings', 'ANSYS temperature models'],
        eventsCount: 3
      }
    ];
  }
}
