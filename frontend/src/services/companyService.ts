import { CompanyProfileData, CompanyMember } from '@/types/industryPortal';

export class CompanyService {
  private static STORAGE_KEY = 'ciisic_company_profile';

  public static async getCompanyProfile(): Promise<CompanyProfileData> {
    if (typeof window === 'undefined') return this.getMockProfile();

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockProfile();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async updateCompanyProfile(updates: Partial<CompanyProfileData>): Promise<CompanyProfileData> {
    const profile = await this.getCompanyProfile();
    const updated = { ...profile, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  public static async inviteMember(name: string, email: string): Promise<CompanyMember> {
    const profile = await this.getCompanyProfile();
    const newMember: CompanyMember = {
      id: `mem-${Date.now()}`,
      name,
      email,
      role: 'TEAM_MEMBER'
    };

    profile.members.push(newMember);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    return newMember;
  }

  private static getMockProfile(): CompanyProfileData {
    return {
      id: 'netlink-id',
      name: 'Netlink Technologies Ltd',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60',
      description:
        'Netlink is an enterprise software development leader and IT infrastructure consulting firm based out of Bhopal, specializing in IoT edge meshes and low-code applications architectures.',
      website: 'https://netlink.com',
      domain: 'Information Technology & Cloud Services',
      location: 'Mandideep Industrial Area, Bhopal, MP',
      isVerified: true,
      members: [
        { id: 'mem1', name: 'Amit Saxena', email: 'spoc@netlink.com', role: 'SPOC' },
        { id: 'mem2', name: 'Shreya Ghoshal', email: 'shreya@netlink.com', role: 'TEAM_MEMBER' }
      ],
      statistics: {
        totalChallenges: 4,
        activeChallenges: 2,
        totalSubmissions: 28,
        shortlistedCandidates: 2
      }
    };
  }
}
