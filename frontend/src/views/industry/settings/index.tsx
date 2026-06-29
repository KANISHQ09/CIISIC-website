'use client';

import React, { useState } from 'react';
import { Settings, Shield, Key, Bell, CreditCard, Copy, Eye, EyeOff } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function IndustrySettings() {
  const { showToast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = 'sk_ciisic_live_a18fbc8d3129ef99cc';

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
      showToast('Password credentials updated successfully!', 'success');
    }, 1200);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    showToast('API Key copied to clipboard.', 'success');
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Settings</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Configure company preferences, coordinate API developer keys, and adjust security metrics
        </p>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Forms settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security details updates */}
          <form onSubmit={handleUpdatePassword} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Shield className="w-4.5 h-4.5 text-blue-600" /> Account Security
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
              className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none disabled:opacity-40"
            >
              {isUpdating ? 'Updating password...' : 'Update Password'}
            </button>
          </form>

          {/* Developers API keys settings */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Key className="w-4.5 h-4.5 text-blue-600" /> API Keys (Developer Console)
            </h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Use API credentials to integrate challenge registries directly with internal HR databases or applicant tracking systems.
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-between gap-4">
              <div className="font-mono text-xs select-text break-all">{showApiKey ? apiKey : '••••••••••••••••••••••••••••••••••••'}</div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 border border-zinc-200 hover:bg-white rounded-xl text-zinc-400 hover:text-zinc-700 transition-all focus:outline-none"
                >
                  {showApiKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
                <button
                  onClick={handleCopyKey}
                  className="p-2 border border-zinc-200 hover:bg-white rounded-xl text-zinc-400 hover:text-zinc-700 transition-all focus:outline-none"
                >
                  <Copy className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: notifications checkboxes */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Bell className="w-4.5 h-4.5 text-blue-600" /> Notifications
            </h3>

            <div className="space-y-4 text-xs font-bold text-zinc-700 text-left">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span>Email me on new solutions uploads</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span>Notify when solver revisions resubmitted</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span>Receive weekly analytics digest reports</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
