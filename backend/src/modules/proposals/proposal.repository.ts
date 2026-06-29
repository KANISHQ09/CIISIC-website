import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { ProposalModel, IProposal } from '../../database/schemas/Proposal';

export class ProposalRepository extends BaseRepository<IProposal> {
  constructor() {
    super(ProposalModel);
  }
}
