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
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">{icon}</div>
      </div>

      <div className="mt-4 space-y-1 text-left">
        <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span className={trend.positive ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{trend.value}</span>
            <span className="text-zinc-400">from last month</span>
          </div>
        )}
        {description && !trend && <p className="text-xs text-zinc-400 font-medium">{description}</p>}
      </div>
    </motion.div>
  );
};
