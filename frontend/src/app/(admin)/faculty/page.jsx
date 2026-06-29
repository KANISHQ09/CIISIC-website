'use client';

import dynamic from 'next/dynamic';

const FacultyRegistry = dynamic(() => import('@/views/institution/faculty'));

export default function FacultyPage() {
  return <FacultyRegistry />;
}
