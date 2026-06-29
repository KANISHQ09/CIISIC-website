'use client';

import React, { useState } from 'react';
import { faqs } from '@/content/faqs';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [activeFaq, setActiveFaq] = (useState < number) | (null > null);

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12 text-left">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Help & Support</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Frequently Asked Questions</h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Review detailed criteria, timelines, and guidelines for the CIISIC platform.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4 pt-8 border-t border-zinc-200">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden transition-all shadow-xs">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-[#0F172A] focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4.5 h-4.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4.5 h-4.5 text-neutral-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-zinc-100 pt-3 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
