import { apiClient } from './api/client';
import { Conversation, Message } from '@/types/studentPortal';

export class MessageService {
  static async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get('/api/v1/messages/conversations');
    const list = response.data.data || [];
    return list.map((c: any) => {
      const other = c.participants?.[0] || {};
      return {
        id: c._id,
        participantName: other.name || 'Platform User',
        participantAvatar: other.avatar || '',
        participantRole: other.role === 'STUDENT' ? 'Student Innovator' : (other.role || 'Coordinator'),
        online: false,
        unreadCount: c.unreadCount || 0,
        lastMessageText: c.lastMessage?.content || '',
        lastMessageTime: c.updatedAt
          ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : ''
      };
    });
  }

  static async getMessages(conversationId: string, currentUserId?: string): Promise<Message[]> {
    const response = await apiClient.get('/api/v1/messages', { params: { conversationId } });
    const list = response.data.data || [];
    return list.map((m: any) => ({
      id: m._id,
      senderId: m.senderId?._id || m.senderId,
      senderName: m.senderId?.name || '',
      text: m.content,
      createdAt: m.createdAt,
      isMe: currentUserId
        ? (m.senderId?._id || m.senderId) === currentUserId
        : false
    }));
  }

  static async sendMessage(conversationId: string, text: string, file?: { name: string; url: string }): Promise<Message> {
    const payload: any = { conversationId, content: text };
    if (file) {
      payload.attachments = [{ fileName: file.name, fileUrl: file.url }];
    }
    const response = await apiClient.post('/api/v1/messages', payload);
    const m = response.data.data;
    return {
      id: m._id,
      senderId: m.senderId?._id || m.senderId,
      senderName: m.senderId?.name || '',
      text: m.content,
      createdAt: m.createdAt,
      isMe: true
    };
  }

  static async markConversationRead(conversationId: string): Promise<void> {
    await apiClient.patch(`/api/v1/messages/conversations/${conversationId}/read`);
  }

  static async createConversation(participantId: string): Promise<Conversation> {
    const response = await apiClient.post('/api/v1/messages/conversations', { participantId });
    const c = response.data.data;
    const other = c.participants?.[0] || {};
    return {
      id: c._id,
      participantName: other.name || 'Platform User',
      participantAvatar: other.avatar || '',
      participantRole: other.role || '',
      online: false,
      unreadCount: 0,
      lastMessageText: '',
      lastMessageTime: ''
    };
  }
}

export default MessageService;
