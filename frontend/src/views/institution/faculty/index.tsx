'use client';

import React, { useEffect, useState } from 'react';
import { FacultyMember } from '@/types/institutionPortal';
import { FacultyService } from '@/services/facultyService';
import { GraduationCap, Search, Mail, ShieldAlert } from 'lucide-react';

export default function FacultyRegistry() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFaculty = async () => {
      setIsLoading(true);
      try {
        const data = await FacultyService.getFaculty();
        setFaculty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter(
    (f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Faculty Mentors</h1>
        <p className="text-sm text-zinc-500 font-medium">Manage research advisors, project coordinators, and student innovation guides</p>
      </div>

      {/* Search toolbar */}
      <div className="relative w-full">
        <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search faculty by name or department specialization..."
          className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-zinc-800"
        />
      </div>

      {/* Faculty grid cards */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFaculty.map((fac) => (
            <div
              key={fac.id}
              className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all text-left"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="leading-tight space-y-1">
                    <h4 className="text-sm font-extrabold text-zinc-900">{fac.name}</h4>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">{fac.department}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase tracking-wider ${
                      fac.role === 'COORDINATOR'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        : 'bg-zinc-50 text-zinc-655 border-zinc-150'
                    }`}
                  >
                    {fac.role}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 font-semibold leading-relaxed">
                  {fac.assignedCell && (
                    <p>
                      Cell Assignment: <span className="text-zinc-800 font-extrabold">{fac.assignedCell}</span>
                    </p>
                  )}
                  <p>
                    Students Mentored: <span className="text-zinc-800 font-extrabold">{fac.studentsMentoredCount}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" /> {fac.email}
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-zinc-50 pt-3">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Specializations</span>
                  <div className="flex flex-wrap gap-1">
                    {fac.researchInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wider"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
