'use client';

import dynamic from 'next/dynamic';

const UserDirectory = dynamic(() => import('@/views/admin/users'));

export default function UsersPage() {
  return <UserDirectory />;
}
