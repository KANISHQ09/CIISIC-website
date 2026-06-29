import { ChallengeManagement, ChallengeDraft } from '@/types/industryPortal';

export class ChallengeManagementService {
  private static STORAGE_KEY = 'ciisic_industry_challenges';

  public static async getChallenges(): Promise<ChallengeManagement[]> {
    if (typeof window === 'undefined') return this.getMockChallenges();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockChallenges();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async getChallengeById(id: string): Promise<ChallengeManagement | undefined> {
    const list = await this.getChallenges();
    return list.find((c) => c.id === id);
  }

  public static async createChallenge(draft: ChallengeDraft): Promise<ChallengeManagement> {
    const list = await this.getChallenges();
    const newChallenge: ChallengeManagement = {
      id: draft.id || `CH-${Math.floor(100 + Math.random() * 900)}`,
      title: draft.title,
      category: draft.category,
      companyName: 'Netlink Technologies Ltd',
      status: draft.status || 'PUBLISHED',
      dateCreated: new Date().toISOString(),
      submissionsCount: 0,
      pendingCount: 0,
      difficulty: 'MEDIUM'
    };

    list.unshift(newChallenge);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));

    // Sync with student portal challenges
    const studentChallenges = localStorage.getItem('ciisic_challenges');
    if (studentChallenges) {
      const parsed = JSON.parse(studentChallenges);
      parsed.unshift({
        id: newChallenge.id,
        title: newChallenge.title,
        category: newChallenge.category,
        companyName: newChallenge.companyName,
        difficulty: newChallenge.difficulty,
        status: newChallenge.status,
        description: draft.problemStatement,
        requirements: draft.requirements,
        skillsRequired: draft.techStack,
        deliverables: draft.deliverables,
        timeline: draft.timeline,
        deadline: new Date(draft.timeline.submissionDeadline).toLocaleDateString()
      });
      localStorage.setItem('ciisic_challenges', JSON.stringify(parsed));
    }

    return newChallenge;
  }

  public static async updateChallenge(id: string, updates: Partial<ChallengeManagement>): Promise<ChallengeManagement | null> {
    const list = await this.getChallenges();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return list[index];
  }

  public static async duplicateChallenge(id: string): Promise<ChallengeManagement | null> {
    const item = await this.getChallengeById(id);
    if (!item) return null;

    const list = await this.getChallenges();
    const duplicated: ChallengeManagement = {
      ...item,
      id: `CH-${Math.floor(100 + Math.random() * 900)}`,
      title: `${item.title} (Copy)`,
      status: 'DRAFT',
      dateCreated: new Date().toISOString(),
      submissionsCount: 0,
      pendingCount: 0
    };

    list.unshift(duplicated);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return duplicated;
  }

  public static async deleteChallenge(id: string): Promise<boolean> {
    const list = await this.getChallenges();
    const nextList = list.filter((c) => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nextList));
    return true;
  }

  private static getMockChallenges(): ChallengeManagement[] {
    return [
      {
        id: 'ch1',
        title: 'IoT Soil Moisture Telemetry Optimizations',
        category: 'Agritech & Bio-Sciences',
        companyName: 'Netlink Technologies Ltd',
        status: 'PUBLISHED',
        dateCreated: '2026-06-01T10:00:00Z',
        submissionsCount: 14,
        pendingCount: 6,
        difficulty: 'MEDIUM'
      },
      {
        id: 'ch2',
        title: 'Bio-Fuel Catalyst Viscosity Enhancement',
        category: 'Clean Energy',
        companyName: 'Netlink Technologies Ltd',
        status: 'PUBLISHED',
        dateCreated: '2026-06-05T10:00:00Z',
        submissionsCount: 8,
        pendingCount: 3,
        difficulty: 'HARD'
      },
      {
        id: 'ch3',
        title: 'Cloud Billing Tenant Multi-Region Isolation',
        category: 'Cloud Engineering',
        companyName: 'Netlink Technologies Ltd',
        status: 'DRAFT',
        dateCreated: '2026-06-25T10:00:00Z',
        submissionsCount: 0,
        pendingCount: 0,
        difficulty: 'HARD'
      },
      {
        id: 'ch4',
        title: 'Legacy Cobol Parsing Engine Modernizer',
        category: 'Software Architecture',
        companyName: 'Netlink Technologies Ltd',
        status: 'CLOSED',
        dateCreated: '2026-05-10T10:00:00Z',
        submissionsCount: 22,
        pendingCount: 0,
        difficulty: 'HARD'
      }
    ];
  }
}
