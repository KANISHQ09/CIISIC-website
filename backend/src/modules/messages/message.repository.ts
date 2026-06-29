import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { MessageModel, IMessage } from '../../database/schemas/Message';

export class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(MessageModel);
  }
}
