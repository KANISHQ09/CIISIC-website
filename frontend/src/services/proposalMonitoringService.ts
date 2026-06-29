import { Proposal } from '@/types/studentPortal';
import { ProposalService } from './proposalService';

export class ProposalMonitoringService {
  public static async getInstitutionProposals(): Promise<Proposal[]> {
    // Return all proposals submitted within the student ecosystem database
    return ProposalService.getProposals();
  }

  public static async getProposalById(id: string): Promise<Proposal | undefined> {
    return ProposalService.getProposalById(id);
  }
}
