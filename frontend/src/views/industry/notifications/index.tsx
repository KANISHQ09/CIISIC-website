'use client';

import React, { useState } from 'react';
import { Bell, Inbox, ShieldCheck, Mail, RefreshCw, Archive, Check } from 'lucide-react';
import useToast from '@/hooks/useToast';

interface NotificationAlert {
  id: string;
  type: 'SUBMISSION' | 'REVISION' | 'SYSTEM';
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
}

export default function IndustryNotifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: 'n1',
      type: 'SUBMISSION',
      title: 'New Student Proposal Uploaded',
      desc: 'Anonymous Candidate C481 submitted schematic designs for Soil moisture telemetry optimizer.',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: 'n2',
      type: 'REVISION',
      title: 'Solver Revision Resubmitted',
      desc: 'Candidate D982 uploaded updated viscosity spreadsheet calculations for Bio-Fuel Viscosity.',
      time: '3 hours ago',
      isRead: false
    },
    {
      id: 'n3',
      type: 'SYSTEM',
      title: 'Corporate Account Verified',
      desc: 'CII Administration checked and verified Netlink Technologies corporate SPOC profile.',
      time: '1 day ago',
      isRead: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    showToast('All alerts marked as read.', 'success');
  };

  const handleArchive = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    showToast('Alert archived successfully.', 'info');
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Notifications Log</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Keep track of student activity, submission timestamps, and system review notifications
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleMarkAllRead}
            className="py-2 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <Inbox className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">Inbox Cleared</h3>
            <p className="text-xs text-zinc-400 font-medium">No new corporate notifications at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm divide-y divide-zinc-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 text-left transition-colors ${!n.isRead ? 'bg-blue-50/15' : ''}`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 flex items-center justify-center shrink-0 mt-0.5">
                  {n.type === 'SUBMISSION' && <Mail className="w-5 h-5 text-blue-600" />}
                  {n.type === 'REVISION' && <RefreshCw className="w-5 h-5 text-amber-600" />}
                  {n.type === 'SYSTEM' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-zinc-900 text-sm leading-tight">{n.title}</p>
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{n.desc}</p>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block pt-0.5">{n.time}</span>
                </div>
              </div>

              <button
                onClick={() => handleArchive(n.id)}
                className="p-2 border border-zinc-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-xl transition-colors focus:outline-none"
                title="Archive notification"
              >
                <Archive className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
