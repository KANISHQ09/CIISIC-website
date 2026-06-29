'use client';

import React, { useState } from 'react';
import { Search, Building, CheckCircle, XCircle } from 'lucide-react';
import useToast from '@/hooks/useToast';

interface CompanyRecord {
  id: string;
  name: string;
  domain: string;
  challengesCount: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export default function CompanyManagement() {
  const { showToast } = useToast();
  const [companies, setCompanies] = useState<CompanyRecord[]>([
    { id: 'c1', name: 'Netlink Technologies Ltd', domain: 'IoT & Telemetry Solutions', challengesCount: 4, verificationStatus: 'VERIFIED' },
    {
      id: 'c2',
      name: 'Tata Consultancy Services',
      domain: 'Cloud & System Integration',
      challengesCount: 0,
      verificationStatus: 'PENDING'
    },
    { id: 'c3', name: 'Eicher Motors Research', domain: 'Automotive Engineering R&D', challengesCount: 2, verificationStatus: 'VERIFIED' }
  ]);

  const handleVerify = (id: string, status: 'VERIFIED' | 'REJECTED') => {
    setCompanies(
      companies.map((c) => {
        if (c.id === id) {
          return { ...c, verificationStatus: status };
        }
        return c;
      })
    );
    showToast(`Company verification set to ${status}`, 'success');
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Company Registry</h1>
        <p className="text-sm text-zinc-500 font-medium">Verify industry corporate credentials and track innovation stats</p>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-4 px-6 text-left">Company Name</th>
              <th className="py-4 px-6 text-left border-l border-zinc-100">Industry Domain</th>
              <th className="py-4 px-6 text-center border-l border-zinc-100">Challenges Uploaded</th>
              <th className="py-4 px-6 text-center border-l border-zinc-100">Verification Status</th>
              <th className="py-4 px-6 text-center border-l border-zinc-100 w-36">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/40 transition-colors">
                <td className="py-4 px-6 text-left flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <Building className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-extrabold text-zinc-900">{c.name}</span>
                </td>
                <td className="py-4 px-6 text-left border-l border-zinc-100 font-bold text-zinc-500">{c.domain}</td>
                <td className="py-4 px-6 text-center border-l border-zinc-100 text-zinc-900 font-extrabold">{c.challengesCount}</td>
                <td className="py-4 px-6 text-center border-l border-zinc-100">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      c.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : c.verificationStatus === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                  >
                    {c.verificationStatus}
                  </span>
                </td>
                <td className="py-4 px-6 text-center border-l border-zinc-100">
                  {c.verificationStatus === 'PENDING' ? (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleVerify(c.id, 'VERIFIED')}
                        className="py-1 px-2.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(c.id, 'REJECTED')}
                        className="py-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
