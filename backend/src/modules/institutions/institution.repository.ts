import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { InstitutionModel, IInstitution } from '../../database/schemas/Institution';

export class InstitutionRepository extends BaseRepository<IInstitution> {
  constructor() {
    super(InstitutionModel);
  }
}
