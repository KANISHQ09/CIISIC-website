'use client';

import dynamic from 'next/dynamic';

const StudentShortlist = dynamic(() => import('@/views/industry/shortlist'));

export default function ShortlistPage() {
  return <StudentShortlist />;
}
