import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { ReviewModel, IReview } from '../../database/schemas/Review';

export class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(ReviewModel);
  }

  public async findByProposal(proposalId: string): Promise<IReview[]> {
    return this.model.find({ proposalId, isDeleted: { $ne: true } }).exec();
  }
}
