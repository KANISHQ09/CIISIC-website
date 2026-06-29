import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/industry/Sidebar';
import { Header } from '@/components/industry/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ciisic_industry_sidebar_collapsed');
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem('ciisic_industry_sidebar_collapsed', JSON.stringify(nextVal));
  };

  return (
    <div className="h-screen w-screen flex bg-zinc-50 overflow-hidden font-sans">
      {/* Collapsible Navigation Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sticky Glass Header */}
        <Header />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 lg:max-w-6xl w-full mx-auto pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
