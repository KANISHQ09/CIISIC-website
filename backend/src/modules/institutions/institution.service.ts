import { InstitutionRepository } from './institution.repository';
import { IInstitution } from '../../database/schemas/Institution';
import { NotFoundError } from '../../shared/errors/AppError';

export class InstitutionService {
  private readonly institutionRepository: InstitutionRepository;

  constructor() {
    this.institutionRepository = new InstitutionRepository();
  }

  public async getInstitutions(filter: any = {}): Promise<IInstitution[]> {
    const result = await this.institutionRepository.paginate(filter, { limit: 100 });
    return result.docs;
  }

  public async getInstitutionById(id: string): Promise<IInstitution> {
    const inst = await this.institutionRepository.findById(id);
    if (!inst) {
      throw new NotFoundError('Institution profile not found');
    }
    return inst;
  }

  public async createInstitution(data: any): Promise<IInstitution> {
    return this.institutionRepository.create(data);
  }

  public async updateInstitution(id: string, data: any): Promise<IInstitution> {
    const inst = await this.institutionRepository.update(id, data);
    if (!inst) {
      throw new NotFoundError('Institution profile not found');
    }
    return inst;
  }

  public async verifyInstitution(
    id: string,
    status: 'VERIFIED' | 'SUSPENDED',
  ): Promise<IInstitution> {
    const inst = await this.institutionRepository.update(id, { verificationStatus: status });
    if (!inst) {
      throw new NotFoundError('Institution profile not found');
    }
    return inst;
  }
}
