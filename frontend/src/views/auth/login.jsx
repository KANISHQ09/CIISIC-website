'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { SignInPage } from '@/components/ui/sign-in';

const sampleTestimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

const rolesList = [
  { key: 'STUDENT', label: 'Student', email: 'student@lnct.ac.in' },
  { key: 'INDUSTRY_SPOC', label: 'Industry SPOC', email: 'spoc@netlink.com' },
  { key: 'INSTITUTION_SPOC', label: 'Institutional SPOC', email: 'spoc@lnct.ac.in' },
  { key: 'ADMIN', label: 'Platform Admin', email: 'admin@ciisic.in' }
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeRole, setActiveRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleKey) => {
    setActiveRole(roleKey);
    const roleItem = rolesList.find(r => r.key === roleKey);
    if (roleItem) {
      setEmail(roleItem.email);
      setPassword('Password@123');
      showToast(`Loaded ${roleItem.label} credentials`, 'info');
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();

      if (result.success) {
        // Set secure cookie for middleware route guards
        document.cookie = `ciisic_token=${result.token}; path=/; max-age=86400; SameSite=Strict`;
        login(result.token, result.user);
        showToast('Successfully signed in!', 'success');

        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        showToast(result.error || 'Authentication failed', 'error');
      }
    } catch {
      showToast('Connection failed. Please check network settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    showToast('Continue with Google clicked', 'info');
  };

  const handleResetPassword = () => {
    showToast('Password reset option selected', 'info');
  };

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  return (
    <SignInPage
      title={
        <span className="font-semibold text-neutral-900 tracking-tight">
          Welcome to <span className="text-violet-600 font-extrabold">CIISIC</span>
        </span>
      }
      description="Access your CIISIC Collaboration Account to track Innovation Cells & Challenges"
      heroImageSrc="/assets/images/cells/6.jpg"
      testimonials={sampleTestimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
      
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}

      activeRole={activeRole}
      onRoleSelect={handleRoleSelect}
      rolesList={rolesList}
    />
  );
}
