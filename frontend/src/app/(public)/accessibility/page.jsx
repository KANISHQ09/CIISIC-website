'use client';

import React from 'react';

export default function AccessibilityPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Accessibility Statement</h1>
        <p className="text-sm text-neutral-600 font-medium">Last updated: June 2026</p>
        <div className="prose text-xs text-neutral-600 leading-relaxed font-medium space-y-4 pt-4 border-t border-zinc-200">
          <p>
            CIISIC is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user
            experience for everyone, and applying the relevant accessibility standards.
          </p>
          <h3 className="text-sm font-bold text-neutral-900 pt-2">Conformance Status</h3>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for
            people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. CIISIC is partially
            conformant with WCAG 2.1 level AA.
          </p>
          <h3 className="text-sm font-bold text-neutral-900 pt-2">Feedback</h3>
          <p>
            We welcome your feedback on the accessibility of CIISIC. Please let us know if you encounter accessibility barriers by emailing
            support@ciisic.in.
          </p>
        </div>
      </div>
    </div>
  );
}
