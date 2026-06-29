'use client';

import React, { useState } from 'react';
import { cells } from '@/content/cells';
import { Briefcase, ArrowUpRight, Filter, Search } from 'lucide-react';
import Link from 'next/link';

const mockChallenges = [
  {
    id: "CH-101",
    title: "IoT Soil Moisture Telemetry Optimizations",
    category: "Agritech & Bio-Sciences",
    companyName: "Netlink Technologies Ltd",
    cellTheme: "agritech",
    skills: ["Raspberry Pi", "LoRaWAN", "Python", "MQTT"],
    reward: "Paid Internship & Prototyping Grant",
    status: "ACTIVE"
  },
  {
    id: "CH-102",
    title: "Bio-Fuel Catalyst Viscosity Enhancement",
    category: "Clean Energy",
    companyName: "Dilip Buildcon Energy",
    cellTheme: "energy",
    skills: ["Chemical Engineering", "Catalysis", "Viscosity Mapping"],
    reward: "Direct Placement Key Offer",
    status: "ACTIVE"
  },
  {
    id: "CH-103",
    title: "EV Thermal Runaway Pre-Emptive Alarm Loop",
    category: "Automotive & Smart mobility",
    companyName: "Som Distilleries & R&D Labs",
    cellTheme: "automotive",
    skills: ["Battery Management Systems", "Arduino", "SolidWorks"],
    reward: "National Grand Challenge Nominee",
    status: "ACTIVE"
  },
  {
    id: "CH-104",
    title: "AI Crop Health Diagnostic Computer Vision",
    category: "Agritech & Bio-Sciences",
    companyName: "Vardhman Yarns R&D",
    cellTheme: "agritech",
    skills: ["PyTorch", "OpenCV", "TensorFlow", "React Native"],
    reward: "Corporate Sponsorship & Incubation",
    status: "ACTIVE"
  }
];

export default function ChallengesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCell, setSelectedCell] = useState('all');

  const filteredChallenges = mockChallenges.filter(ch => {
    const matchesSearch = ch.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ch.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCell = selectedCell === 'all' || ch.cellTheme === selectedCell;
    return matchesSearch && matchesCell;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 text-left">
        
        {/* Page Title */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Cooperation Registry</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Industrial Challenges
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Review active problem statements filed by Madhya Pradesh corporate partners.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-zinc-200 py-6">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by company or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4.5 h-4.5 text-zinc-500" />
            <select
              value={selectedCell}
              onChange={(e) => setSelectedCell(e.target.value)}
              className="px-4 py-3 border border-zinc-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all w-full md:w-auto"
            >
              <option value="all">All Domains</option>
              {Object.values(cells).map(cell => (
                <option key={cell.theme} value={cell.theme.toLowerCase()}>
                  {cell.theme} Cell
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredChallenges.map((ch) => (
            <div 
              key={ch.id}
              className="bg-white border border-zinc-200 rounded-[32px] p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[300px] text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-0.5 rounded-full bg-blue-50 text-[9px] font-bold uppercase tracking-wider text-blue-900 border border-blue-200">
                    {ch.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">{ch.id}</span>
                </div>
                
                <h4 className="text-base font-bold text-[#0F172A] group-hover:text-blue-900 transition-colors">
                  {ch.title}
                </h4>
                
                <p className="text-xs text-neutral-500 font-semibold">{ch.companyName}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {ch.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 bg-neutral-100 rounded text-[9px] font-bold text-neutral-600 border border-zinc-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200/60 mt-6 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase">Compensation / Reward</span>
                  <p className="text-xs text-neutral-700 font-bold">{ch.reward}</p>
                </div>
                <Link href={`/challenges/${ch.id.toLowerCase()}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F294A] hover:text-blue-700">
                  <span>View challenge</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
