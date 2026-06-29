export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export const stats: StatItem[] = [
  { id: 'stat-1', label: 'Active Industry Challenges', value: 40, suffix: '+' },
  { id: 'stat-2', label: 'Participating Organizations', value: 37, suffix: '+' },
  { id: 'stat-3', label: 'Verified Student Submissions', value: 340, suffix: '+' },
  { id: 'stat-4', label: 'Academic Hours Logged', value: 1200, suffix: '+' }
];
export default stats;
