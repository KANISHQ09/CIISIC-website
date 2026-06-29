'use client';

import React, { useEffect, useState } from 'react';
import { Notification } from '@/types/studentPortal';
import { NotificationService } from '@/services/notificationService';
import { NotificationItem } from '@/components/student/NotificationItem';
import { ListSkeleton } from '@/components/student/Skeletons';
import { Bell, CheckCheck } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function NotificationsCenter() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    const success = await NotificationService.markAsRead(id);
    if (success) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      showToast('Notification marked as read.', 'success');
    }
  };

  const handleMarkAllRead = async () => {
    const success = await NotificationService.markAllAsRead();
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.', 'success');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 text-left pb-12 select-none max-w-xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight leading-tight">Notifications</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            {unreadCount} unread message{unreadCount !== 1 && 's'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="py-2 px-3 border border-zinc-200 hover:border-zinc-350 hover:bg-neutral-50 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <CheckCheck className="w-4 h-4 text-violet-600" /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <ListSkeleton key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <Bell className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">Clear Workspace</h3>
            <p className="text-xs text-zinc-400 font-medium">You don't have any system notifications at this moment.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}
