import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  Building,
  Landmark,
  Layers,
  BookOpen,
  FileSpreadsheet,
  History,
  BarChart3,
  Globe,
  Lock,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const getMenuItems = () => {
    if (role === 'REVIEWER') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Assigned Reviews', path: '/proposals', icon: <FileSpreadsheet className="w-5 h-5" /> },
        { label: 'Evaluator Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> }
      ];
    }

    return [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'User Directory', path: '/users', icon: <Users2 className="w-5 h-5" /> },
      { label: 'Company Approvals', path: '/companies', icon: <Building className="w-5 h-5" /> },
      { label: 'Institutions Roster', path: '/institutions', icon: <Landmark className="w-5 h-5" /> },
      { label: 'Excellence Cells', path: '/cells', icon: <Layers className="w-5 h-5" /> },
      { label: 'Ecosystem Challenges', path: '/challenges', icon: <BookOpen className="w-5 h-5" /> },
      { label: 'Proposals Oversight', path: '/proposals', icon: <FileSpreadsheet className="w-5 h-5" /> },
      { label: 'Audit Timeline Logs', path: '/logs', icon: <History className="w-5 h-5" /> },
      { label: 'Platform Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" /> },
      { label: 'CMS Editor Console', path: '/cms', icon: <Globe className="w-5 h-5" /> },
      { label: 'RBAC Permission Matrix', path: '/permissions', icon: <Lock className="w-5 h-5" /> },
      { label: 'Global Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> }
    ];
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`h-screen bg-slate-950 text-slate-400 border-r border-slate-900 flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="space-y-6">
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-900">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-black">CII</span>
              </div>
              <span className="text-sm font-black text-white tracking-wider">
                CIISIC <span className="text-xs text-blue-400 font-bold">{role === 'REVIEWER' ? 'REVIEW' : 'ADMIN'}</span>
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto">
              <span className="text-white text-[10px] font-black">CII</span>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="px-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== '/proposals' && pathname.startsWith(`${item.path}/`)) ||
              (item.path === '/proposals' && pathname.startsWith('/proposals'));
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative cursor-pointer group ${
                  isActive
                    ? 'text-white bg-slate-900 border border-slate-800'
                    : 'hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
                {isActive && (
                  <motion.div
                    layoutId="activeAdminSideIndicator"
                    className="absolute left-1 w-1 h-5 rounded-full bg-blue-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-slate-900 space-y-3">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/30 border border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                AD
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-white max-w-[100px] truncate">{user?.name || 'Administrator'}</p>
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-450 shrink-0" />
                </div>
                <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-wider">
                  {role === 'REVIEWER' ? 'Reviewer' : 'Super Admin'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-slate-800 flex items-center justify-center font-bold text-xs mx-auto">
              AD
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-rose-400 transition-colors flex items-center justify-center mx-auto cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
