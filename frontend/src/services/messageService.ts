import { apiClient } from './api/client';
import { Conversation, Message } from '@/types/studentPortal';

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    participantName: 'Dr. Vivek Mishra',
    participantAvatar: 'https://randomuser.me/api/portraits/men/82.jpg',
    participantRole: 'Academic Coordinator',
    online: true,
    unreadCount: 1,
    lastMessageText: 'The sensory testbed is ready. Please drop by the lab in the afternoon.',
    lastMessageTime: '10:45 AM'
  }
];

export class MessageService {
  static async getConversations(): Promise<Conversation[]> {
    try {
      // Stub conversation mapping
      return DEFAULT_CONVERSATIONS;
    } catch {
      return DEFAULT_CONVERSATIONS;
    }
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await apiClient.get('/api/v1/messages', { params: { conversationId } });
      const list = response.data.data || [];
      return list.map((m: any) => ({
        id: m._id,
        senderId: m.senderId,
        senderName: 'User Message Partner',
        text: m.content,
        createdAt: m.createdAt,
        isMe: true
      }));
    } catch {
      return [];
    }
  }

  static async sendMessage(conversationId: string, text: string, file?: { name: string; url: string }): Promise<Message> {
    const response = await apiClient.post('/api/v1/messages', {
      conversationId,
      content: text
    });
    const m = response.data.data;
    return {
      id: m._id,
      senderId: m.senderId,
      senderName: 'User Message Partner',
      text: m.content,
      createdAt: m.createdAt,
      isMe: true
    };
  }

  static async markConversationRead(conversationId: string): Promise<void> {
    // Stub
  }
}
export default MessageService;
