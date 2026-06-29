import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { ExcellenceCellModel, IExcellenceCell } from '../../database/schemas/ExcellenceCell';

export class CellRepository extends BaseRepository<IExcellenceCell> {
  constructor() {
    super(ExcellenceCellModel);
  }
}
