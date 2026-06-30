import { apiClient } from './api/client';
import { CMSContentData } from '@/types/adminPortal';

export class CMSService {
  public static async getCMSContent(): Promise<CMSContentData[]> {
    // We can load specific pages or slug contents dynamically. Let's fetch landing page slug.
    try {
      const response = await apiClient.get('/api/v1/platform/cms/landing');
      const page = response.data.data;
      if (!page) return [];
      // Map properties to CMSContentData array format
      return [
        {
          id: page._id,
          category: 'LANDING',
          key: 'hero_title',
          title: page.title || 'Landing Hero',
          content: page.content || '',
          lastUpdatedBy: page.updatedBy || 'System',
          lastUpdatedAt: page.updatedAt
        }
      ];
    } catch {
      return [];
    }
  }

  public static async updateCMSContent(id: string, updates: Partial<CMSContentData>): Promise<CMSContentData | null> {
    const response = await apiClient.post('/api/v1/platform/cms/landing', {
      title: updates.title,
      content: updates.content,
      isPublished: true
    });
    const page = response.data.data;
    if (!page) return null;
    return {
      id: page._id,
      category: 'LANDING',
      key: 'hero_title',
      title: page.title,
      content: page.content,
      lastUpdatedBy: page.updatedBy || 'System',
      lastUpdatedAt: page.updatedAt
    };
  }
}
export default CMSService;
