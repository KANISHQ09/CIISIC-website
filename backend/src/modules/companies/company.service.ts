import { CompanyRepository } from './company.repository';
import { ICompany } from '../../database/schemas/Company';
import { NotFoundError } from '../../shared/errors/AppError';

export class CompanyService {
  private readonly companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  public async getCompanies(filter: any = {}): Promise<ICompany[]> {
    const result = await this.companyRepository.paginate(filter, { limit: 100 });
    return result.docs;
  }

  public async getCompanyById(id: string): Promise<ICompany> {
    const comp = await this.companyRepository.findById(id);
    if (!comp) {
      throw new NotFoundError('Company profile not found');
    }
    return comp;
  }

  public async createCompany(data: any): Promise<ICompany> {
    return this.companyRepository.create(data);
  }

  public async updateCompany(id: string, data: any): Promise<ICompany> {
    const comp = await this.companyRepository.update(id, data);
    if (!comp) {
      throw new NotFoundError('Company profile not found');
    }
    return comp;
  }

  public async verifyCompany(id: string, status: 'VERIFIED' | 'REJECTED'): Promise<ICompany> {
    const comp = await this.companyRepository.update(id, { verificationStatus: status });
    if (!comp) {
      throw new NotFoundError('Company profile not found');
    }
    return comp;
  }
}
