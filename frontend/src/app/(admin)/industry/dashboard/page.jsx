'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndustryRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/portal/industry/dashboard');
  }, [router]);
  return null;
}
