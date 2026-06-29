'use client';

import React, { useState, useEffect } from 'react';
import { AuditLogService } from '@/services/auditLogService';
import { AuditLogEntry } from '@/types/adminPortal';
import { AuditTimeline } from '@/components/admin/AuditTimeline';
import { Search, History, ShieldAlert } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuditLogService.getLogs().then((data) => {
      setLogs(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) || log.userName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">System Audit Log</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Immutable registry logging ecosystem interactions, settings modifications, and approvals
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-zinc-100 pb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action or administrator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-700 w-full sm:w-44 cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="AUTH">Authentication (AUTH)</option>
          <option value="APPROVAL">Approvals (APPROVAL)</option>
          <option value="SETTINGS">Settings (SETTINGS)</option>
          <option value="ACCESS">User Access (ACCESS)</option>
          <option value="SYSTEM">System Action (SYSTEM)</option>
        </select>
      </div>

      {/* Audit Timeline */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <AuditTimeline logs={filtered} />
      )}
    </div>
  );
}
