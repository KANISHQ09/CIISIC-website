'use client';

import dynamic from 'next/dynamic';

const CMSManager = dynamic(() => import('@/views/admin/cms'));

export default function CMSPage() {
  return <CMSManager />;
}
