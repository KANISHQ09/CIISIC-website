import { CMSContentData } from '@/types/adminPortal';

export class CMSService {
  private static STORAGE_KEY = 'ciisic_cms_contents';

  public static async getCMSContent(): Promise<CMSContentData[]> {
    if (typeof window === 'undefined') return this.getMockCMS();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockCMS();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async updateCMSContent(id: string, updates: Partial<CMSContentData>): Promise<CMSContentData | null> {
    const list = await this.getCMSContent();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      lastUpdatedBy: 'Global Administrator',
      lastUpdatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    return list[index];
  }

  private static getMockCMS(): CMSContentData[] {
    return [
      {
        id: 'cms1',
        category: 'LANDING',
        key: 'hero_title',
        title: 'Landing Page Hero Headline',
        content: 'Connecting Innovation, Academia, and Industry Across Madhya Pradesh',
        lastUpdatedBy: 'Global Administrator',
        lastUpdatedAt: '2026-06-25T10:00:00Z'
      },
      {
        id: 'cms2',
        category: 'FAQ',
        key: 'participation_rules',
        title: 'FAQ: How can colleges participate?',
        content:
          'Institutions can register via their designated coordinator SPOC to assign Excellence Cells and assign faculty advisors to active student groups.',
        lastUpdatedBy: 'Global Administrator',
        lastUpdatedAt: '2026-06-25T10:05:00Z'
      }
    ];
  }
}
