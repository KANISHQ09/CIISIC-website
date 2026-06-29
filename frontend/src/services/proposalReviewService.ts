import { ProposalEvaluation, ShortlistCandidate } from '@/types/industryPortal';
import { Proposal } from '@/types/studentPortal';
import { ProposalService } from './proposalService';

export class ProposalReviewService {
  private static EVALUATIONS_KEY = 'ciisic_proposal_evaluations';
  private static SHORTLIST_KEY = 'ciisic_shortlisted_candidates';

  public static async getProposalsToReview(): Promise<Proposal[]> {
    return ProposalService.getProposals();
  }

  public static async getProposalById(id: string): Promise<Proposal | undefined> {
    return ProposalService.getProposalById(id);
  }

  public static async submitEvaluation(evalData: ProposalEvaluation): Promise<ProposalEvaluation> {
    if (typeof window === 'undefined') return evalData;

    // Save evaluation logs
    const saved = localStorage.getItem(this.EVALUATIONS_KEY);
    const evals = saved ? JSON.parse(saved) : [];
    evals.push(evalData);
    localStorage.setItem(this.EVALUATIONS_KEY, JSON.stringify(evals));

    // Update proposal status & review details
    const proposalsStr = localStorage.getItem('ciisic_proposals');
    if (proposalsStr) {
      const list: Proposal[] = JSON.parse(proposalsStr);
      const index = list.findIndex((p) => p.id === evalData.proposalId);
      if (index !== -1) {
        list[index].status = evalData.recommendation;
        list[index].feedback = evalData.comments;

        // Add evaluation comment logging
        list[index].comments.push({
          id: `comment-${Date.now()}`,
          authorName: evalData.evaluatedBy,
          authorRole: 'Industry Partner',
          content: `Evaluation completed. Technical Score: ${evalData.technicalScore}/10, Innovation Score: ${evalData.innovationScore}/10. Recommendation: ${evalData.recommendation}.`,
          createdAt: new Date().toISOString()
        });

        localStorage.setItem('ciisic_proposals', JSON.stringify(list));
      }
    }

    // Add to shortlist if accepted / highly scored
    if (evalData.recommendation === 'APPROVE' || evalData.totalScore >= 7.5) {
      await this.addToShortlist(evalData.proposalId, evalData.totalScore);
    }

    return evalData;
  }

  public static async getShortlist(): Promise<ShortlistCandidate[]> {
    if (typeof window === 'undefined') return this.getMockShortlist();

    const saved = localStorage.getItem(this.SHORTLIST_KEY);
    if (saved) return JSON.parse(saved);

    const initial = this.getMockShortlist();
    localStorage.setItem(this.SHORTLIST_KEY, JSON.stringify(initial));
    return initial;
  }

  public static async addToShortlist(proposalId: string, score: number): Promise<void> {
    const proposal = await this.getProposalById(proposalId);
    if (!proposal) return;

    const list = await this.getShortlist();
    if (list.some((item) => item.proposalId === proposalId)) return;

    const newShortlist: ShortlistCandidate = {
      studentId: proposal.studentId || 'student-1',
      studentName: proposal.studentName,
      major: 'Computer Science',
      college: 'LNCT Bhopal',
      cgpa: 8.8,
      skills: ['React', 'TypeScript', 'Node.js'],
      achievementsCount: 3,
      proposalScore: score,
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      resumeUrl: proposal.fileUrl,
      githubUrl: 'https://github.com/student',
      portfolioUrl: 'https://portfolio.me'
    };

    list.push(newShortlist);
    localStorage.setItem(this.SHORTLIST_KEY, JSON.stringify(list));
  }

  public static async removeFromShortlist(proposalId: string): Promise<boolean> {
    const list = await this.getShortlist();
    const filtered = list.filter((item) => item.proposalId !== proposalId);
    localStorage.setItem(this.SHORTLIST_KEY, JSON.stringify(filtered));
    return true;
  }

  private static getMockShortlist(): ShortlistCandidate[] {
    return [
      {
        studentId: 'stud1',
        studentName: 'Madhavan Singh',
        major: 'Electronics & Communication',
        college: 'LNCT Bhopal',
        cgpa: 9.1,
        skills: ['Embedded C', 'Raspberry Pi', 'LoRaWAN', 'Python'],
        achievementsCount: 5,
        proposalScore: 9.0,
        proposalId: 'pr1',
        proposalTitle: 'Smart Hydration IoT Controller Framework',
        resumeUrl: '#',
        githubUrl: 'https://github.com/madhavansingh',
        portfolioUrl: 'https://madhavan.dev'
      },
      {
        studentId: 'stud2',
        studentName: 'Ayush Sharma',
        major: 'Chemical Engineering',
        college: 'SATI Vidisha',
        cgpa: 8.6,
        skills: ['MATLAB', 'ASPEN Viscosity', 'Fluid Mechanics'],
        achievementsCount: 2,
        proposalScore: 8.2,
        proposalId: 'pr2',
        proposalTitle: 'Catalyst Suspension Sedimentation Preventer',
        resumeUrl: '#',
        githubUrl: 'https://github.com/ayush',
        portfolioUrl: 'https://ayush.me'
      }
    ];
  }
}
