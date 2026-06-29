'use client';

import dynamic from 'next/dynamic';

const PermissionsMatrix = dynamic(() => import('@/views/admin/permissions'));

export default function PermissionsPage() {
  return <PermissionsMatrix />;
}
