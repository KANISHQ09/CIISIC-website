import { UserRecord, SystemHealthStatus } from '@/types/adminPortal';

export class AdminService {
  private static USERS_KEY = 'ciisic_admin_users';

  public static async getDashboardStats() {
    return {
      totalStudents: 1450,
      totalInstitutions: 42,
      totalCompanies: 28,
      totalReviewers: 15,
      activeChallenges: 18,
      pendingApprovals: 8,
      liveApplications: 45,
      systemHealth: [
        { service: 'Express MERN API API', status: 'OPERATIONAL', latencyMs: 24 },
        { service: 'MongoDB Database Server', status: 'OPERATIONAL', latencyMs: 5 },
        { service: 'Next.js App Server', status: 'OPERATIONAL', latencyMs: 12 }
      ] as SystemHealthStatus[]
    };
  }

  public static async getUsers(): Promise<UserRecord[]> {
    if (typeof window === 'undefined') return this.getMockUsers();

    const saved = localStorage.getItem(this.USERS_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockUsers();
    localStorage.setItem(this.USERS_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async updateUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<UserRecord | null> {
    const list = await this.getUsers();
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) return null;

    list[index].status = status;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(list));
    return list[index];
  }

  private static getMockUsers(): UserRecord[] {
    return [
      {
        id: 'usr1',
        name: 'Madhavan Singh',
        email: 'madhavan.singh@college.edu',
        role: 'STUDENT',
        status: 'ACTIVE',
        collegeName: 'LNCT Bhopal',
        dateCreated: '2026-06-01T10:00:00Z'
      },
      {
        id: 'usr2',
        name: 'Amit Saxena',
        email: 'spoc@netlink.com',
        role: 'INDUSTRY_SPOC',
        status: 'ACTIVE',
        companyName: 'Netlink Technologies Ltd',
        dateCreated: '2026-06-02T10:00:00Z'
      },
      {
        id: 'usr3',
        name: 'Dr. Alok Verma',
        email: 'alok.verma@college.edu',
        role: 'INSTITUTION_SPOC',
        status: 'ACTIVE',
        collegeName: 'LNCT Bhopal',
        dateCreated: '2026-06-03T10:00:00Z'
      },
      {
        id: 'usr4',
        name: 'Dr. Ramesh R&D',
        email: 'ramesh.review@ciisic.in',
        role: 'REVIEWER',
        status: 'ACTIVE',
        dateCreated: '2026-06-04T10:00:00Z'
      },
      {
        id: 'usr5',
        name: 'Global Administrator',
        email: 'superadmin@ciisic.in',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        dateCreated: '2026-06-01T09:00:00Z'
      }
    ];
  }
}
