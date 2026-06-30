import { apiClient } from './api/client';

export class SearchService {
  public static async search(query: string, type: 'challenges' | 'institutions' | 'companies' | 'all' = 'all'): Promise<any> {
    const response = await apiClient.get('/api/v1/search', {
      params: { query, type }
    });
    return response.data.data;
  }
}

export default SearchService;
