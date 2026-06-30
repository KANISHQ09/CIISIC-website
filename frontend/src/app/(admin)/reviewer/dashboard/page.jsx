'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewerRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/portal/reviewer/dashboard');
  }, [router]);
  return null;
}
