import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';
import { sendResponse } from '../../shared/responses/response';
import { AuthenticationError } from '../../shared/errors/AppError';

export class MessageController {
  private readonly messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  public getOrCreateConversation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { participants, type, referenceId } = req.body;
      const conv = await this.messageService.getOrCreateConversation(
        participants,
        type,
        referenceId,
      );
      sendResponse({
        res,
        message: 'Conversation established successfully',
        data: conv,
      });
    } catch (error) {
      next(error);
    }
  };

  public getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messages = await this.messageService.getMessagesByConversation(
        req.query.conversationId as string,
      );
      sendResponse({
        res,
        message: 'Messages conversation thread retrieved',
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const senderId = (req as any).user?.id;
      if (!senderId) {
        throw new AuthenticationError('Not authenticated');
      }

      const { conversationId, content } = req.body;
      const message = await this.messageService.sendMessage(conversationId, senderId, content);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };
}
