'use client';

import dynamic from 'next/dynamic';

const SystemAuditLog = dynamic(() => import('@/views/admin/logs'));

export default function LogsPage() {
  return <SystemAuditLog />;
}
