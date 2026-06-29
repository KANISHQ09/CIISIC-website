export class InstitutionService {
  private static STORAGE_KEY = 'ciisic_institution_stats';

  public static async getDashboardStats() {
    if (typeof window === 'undefined') return this.getMockData();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initialData = this.getMockData();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  private static getMockData() {
    return {
      totalStudents: 1450,
      verifiedStudents: 1210,
      activeChallenges: 18,
      participationRate: 74,
      proposalStatus: {
        submitted: 42,
        underReview: 18,
        accepted: 12,
        revisionRequested: 6
      },
      announcements: [
        {
          id: 'ann1',
          title: 'CII Madhya Pradesh hackathon entry active',
          desc: 'Excellence Cell members must register telemetry briefs by next week.',
          date: '2026-06-28'
        },
        {
          id: 'ann2',
          title: 'Bio-Sciences research funds sanctioned',
          desc: 'Agritech Cell received Rs. 2.5 Lakhs prototype sanction letter.',
          date: '2026-06-25'
        }
      ]
    };
  }
}
