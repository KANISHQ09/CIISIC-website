'use client';

import React, { useState } from 'react';
import { Shield, Key, Database, RefreshCw, Sparkles } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('ciisic_live_8a92b10492e8172c9182310b');
  const [maintenance, setMaintenance] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setApiKey(`ciisic_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`);
      setIsGenerating(false);
      showToast('Ecosystem API Key regenerated successfully!', 'success');
    }, 1000);
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      showToast('Database JSON backup archive saved to storage bucket.', 'success');
    }, 1500);
  };

  const handleMaintenanceToggle = () => {
    const nextState = !maintenance;
    setMaintenance(nextState);
    showToast(nextState ? 'Maintenance mode enabled for public pages.' : 'Maintenance mode disabled.', 'info');
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Global Configurations</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Verify system parameters, manage developer API keys, and trigger database backups
        </p>
      </div>

      {/* Settings blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* API credentials block */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Key className="w-4.5 h-4.5 text-indigo-650" /> System Integration Keys
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Developer Public API Access Key</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 px-3 py-2.5 border border-zinc-200 bg-zinc-50 rounded-xl text-xs font-mono focus:outline-none text-zinc-800"
                />
                <button
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                  className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Backup block */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Database className="w-4.5 h-4.5 text-indigo-650" /> Ecosystem Data Backups
            </h3>
            <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
              Export and dump all local storage mock records, challenge briefs, and solver verification profiles.
            </p>
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="py-2.5 px-5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />{' '}
              {isBackingUp ? 'Archiving files...' : 'Trigger Ecosystem Backup'}
            </button>
          </div>
        </div>

        {/* Maintenance side switcher */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Shield className="w-4.5 h-4.5 text-indigo-650" /> Operations Mode
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-zinc-700">Maintenance Lock</span>
                <p className="text-[10px] text-zinc-400 font-medium">Bypass client registration access</p>
              </div>
              <button
                onClick={handleMaintenanceToggle}
                className={`py-1.5 px-3 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer border ${
                  maintenance ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {maintenance ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
