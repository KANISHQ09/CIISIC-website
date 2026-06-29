import { CellRepository } from './cell.repository';
import { IExcellenceCell } from '../../database/schemas/ExcellenceCell';
import { NotFoundError } from '../../shared/errors/AppError';

export class CellService {
  private readonly cellRepository: CellRepository;

  constructor() {
    this.cellRepository = new CellRepository();
  }

  public async getAllCells(): Promise<IExcellenceCell[]> {
    const result = await this.cellRepository.paginate({ status: 'ACTIVE' }, { limit: 100 });
    return result.docs;
  }

  public async getCellById(id: string): Promise<IExcellenceCell> {
    const cell = await this.cellRepository.findById(id);
    if (!cell) {
      throw new NotFoundError('Excellence Cell not found');
    }
    return cell;
  }

  public async createCell(data: any): Promise<IExcellenceCell> {
    return this.cellRepository.create(data);
  }

  public async updateCell(id: string, data: any): Promise<IExcellenceCell> {
    const cell = await this.cellRepository.update(id, data);
    if (!cell) {
      throw new NotFoundError('Excellence Cell not found');
    }
    return cell;
  }

  public async deleteCell(id: string): Promise<boolean> {
    return this.cellRepository.softDelete(id);
  }
}
