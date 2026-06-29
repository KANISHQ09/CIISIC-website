import { MessageRepository } from './message.repository';
import { IMessage } from '../../database/schemas/Message';
import { IConversation } from '../../database/schemas/Conversation';
import ConversationModel from '../../database/schemas/Conversation';
import { NotFoundError } from '../../shared/errors/AppError';

export class MessageService {
  private readonly messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  public async getOrCreateConversation(
    participants: string[],
    type: 'PROPOSAL' | 'CHALLENGE',
    referenceId?: string,
  ): Promise<IConversation> {
    let conv = await ConversationModel.findOne({
      participants: { $all: participants },
      type,
      referenceId,
    });

    if (!conv) {
      conv = await ConversationModel.create({
        participants,
        type,
        referenceId,
      });
    }

    return conv;
  }

  public async getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    const result = await this.messageRepository.paginate(
      { conversationId },
      { limit: 100, sort: { createdAt: 1 } },
    );
    return result.docs;
  }

  public async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<IMessage> {
    const conv = await ConversationModel.findById(conversationId);
    if (!conv) {
      throw new NotFoundError('Conversation not found');
    }

    return this.messageRepository.create({
      conversationId,
      senderId,
      content,
    });
  }
}
