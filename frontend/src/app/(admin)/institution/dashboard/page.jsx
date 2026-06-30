'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InstitutionRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/portal/institution/dashboard');
  }, [router]);
  return null;
}
