import { IndustryDashboardData } from '@/types/industryPortal';

export class IndustryService {
  private static STORAGE_KEY = 'ciisic_industry_stats';

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
      totalChallenges: 4,
      activeChallenges: 2,
      totalSubmissions: 28,
      pendingReviews: 12,
      shortlistedCandidates: 6,
      metrics: {
        proposalAcceptanceRate: 65,
        avgTechnicalScore: 7.8,
        activeSectors: ['Agritech', 'Clean Energy', 'Automotive']
      },
      recentActivity: [
        {
          id: 'act1',
          type: 'SUBMISSION',
          title: 'New Proposal Uploaded',
          desc: 'An anonymous candidate submitted a solution for moisture telemetry.',
          time: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'act2',
          type: 'VERIFICATION',
          title: 'Proposal Verified by College',
          desc: 'LNCT Coordinator approved a smart mobility submission.',
          time: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'act3',
          type: 'REVISION',
          title: 'Revision Resubmitted',
          desc: 'Student uploaded revised brief version for bio-fuel sedimentations.',
          time: new Date(Date.now() - 14400000).toISOString()
        }
      ]
    };
  }
}
