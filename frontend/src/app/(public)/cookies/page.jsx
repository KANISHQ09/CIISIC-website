'use client';

import React from 'react';

export default function CookiesPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Cookie Policy</h1>
        <p className="text-sm text-neutral-600 font-medium">Last updated: June 2026</p>
        <div className="prose text-xs text-neutral-600 leading-relaxed font-medium space-y-4 pt-4 border-t border-zinc-200">
          <p>
            We use cookies to improve your browsing experience on our platform, coordinate portal sessions, and protect authentication
            states. By using the CIISIC platform, you agree to our use of cookies.
          </p>
          <h3 className="text-sm font-bold text-neutral-900 pt-2">Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function correctly. They store authentication tokens (`ciisic_token`,
            `ciisic_refresh_token`) to secure portal access.
          </p>
          <h3 className="text-sm font-bold text-neutral-900 pt-2">Preference Cookies</h3>
          <p>
            These cookies allow our website to remember choices you make (such as UI preferences) to provide a more personalized experience.
          </p>
        </div>
      </div>
    </div>
  );
}
