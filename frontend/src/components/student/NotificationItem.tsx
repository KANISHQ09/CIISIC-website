import React from 'react';
import { Notification } from '@/types/studentPortal';
import { Bell, MessageSquare, Award, BookOpen, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'CHALLENGE':
        return <BookOpen className="w-4 h-4 text-violet-600" />;
      case 'PROPOSAL':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-600" />;
    }
  };

  const getIconBg = () => {
    switch (notification.type) {
      case 'CHALLENGE':
        return 'bg-violet-50 border-violet-100';
      case 'PROPOSAL':
        return 'bg-emerald-50 border-emerald-100';
      case 'MESSAGE':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-amber-50 border-amber-100';
    }
  };

  const timeAgo = (isoStr: string) => {
    const diffMs = Date.now() - new Date(isoStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-2xl border transition-all flex items-start gap-4 select-none ${
        notification.isRead
          ? 'bg-white border-zinc-100 hover:border-zinc-200'
          : 'bg-violet-50/10 border-violet-100 hover:bg-violet-50/20 shadow-sm'
      }`}
    >
      {/* Icon Badge */}
      <div className={`w-9.5 h-9.5 rounded-xl border flex items-center justify-center shrink-0 ${getIconBg()}`}>{getIcon()}</div>

      {/* Info */}
      <div className="flex-1 space-y-1 text-left">
        <div className="flex items-start justify-between gap-4">
          <h4
            className={`text-sm tracking-tight leading-snug ${notification.isRead ? 'font-semibold text-zinc-800' : 'font-extrabold text-zinc-950'}`}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-zinc-400 font-bold shrink-0">{timeAgo(notification.date)}</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{notification.content}</p>
      </div>

      {/* Actions */}
      {!notification.isRead && onMarkRead && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          className="p-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 focus:outline-none cursor-pointer"
          title="Mark as read"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
};
