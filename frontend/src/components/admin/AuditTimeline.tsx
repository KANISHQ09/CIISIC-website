import React from 'react';
import { AuditLogEntry } from '@/types/adminPortal';
import { ShieldCheck, Lock, Activity, Users, Settings } from 'lucide-react';

interface AuditTimelineProps {
  logs: AuditLogEntry[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs }) => {
  const getIcon = (cat: AuditLogEntry['category']) => {
    switch (cat) {
      case 'AUTH':
        return <Lock className="w-4 h-4 text-rose-600" />;
      case 'APPROVAL':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'SETTINGS':
        return <Settings className="w-4 h-4 text-amber-600" />;
      case 'ACCESS':
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm text-left select-none max-w-full">
      <div className="space-y-6 relative border-l-2 border-zinc-100 pl-4 ml-3">
        {logs.map((log) => (
          <div key={log.id} className="relative space-y-1">
            {/* Absolute floating icon */}
            <div className="absolute top-0.5 left-[-26px] w-6 h-6 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-sm">
              {getIcon(log.category)}
            </div>

            <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400">
              <span className="uppercase tracking-wider text-blue-600">{log.action}</span>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>

            <p className="text-xs font-bold text-zinc-900 leading-snug">{log.description}</p>
            <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-semibold pt-0.5">
              <span>IP: {log.ipAddress}</span>
              <span>•</span>
              <span>User: {log.userName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
