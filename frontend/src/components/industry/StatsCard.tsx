import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, description, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl border border-zinc-150 shadow-sm flex flex-col justify-between h-full hover:border-blue-300 transition-all group text-left relative overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all" />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      <div className="mt-4 space-y-1 relative z-10">
        <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className={trend.positive ? 'text-emerald-600' : 'text-rose-600'}>{trend.value}</span>
            <span className="text-zinc-400 font-medium">from last month</span>
          </div>
        )}
        {description && !trend && <p className="text-xs text-zinc-400 font-medium">{description}</p>}
      </div>
    </motion.div>
  );
};
