'use client';

import React, { useState, useEffect } from 'react';
import { CompanyProfileData } from '@/types/industryPortal';
import { CompanyService } from '@/services/companyService';
import { ShieldCheck, Plus, Globe, MapPin, Building, Users } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function CompanyProfile() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Invite state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Edit fields
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await CompanyService.getCompanyProfile();
      setProfile(data);
      setDescription(data.description);
      setWebsite(data.website);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await CompanyService.updateCompanyProfile({ description, website });
      showToast('Company profile details updated successfully!', 'success');
      await fetchProfile();
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await CompanyService.inviteMember(inviteName.trim(), inviteEmail.trim());
      showToast(`Invited ${inviteName} successfully!`, 'success');
      setInviteName('');
      setInviteEmail('');
      await fetchProfile();
    } catch {
      showToast('Failed to invite member', 'error');
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Company Profile</h1>
        <p className="text-sm text-zinc-500 font-medium">Coordinate corporate coordinates details and manage organization members list</p>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Profile form details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xl shrink-0 border border-zinc-150">
              N
            </div>
            <div className="text-left space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-zinc-900 leading-none">{profile.name}</h2>
                {profile.isVerified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
              </div>
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">{profile.domain}</span>
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-bold pt-1">
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-zinc-400" /> {profile.website}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-zinc-400" /> Bhopal, MP
                </span>
              </div>
            </div>
          </div>

          {/* Details Form */}
          <form onSubmit={handleUpdate} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-blue-600" /> Corporate Credentials
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Company Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Company Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-4 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold text-zinc-800"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none disabled:opacity-40"
            >
              {isUpdating ? 'Saving details...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Right side: Org members */}
        <div className="space-y-6">
          {/* Org members card list */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
              <Users className="w-4.5 h-4.5 text-blue-600" /> Members ({profile.members.length})
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {profile.members.map((mem) => (
                <div key={mem.id} className="text-left leading-tight py-2 border-b border-zinc-50 last:border-0">
                  <p className="text-xs font-extrabold text-zinc-800">{mem.name}</p>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold mt-0.5">
                    <span>{mem.email}</span>
                    <span className="text-blue-600 uppercase tracking-wider">{mem.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite members form */}
            <form onSubmit={handleInvite} className="space-y-3 pt-3 border-t border-zinc-100">
              <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Invite Team Member</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-850"
                  required
                />
                <input
                  type="email"
                  placeholder="Corporate Email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-850"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isInviting}
                className="w-full py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" /> Invite Member
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
