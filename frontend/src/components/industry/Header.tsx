import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Dashboard', path: '/dashboard' }];

    return paths.map((path, index) => {
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      const url = '/' + paths.slice(0, index + 1).join('/');
      return { label, path: url };
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const breadcrumbs = getBreadcrumbs();
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'AS';

  return (
    <header className="h-16 sticky top-0 bg-white/85 backdrop-blur-md border-b border-zinc-150 flex items-center justify-between px-6 z-20 select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
        <span className="hover:text-zinc-700 transition-colors cursor-pointer" onClick={() => router.push('/dashboard')}>
          Corporate Console
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
        {breadcrumbs.map((bc, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={bc.path}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />}
              <span
                onClick={() => !isLast && router.push(bc.path)}
                className={`transition-colors truncate max-w-[150px] ${
                  isLast ? 'text-zinc-800 font-extrabold cursor-default' : 'hover:text-zinc-700 cursor-pointer'
                }`}
              >
                {bc.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Search simulation */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search proposals, audits, logs..."
            className="pl-9 pr-4 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white w-60 transition-all font-medium text-zinc-800"
          />
        </div>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={() => router.push('/notifications')}
          className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors text-zinc-500 hover:text-zinc-800 relative cursor-pointer focus:outline-none"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full border border-white" />
        </button>

        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            {!imgError && user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                onError={() => setImgError(true)}
                className="w-8 h-8 rounded-lg object-cover border border-zinc-150"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 font-extrabold flex items-center justify-center text-xs border border-zinc-150 uppercase shadow-xs">
                {initials}
              </div>
            )}
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-150 rounded-2xl shadow-xl py-2 z-20 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-zinc-100">
                  <p className="text-xs font-bold text-zinc-900 truncate">{user?.name || 'Amit Saxena'}</p>
                  <p className="text-[10px] text-zinc-400 font-medium truncate">{user?.email || 'spoc@netlink.com'}</p>
                  <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{role}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    router.push('/profile');
                  }}
                  className="w-full px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-4 h-4" /> Company Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    router.push('/settings');
                  }}
                  className="w-full px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>

                <hr className="my-1.5 border-zinc-100" />
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
