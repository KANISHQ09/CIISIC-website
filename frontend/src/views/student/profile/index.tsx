'use client';

import React, { useEffect, useState } from 'react';
import { StudentProfile } from '@/types/studentPortal';
import { StudentService } from '@/services/studentService';
import { ProgressBar } from '@/components/student/ProgressBar';
import { GraduationCap, Building, Mail, Phone, Link as LinkIcon, MapPin, Calendar, CheckCircle, FileCheck } from 'lucide-react';
import useToast from '@/hooks/useToast';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function StudentProfileView() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const item = await StudentService.getProfile();
        setProfile(item);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Profile Header Banner */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-60 h-60 rounded-full bg-violet-600/5 blur-[80px]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <img
            src={profile.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
            alt="avatar"
            className="w-20 h-20 rounded-2xl object-cover border border-zinc-150 shadow-sm shrink-0"
          />
          <div className="text-left leading-tight space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">{profile.name}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider border border-emerald-100">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{profile.department || 'Innovation Hub'} Department</p>
            <div className="flex items-center gap-3 text-xs text-zinc-400 font-semibold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Bhopal, India
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Year {profile.yearOfStudy} (Accrued: {profile.points} XP)
              </span>
            </div>
          </div>
        </div>

        {/* Level metrics */}
        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 min-w-[200px] text-left space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
            <span>Profile Rating</span>
            <span className="text-violet-600 font-extrabold">Level {profile.level}</span>
          </div>
          <ProgressBar value={profile.completionPercentage} showLabel={false} />
          <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Endorsed by Excellence Cell</p>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: education, skills, resume */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Info */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Academic Credentials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <div className="flex gap-3">
                <Building className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Institution</span>
                  <span className="text-xs font-extrabold text-zinc-800">{profile.institutionName || 'Affiliated Institution'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <GraduationCap className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Academic Ref / Year</span>
                  <span className="text-xs font-extrabold text-zinc-800">Year {profile.yearOfStudy}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <GraduationCap className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Enrollment ID</span>
                  <span className="text-xs font-extrabold text-zinc-800">{profile.enrollmentNo || 'Pending Enrollment'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Student Email</span>
                  <span className="text-xs font-extrabold text-zinc-800">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Skills */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Skills & Frameworks</h2>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-2 bg-zinc-50 hover:bg-neutral-100 hover:border-zinc-350 border border-zinc-150 rounded-2xl text-xs font-bold text-zinc-700 cursor-default transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Endorsed Resume */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Verified Resume Uploader</h2>
            <div className="p-4 border border-zinc-150 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-extrabold text-zinc-800 truncate max-w-[180px]">
                    {profile.resumeName || profile.resumeUrl?.split('/').pop() || 'madhavan_resume.pdf'}
                  </p>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Endorsed PDF</span>
                </div>
              </div>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-[10px] font-bold transition-all cursor-pointer inline-block"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: social, actions */}
        <div className="space-y-6">
          {/* Social Coordinates */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">
              Social Coordinates
            </h3>
            <div className="space-y-4 text-left font-semibold text-xs text-zinc-700">
              <a
                href={profile.socialLinks?.github || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-violet-600 transition-colors"
              >
                <GithubIcon className="w-4.5 h-4.5 text-zinc-400" />
                <span>GitHub Portfolio</span>
              </a>
              <a
                href={profile.socialLinks?.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-violet-600 transition-colors"
              >
                <LinkedinIcon className="w-4.5 h-4.5 text-zinc-400" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>

          {/* Quick checklist */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Verification Steps</h3>
            <div className="space-y-3 text-left text-xs font-semibold text-zinc-600 leading-normal">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Academic registration ID verified</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Excellence Cell profile check</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Technical resume submitted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
