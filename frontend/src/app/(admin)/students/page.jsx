'use client';

import dynamic from 'next/dynamic';

const StudentDirectory = dynamic(() => import('@/views/institution/students'));

export default function DirectoryPage() {
  return <StudentDirectory />;
}
