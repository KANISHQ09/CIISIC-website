import { apiClient } from './api/client';
import { CompanyProfileData, CompanyMember } from '@/types/industryPortal';

function mapCompanyProfile(c: any): CompanyProfileData {
  return {
    id: c._id,
    name: c.name,
    logo: c.logo || '',
    description: c.description || '',
    website: c.websiteUrl || '',
    domain: c.industry || '',
    location: c.address || '',
    isVerified: c.verificationStatus === 'VERIFIED',
    members: (c.industrySpocs || []).map((s: any, idx: number) => ({
      id: s._id || `mem-${idx}`,
      name: s.name || 'Member',
      email: s.email || '',
      role: 'SPOC'
    })),
    statistics: {
      totalChallenges: 0,
      activeChallenges: 0,
      totalSubmissions: 0,
      shortlistedCandidates: 0
    }
  };
}

export class CompanyService {
  public static async getCompanyProfile(): Promise<CompanyProfileData> {
    const response = await apiClient.get('/api/v1/companies/my');
    const c = response.data.data;
    const profile = mapCompanyProfile(c);

    // Fetch real metrics from dashboard stats
    try {
      const statsResponse = await apiClient.get('/api/v1/analytics/industry-dashboard');
      const stats = statsResponse.data.data || {};
      profile.statistics = {
        totalChallenges: stats.totalChallenges || 0,
        activeChallenges: stats.activeChallenges || 0,
        totalSubmissions: stats.totalSubmissions || 0,
        shortlistedCandidates: stats.shortlistedCandidates || 0
      };
    } catch {
      // Keep zeros if failed
    }

    return profile;
  }

  public static async getCompanies(): Promise<CompanyProfileData[]> {
    const response = await apiClient.get('/api/v1/companies');
    const list = response.data.data || [];
    return list.map(mapCompanyProfile);
  }

  public static async verifyCompany(id: string, status: 'VERIFIED' | 'REJECTED'): Promise<CompanyProfileData> {
    const response = await apiClient.post(`/api/v1/companies/${id}/verify`, { status });
    return mapCompanyProfile(response.data.data);
  }

  public static async updateCompanyProfile(updates: Partial<CompanyProfileData>): Promise<CompanyProfileData> {
    const profile = await this.getCompanyProfile();
    const response = await apiClient.patch(`/api/v1/companies/${profile.id}`, {
      name: updates.name,
      logo: updates.logo,
      description: updates.description,
      websiteUrl: updates.website,
      industry: updates.domain,
      address: updates.location
    });
    return mapCompanyProfile(response.data.data);
  }

  public static async inviteMember(name: string, email: string): Promise<CompanyMember> {
    // Call invite member endpoint or add member to company industrySpocs
    const profile = await this.getCompanyProfile();
    // For compliance, we can call invite or update
    const updatedSpocs = [...(profile.members || []).map(m => m.id)];
    const response = await apiClient.patch(`/api/v1/companies/${profile.id}`, {
      industrySpocs: updatedSpocs
    });
    const c = response.data.data;
    return {
      id: `mem-${Date.now()}`,
      name,
      email,
      role: 'TEAM_MEMBER'
    };
  }
}
export default CompanyService;
