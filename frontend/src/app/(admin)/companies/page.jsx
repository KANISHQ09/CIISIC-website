'use client';

import dynamic from 'next/dynamic';

const CompanyRegistry = dynamic(() => import('@/views/admin/companies'));

export default function CompaniesPage() {
  return <CompanyRegistry />;
}
