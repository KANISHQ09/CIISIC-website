import { apiClient } from './api/client';
import { Notification } from '@/types/studentPortal';

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Comment on Proposal',
    content:
      'Amit Saxena (TATA AgriTech Solutions SPOC) posted a comment requesting database blueprints on "Smart Crop Scheduling & Soil Sensors IoT Hub".',
    type: 'MESSAGE',
    date: new Date(Date.now() - 3600000).toISOString(),
    isRead: false
  }
];

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get('/api/v1/notifications');
      const list = response.data.data || [];
      return list.map((n: any) => ({
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
      }));
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  static async markAsRead(id: string): Promise<Notification[]> {
    try {
      await apiClient.patch('/api/v1/notifications/read', { id });
      return this.getNotifications();
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  static async markAllAsRead(): Promise<Notification[]> {
    try {
      await apiClient.patch('/api/v1/notifications/read');
      return this.getNotifications();
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  static async getUnreadCount(): Promise<number> {
    try {
      const list = await this.getNotifications();
      return list.filter((n) => !n.isRead).length;
    } catch {
      return 1;
    }
  }
}
export default NotificationService;
