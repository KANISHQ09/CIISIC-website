'use client';

import React from 'react';
import { AuthProvider } from './auth-provider';
import { ToastProvider } from './toast-provider';
import { ModalProvider } from './modal-provider';
import { RouteTransitionProvider } from './route-transition-provider';

export interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <RouteTransitionProvider>{children}</RouteTransitionProvider>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default Providers;
