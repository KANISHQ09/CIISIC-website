'use client';

import React, { useEffect, useState } from 'react';
import { StudentProfile } from '@/types/studentPortal';
import { StudentService } from '@/services/studentService';
import { Settings, Save, Lock, Bell, CheckCircle } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function StudentSettings() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Notification Prefs
  const [emailOnComment, setEmailOnComment] = useState(true);
  const [emailOnDeadline, setEmailOnDeadline] = useState(true);

  // Password Fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const item = await StudentService.getProfile();
        setProfile(item);
        if (item) {
          setName(item.name);
          setEmail(item.email);
          setGithubUrl(item.socialLinks?.github || '');
          setLinkedinUrl(item.socialLinks?.linkedin || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const updated = await StudentService.updateProfile({
        name,
        email,
        socialLinks: {
          github: githubUrl,
          linkedin: linkedinUrl
        }
      });
      if (updated) {
        setProfile(updated);
        showToast('Profile configuration updated!', 'success');
      }
    } catch {
      showToast('Failed to update profile settings', 'error');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      showToast('Please specify both current and new password.', 'error');
      return;
    }

    // Mock change password success
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      showToast('Account password changed successfully!', 'success');
    }, 1000);
  };

  if (isLoading || !profile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight leading-tight">Settings</h1>
        <p className="text-xs text-zinc-500 font-medium">Manage notifications, credentials coordinates, and account preferences</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
          <Settings className="w-4 h-4 text-violet-600" /> Account Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">Student Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">GitHub Profile URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Profile coordinates
        </button>
      </form>

      {/* Notification Prefs */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
          <Bell className="w-4 h-4 text-violet-600" /> Notifications Settings
        </h3>

        <div className="space-y-4 text-left">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailOnComment}
              onChange={(e) => setEmailOnComment(e.target.checked)}
              className="w-4 h-4 text-violet-600 rounded border-zinc-200 focus:ring-violet-500"
            />
            <div className="leading-tight">
              <p className="text-xs font-bold text-zinc-800">Email alerts on Review comments</p>
              <span className="text-[10px] text-zinc-400 font-medium">
                Receive direct alerts when academic/industry reviews comment on proposal.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailOnDeadline}
              onChange={(e) => setEmailOnDeadline(e.target.checked)}
              className="w-4 h-4 text-violet-600 rounded border-zinc-200 focus:ring-violet-500"
            />
            <div className="leading-tight">
              <p className="text-xs font-bold text-zinc-800">Deadline reminders</p>
              <span className="text-[10px] text-zinc-400 font-medium">
                Receive alert reminders 48 hours before challenge submissions close.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={handleChangePassword} className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
          <Lock className="w-4 h-4 text-violet-600" /> Security Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Lock className="w-4 h-4" /> Change Account Password
        </button>
      </form>
    </div>
  );
}
