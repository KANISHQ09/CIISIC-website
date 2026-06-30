import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Award,
  Bookmark,
  Trophy,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Library,
  HelpCircle
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
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { label: 'Challenges', path: '/challenges', icon: <Compass className="w-4.5 h-4.5" /> },
    { label: 'Bookmarks', path: '/bookmarks', icon: <Bookmark className="w-4.5 h-4.5" /> },
    { label: 'My Proposals', path: '/proposals', icon: <Award className="w-4.5 h-4.5" /> },
    { label: 'Messages', path: '/messages', icon: <MessageSquare className="w-4.5 h-4.5" /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-4.5 h-4.5" /> },
    { label: 'Achievements', path: '/achievements', icon: <Trophy className="w-4.5 h-4.5" /> },
    { label: 'Resources', path: '/resources', icon: <Library className="w-4.5 h-4.5" /> },
    { label: 'Help Center', path: '/faq', icon: <HelpCircle className="w-4.5 h-4.5" /> },
    { label: 'Profile', path: '/profile', icon: <User className="w-4.5 h-4.5" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4.5 h-4.5" /> }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <aside
      className={`h-[calc(100vh-2rem)] my-4 ml-4 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/80 rounded-3xl text-zinc-400 flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-900 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-black">CII</span>
              </div>
              <span className="text-sm font-black text-white tracking-wider">
                CIISIC <span className="text-xs text-violet-400 font-bold">PORTAL</span>
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto">
              <span className="text-white text-[10px] font-black">CII</span>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1.5 scrollbar-none pb-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative cursor-pointer group ${
                  isActive
                    ? 'text-white bg-zinc-900 border border-zinc-800'
                    : 'hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
                {isActive && (
                  <motion.div
                    layoutId="activeSideIndicator"
                    className="absolute left-1 w-1 h-5 rounded-full bg-violet-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-zinc-900 space-y-3">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/30 border border-zinc-900">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt="avatar"
                className="w-9 h-9 rounded-lg object-cover border border-zinc-800"
              />
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-white max-w-[100px] truncate">{user?.name || 'Student Innovator'}</p>
                <span className="text-[9px] text-violet-400 font-extrabold uppercase tracking-wider">Level 4</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <img
              src={user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt="avatar"
              className="w-9 h-9 rounded-lg object-cover border border-zinc-800 mx-auto"
            />
            <button
              type="button"
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors flex items-center justify-center mx-auto cursor-pointer"
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
