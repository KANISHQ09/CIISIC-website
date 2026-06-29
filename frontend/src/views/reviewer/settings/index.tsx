'use client';

import React, { useState } from 'react';
import { Shield, Bell, Check } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function ReviewerSettings() {
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !newPassword.trim()) return;

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setPassword('');
      setNewPassword('');
      showToast('Reviewer password credentials updated successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Reviewer Settings</h1>
        <p className="text-sm text-zinc-500 font-medium">Configure security keys and manage notification alerts</p>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdatePassword} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Shield className="w-4.5 h-4.5 text-indigo-650" /> Account Security
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">New Secure Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none disabled:opacity-40"
            >
              {isUpdating ? 'Updating password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Right side alert flags */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Bell className="w-4.5 h-4.5 text-indigo-650" /> Alerts & Notifications
            </h3>

            <div className="space-y-4 text-xs font-bold text-zinc-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-indigo-655 focus:ring-indigo-500" />
                <span>Notify me via email when new reviews are assigned</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-indigo-655 focus:ring-indigo-500" />
                <span>Weekly digests of my evaluations scores</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
