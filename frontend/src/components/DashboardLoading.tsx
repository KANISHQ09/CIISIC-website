import React from 'react';

export const DashboardLoading: React.FC = () => {
  return (
    <div className="h-screen w-screen flex bg-zinc-50 overflow-hidden font-sans select-none">
      {/* Sidebar Skeleton */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-900 flex flex-col justify-between p-6 shrink-0 h-full">
        <div className="space-y-8 animate-pulse">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-zinc-800 rounded" />
              <div className="h-3 w-16 bg-zinc-800 rounded" />
            </div>
          </div>
          {/* Navigation Items Skeletons */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-5 h-5 rounded bg-zinc-800" />
                <div className="h-3.5 w-32 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Footer info skeleton */}
        <div className="h-3.5 w-24 bg-zinc-800 rounded animate-pulse" />
      </aside>

      {/* Main Workspace Skeleton */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Skeleton */}
        <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-8 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-16 bg-zinc-200 rounded" />
            <div className="h-3.5 w-4 bg-zinc-150 rounded" />
            <div className="h-3.5 w-24 bg-zinc-200 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-48 bg-zinc-100 rounded-xl hidden sm:block" />
            <div className="w-8 h-8 rounded-xl bg-zinc-200" />
            <div className="w-8 h-8 rounded-lg bg-zinc-200" />
          </div>
        </header>

        {/* Content Area with Spinner and Skeleton Cards */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6 relative">
          {/* Centered Floating Spinner Card */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center z-10 transition-all duration-300">
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center">
              <div className="w-10 h-10 rounded-full border-4 border-zinc-100 border-t-violet-600 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900">Loading your workspace...</p>
                <p className="text-[10px] text-zinc-400 font-semibold tracking-wide">Syncing secure credentials</p>
              </div>
            </div>
          </div>

          {/* Background Pulsing Cards to Prevent White Screen Flash */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="md:col-span-2 bg-zinc-200/60 rounded-3xl p-8 h-48" />
            <div className="bg-zinc-200/40 rounded-3xl p-8 h-48" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-150/40 rounded-2xl p-6 h-24" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 bg-zinc-200/40 rounded-3xl p-6 h-64" />
            <div className="bg-zinc-200/40 rounded-3xl p-6 h-64" />
          </div>
        </main>
      </div>
    </div>
  );
};
