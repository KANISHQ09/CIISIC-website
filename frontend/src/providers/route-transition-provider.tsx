'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface TransitionContextType {
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const RouteTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const handler = setTimeout(() => {
      setIsTransitioning(false);
    }, 200); // Mapped to normal transition token duration

    return () => clearTimeout(handler);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ isTransitioning }}>
      <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 150ms ease-in-out' }}>{children}</div>
    </TransitionContext.Provider>
  );
};

export const useRouteTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useRouteTransition must be used inside a RouteTransitionProvider');
  }
  return context;
};
