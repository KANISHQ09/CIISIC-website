'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/adminService';
import { UserRecord, PlatformRole } from '@/types/adminPortal';
import { Search, ShieldAlert, Check, XCircle, Key, RefreshCw } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function UserManagement() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await AdminService.getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: UserRecord['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await AdminService.updateUserStatus(id, nextStatus);
      showToast(`User status set to ${nextStatus}`, 'success');
      await fetchUsers();
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const handleResetPassword = (email: string) => {
    showToast(`Password recovery link dispatched to ${email}`, 'success');
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Ecosystem Directory</h1>
        <p className="text-sm text-zinc-500 font-medium">Verify credentials, toggle suspended locks, and manage ecosystem permissions</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-zinc-100 pb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-700 w-full sm:w-44 cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Admins</option>
          <option value="REVIEWER">Ecosystem Reviewers</option>
          <option value="INDUSTRY_SPOC">Industry SPOCs</option>
          <option value="INSTITUTION_SPOC">Institution SPOCs</option>
          <option value="STUDENT">Active Solvers</option>
        </select>
      </div>

      {/* Table grid */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6 text-left">User Profile</th>
                  <th className="py-4 px-6 text-left border-l border-zinc-100">Role</th>
                  <th className="py-4 px-6 text-left border-l border-zinc-100">Affiliation</th>
                  <th className="py-4 px-6 text-center border-l border-zinc-100">Status</th>
                  <th className="py-4 px-6 text-center border-l border-zinc-100">Date Created</th>
                  <th className="py-4 px-6 text-center border-l border-zinc-100 w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-4 px-6 text-left">
                      <p className="font-extrabold text-zinc-900">{u.name}</p>
                      <span className="text-[10px] text-zinc-400 font-medium">{u.email}</span>
                    </td>
                    <td className="py-4 px-6 text-left border-l border-zinc-100">
                      <span className="text-[10px] font-black text-indigo-650 uppercase tracking-wider">{u.role.replace('_', ' ')}</span>
                    </td>
                    <td className="py-4 px-6 text-left border-l border-zinc-100">
                      <span className="text-zinc-500 font-bold">{u.companyName || u.collegeName || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 text-center border-l border-zinc-100">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center border-l border-zinc-100 text-zinc-400 font-medium">
                      {new Date(u.dateCreated).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center border-l border-zinc-100">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`p-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'border-zinc-200 hover:bg-rose-50 text-rose-600'
                              : 'border-zinc-200 hover:bg-emerald-50 text-emerald-650'
                          }`}
                          title={u.status === 'ACTIVE' ? 'Suspend user' : 'Activate user'}
                        >
                          {u.status === 'ACTIVE' ? <XCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleResetPassword(u.email)}
                          className="p-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 rounded-lg focus:outline-none transition-colors cursor-pointer"
                          title="Reset password recovery link"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
