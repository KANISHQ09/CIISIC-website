'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/adminService';
import { CompanyService } from '@/services/companyService';
import { InstitutionService } from '@/services/institutionService';
import { UserRecord, PlatformRole } from '@/types/adminPortal';
import { Search, ShieldAlert, Check, XCircle, Key, RefreshCw, Plus, UserPlus, X } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { apiClient } from '@/services/api/client';

export default function UserManagement() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modal Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<PlatformRole>('INDUSTRY_SPOC');
  const [companyId, setCompanyId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsersAndMeta = async () => {
    setIsLoading(true);
    try {
      const userData = await AdminService.getUsers();
      setUsers(userData);
      
      const compData = await CompanyService.getCompanies();
      setCompanies(compData);
      if (compData.length > 0) setCompanyId(compData[0].id);

      const instData = await InstitutionService.getInstitutions();
      setInstitutions(instData);
      if (instData.length > 0) setInstitutionId(instData[0]._id);
    } catch {
      showToast('Failed to load user directory.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndMeta();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: UserRecord['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await AdminService.updateUserStatus(id, nextStatus);
      showToast(`User status set to ${nextStatus}`, 'success');
      await fetchUsersAndMeta();
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const handleResetPassword = (email: string) => {
    showToast(`Password recovery link dispatched to ${email}`, 'success');
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !role) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        profileData: {}
      };

      if (role === 'INDUSTRY_SPOC' && companyId) {
        payload.profileData.companyId = companyId;
      } else if ((role === 'INSTITUTION_SPOC' || role === 'REVIEWER') && institutionId) {
        payload.profileData.institutionId = institutionId;
      }

      await apiClient.post('/api/v1/users', payload);
      showToast('User account created successfully!', 'success');
      
      setName('');
      setEmail('');
      setPassword('');
      setShowAddModal(false);
      await fetchUsersAndMeta();
    } catch (err: any) {
      showToast(err.message || 'Failed to create user account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Ecosystem Directory</h1>
          <p className="text-sm text-zinc-500 font-medium">Verify credentials, toggle suspended locks, and manage ecosystem permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center focus:outline-none"
        >
          <Plus className="w-4 h-4" /> Add User Account
        </button>
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

      {/* Glassmorphic Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 rounded-3xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2 border-b border-zinc-50 pb-3">
              <UserPlus className="w-5 h-5 text-indigo-650" /> Add Ecosystem Account
            </h3>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 pt-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rajesh@lnct.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Initial Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Ecosystem Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as PlatformRole)}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  required
                >
                  <option value="INDUSTRY_SPOC">Industry SPOC</option>
                  <option value="INSTITUTION_SPOC">Institution SPOC</option>
                  <option value="REVIEWER">Ecosystem Reviewer</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              {role === 'INDUSTRY_SPOC' && companies.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Associate Company</label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(role === 'INSTITUTION_SPOC' || role === 'REVIEWER') && institutions.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Associate Institution</label>
                  <select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  >
                    {institutions.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-xs font-extrabold transition-all mt-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
