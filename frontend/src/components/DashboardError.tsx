import React from 'react';

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-white border border-zinc-150 rounded-3xl p-8 max-w-sm shadow-xl space-y-6">
        {/* Error icon circle */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-zinc-900">Ecosystem Connection Issue</h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">{message}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};
