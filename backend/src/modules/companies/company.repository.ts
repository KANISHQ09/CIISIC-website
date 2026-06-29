import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { CompanyModel, ICompany } from '../../database/schemas/Company';

export class CompanyRepository extends BaseRepository<ICompany> {
  constructor() {
    super(CompanyModel);
  }
}
