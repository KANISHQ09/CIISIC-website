'use client';

import dynamic from 'next/dynamic';

const StudentDetailsAudit = dynamic(() => import('@/views/institution/students/details'));

export default function StudentDetailsPage() {
  return <StudentDetailsAudit />;
}
