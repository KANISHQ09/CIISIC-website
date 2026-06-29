'use client';

import React from 'react';
import { PermissionMatrix } from '@/components/admin/PermissionMatrix';

export default function PermissionsControl() {
  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Role Permission Matrix</h1>
        <p className="text-sm text-zinc-500 font-medium">Verify system endpoint allowances and toggle regional feature flag coordinates</p>
      </div>

      {/* Permission Table */}
      <PermissionMatrix />
    </div>
  );
}
