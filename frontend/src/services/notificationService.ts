import { apiClient } from './api/client';
import { Notification } from '@/types/studentPortal';

function mapNotification(n: any): Notification {
  return {
    id: n._id,
    title: n.title,
    content: n.content,
    type:
      n.category === 'MESSAGE'
        ? 'MESSAGE'
        : n.category === 'CHALLENGE'
          ? 'CHALLENGE'
          : n.category === 'PROPOSAL'
            ? 'PROPOSAL'
            : 'SYSTEM',
    date: n.createdAt,
    isRead: n.isRead
  };
}

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get('/api/v1/notifications');
    const list = response.data.data || [];
    return list.map(mapNotification);
  }

  static async markAsRead(id: string): Promise<void> {
    await apiClient.patch('/api/v1/notifications/read', { id });
  }

  static async markAllAsRead(): Promise<void> {
    await apiClient.patch('/api/v1/notifications/read');
  }

  static async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/api/v1/notifications');
    const list: any[] = response.data.data || [];
    return list.filter((n) => !n.isRead).length;
  }
}

export default NotificationService;
