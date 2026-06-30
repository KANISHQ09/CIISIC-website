import { apiClient } from './api/client';
import { StudentProfile, Badge, LeaderboardEntry } from '@/types/studentPortal';

function mapProfile(u: any): StudentProfile {
  const p = u.profileData || {};
  return {
    name: u.name,
    email: u.email,
    avatar: u.avatar || '',
    role: u.role,
    skills: p.skills || [],
    projects: p.projects || [],
    education: p.education || [],
    resumeUrl: p.resumeUrl || '',
    resumeName: p.resumeName || '',
    portfolioUrl: p.portfolioUrl || '',
    socialLinks: p.socialLinks || { github: '', linkedin: '', twitter: '' },
    completionPercentage: p.completionPercentage || 0,
    points: p.points || 0,
    level: p.level || 1,
    rank: p.rank || 0,
    enrollmentNo: p.enrollmentNo || '',
    department: p.department || '',
    yearOfStudy: p.yearOfStudy || 1,
    institutionName: p.institutionId?.name || ''
  };
}

export class StudentService {
  static async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get('/api/v1/profile');
    return mapProfile(response.data.data);
  }

  static async updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
    const payload = {
      name: profile.name,
      profileData: {
        skills: profile.skills,
        projects: profile.projects,
        education: profile.education,
        resumeUrl: profile.resumeUrl,
        resumeName: profile.resumeName,
        portfolioUrl: profile.portfolioUrl,
        socialLinks: profile.socialLinks,
        completionPercentage: profile.completionPercentage,
        points: profile.points,
        level: profile.level,
        rank: profile.rank
      }
    };
    const response = await apiClient.patch('/api/v1/profile', payload);
    return mapProfile(response.data.data);
  }

  static async getBadges(): Promise<Badge[]> {
    const response = await apiClient.get('/api/v1/analytics/badges');
    const list: any[] = response.data.data || [];
    return list.map((b: any) => ({
      id: b._id || b.id,
      title: b.title,
      description: b.description,
      icon: b.icon || '🏅',
      unlockedAt: b.unlockedAt || b.createdAt
    }));
  }

  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get('/api/v1/analytics/leaderboard');
    const list: any[] = response.data.data || [];
    return list.map((entry: any) => ({
      rank: entry.rank,
      name: entry.name,
      institution: entry.institution || '',
      points: entry.points,
      avatar: entry.avatar || '',
      isMe: entry.isMe || false
    }));
  }

  static async getDashboardStats() {
    const response = await apiClient.get('/api/v1/analytics/dashboard');
    return response.data.data;
  }
}

export default StudentService;
