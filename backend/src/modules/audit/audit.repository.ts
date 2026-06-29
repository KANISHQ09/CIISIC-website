import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { AuditLogModel, IAuditLog } from '../../database/schemas/AuditLog';

export class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLogModel);
  }
}
