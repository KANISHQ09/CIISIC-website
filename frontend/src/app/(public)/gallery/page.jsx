'use client';

import React from 'react';
import Image from 'next/image';

const galleryImages = [
  { src: '/assets/images/cells/1.jpg', title: 'IT & Digital Infrastructure Cell', host: 'LNCT University' },
  { src: '/assets/images/cells/2.jpg', title: 'Agritech & Bio-Sciences Cell', host: 'Aurobindo University' },
  { src: '/assets/images/cells/3.jpg', title: 'Clean Energy & Bio-fuels Cell', host: 'IPS Academy' },
  { src: '/assets/images/cells/4.jpg', title: 'Automotive & Smart Mobility Cell', host: 'SGSITS College' },
  { src: '/assets/images/cells/5.jpg', title: 'Aerosports & Drone Tech Cell', host: 'MITS Gwalior' },
  { src: '/assets/images/cells/6.jpg', title: 'Earth Sciences & Geo-informatics Cell', host: 'Vikram University' },
  { src: '/assets/images/cells/7.jpg', title: 'Industrial Safety & Logistics Cell', host: 'Medicaps University' }
];

export default function GalleryPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 text-left">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Ecosystem Roster</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Excellence Cell Gallery
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Visual highlights from collaborating University Chapters and active R&D Labs.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-zinc-200">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <Image 
                  src={img.src} 
                  alt={img.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-2 text-left">
                <span className="text-[9px] text-[#0F294A] font-extrabold uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {img.host}
                </span>
                <h4 className="text-xs font-bold text-neutral-900 leading-snug">
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
