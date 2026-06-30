'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, HelpCircle, Trophy } from 'lucide-react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 23 23">
    <path fill="#f35325" d="M0 0h11v11H0z" />
    <path fill="#81bc06" d="M12 0h11v11H12z" />
    <path fill="#05a6f0" d="M0 12h11v11H0z" />
    <path fill="#ffba08" d="M12 12h11v11H12z" />
  </svg>
);

const CiisicLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center shadow-lg shadow-violet-500/25">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <div className="text-left">
      <span className="text-base font-black tracking-tight text-white">
        CII <span className="text-violet-400 font-extrabold">CIISIC</span>
      </span>
      <p className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-wider -mt-1.5">Collaboration Hub</p>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getRoleRedirectPath = (role) => {
    if (role === 'STUDENT') return '/portal/student/dashboard';
    if (role === 'INDUSTRY_SPOC') return '/portal/industry/dashboard';
    if (role === 'INSTITUTION_SPOC') return '/portal/institution/dashboard';
    if (role === 'REVIEWER') return '/portal/reviewer/dashboard';
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/portal/admin/dashboard';
    return '/portal';
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
        document.cookie = `ciisic_token=${result.token}; path=/; max-age=86400; SameSite=Strict`;
        login(result.token, result.user);
        showToast('Successfully signed in!', 'success');

        const roleRedirect = getRoleRedirectPath(result.user.role);
        const redirect = searchParams.get('redirect') || roleRedirect;
        router.push(redirect);
      } else {
        showToast(result.error || 'Invalid email address or password.', 'error');
      }
    } catch {
      showToast('Connection failed. Please ensure the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-white text-zinc-900 overflow-hidden font-sans select-none">
      {/* Left column: Indigo branding card */}
      <section className="hidden md:flex w-1/2 min-h-screen relative overflow-hidden bg-slate-950 flex-col justify-between p-12 select-none">
        {/* Background glow meshes */}
        <div className="absolute top-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full bg-indigo-600/15 blur-[130px]" />

        <div className="relative z-10">
          <CiisicLogo />
        </div>

        {/* Center content: Title & Lists */}
        <div className="relative z-10 space-y-8 my-auto pl-6 text-left">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Welcome Back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">
                Future Innovator! 🚀
              </span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-medium">
              Sign in to access challenges, collaborate, and build innovative solutions.
            </p>
          </div>

          {/* Stepper info list */}
          <div className="space-y-5 max-w-sm pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
              </div>
              <div className="leading-tight text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Access Real Industry Challenges</h4>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Solve meaningful problems and collaborate with sponsors.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-violet-400" />
              </div>
              <div className="leading-tight text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Collaborate & Innovate</h4>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Connect with domain coordinate mentors and academic SPOC peers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-violet-400" />
              </div>
              <div className="leading-tight text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Track Your Growth</h4>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Earn ecosystem credentials, verification badges, and reputation indices.</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-2xl max-w-sm backdrop-blur-md flex items-center gap-4 mt-6">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Aarav"
              className="w-11 h-11 rounded-2xl object-cover border border-white/10 shrink-0"
            />
            <div className="text-left leading-snug">
              <p className="text-[11px] text-zinc-300 font-semibold italic">"CIISIC helped me turn my ideas into real impact."</p>
              <span className="text-[9px] text-violet-300 font-bold uppercase tracking-wider block mt-1">— Aarav, Student Innovator</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-neutral-500 text-xs">
          © {new Date().getFullYear()} CIISIC Platform. All rights reserved.
        </div>
      </section>

      {/* Right column: Sign-In Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white min-h-screen">
        <div className="w-full max-w-sm space-y-7 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Student Login</h1>
            <p className="text-xs text-zinc-500 font-medium">Enter your institutional email and password</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Email Address</label>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                <Mail className="w-4 h-4 text-zinc-400 mr-2" />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email"
                  className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                <Lock className="w-4 h-4 text-zinc-400 mr-2" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 focus:outline-none">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-zinc-400 hover:text-zinc-650 transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 text-zinc-400 hover:text-zinc-650 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="rounded border-zinc-300 text-violet-650 focus:ring-violet-500 h-4 w-4"
                />
                <span className="text-zinc-600">Remember me</span>
              </label>
              <a href="/auth/forgot-password" className="hover:underline text-violet-600 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-violet-600 hover:bg-violet-750 text-white py-3.5 font-bold transition-all mt-2 active:scale-[0.99] cursor-pointer text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-xs font-semibold text-zinc-500">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-violet-650 hover:underline transition-colors">
              Create Student Account
            </a>
          </p>

          <div className="relative flex items-center justify-center py-1">
            <span className="w-full border-t border-zinc-200" />
            <span className="px-4 text-xs font-bold text-zinc-400 bg-white absolute">or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-zinc-200 rounded-2xl py-3 hover:bg-zinc-50 transition-all font-bold text-zinc-700 bg-white text-xs cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-zinc-200 rounded-2xl py-3 hover:bg-zinc-50 transition-all font-bold text-zinc-700 bg-white text-xs cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <MicrosoftIcon />
              Microsoft
            </button>
          </div>

          <p className="text-center text-[10px] font-semibold text-zinc-400">
            By signing in, you agree to our{' '}
            <a href="#" className="hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
