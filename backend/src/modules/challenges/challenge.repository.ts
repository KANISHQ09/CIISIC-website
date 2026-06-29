import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { ChallengeModel, IChallenge } from '../../database/schemas/Challenge';

export class ChallengeRepository extends BaseRepository<IChallenge> {
  constructor() {
    super(ChallengeModel);
  }
}
