'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ShieldCheck, MailCheck, ArrowLeft, ArrowRight, ShieldAlert, GraduationCap, BookOpen, Layers, Calendar } from 'lucide-react';
import useToast from '@/hooks/useToast';

const CiisicLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
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

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Institution State
  const [institution, setInstitution] = useState('LNCT Bhopal');
  const [course, setCourse] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 'None';
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

  const strength = getPasswordStrength();

  const handleNextStep = () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill all basic details.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setActiveStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!institution || !course || !branch || !year) {
      showToast('Please fill all institution details.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'STUDENT',
          profileData: {
            enrollmentNo: `CII/ST/${Date.now().toString().slice(-4)}`,
            department: branch,
            yearOfStudy: parseInt(year) || 1,
            skills: [],
            course,
            branch,
            institutionName: institution
          }
        })
      });
      const result = await response.json();

      if (result.success) {
        showToast('Account details verified. Link sent.', 'success');
        setActiveStep(3);
      } else {
        showToast(result.error || 'Registration failed.', 'error');
      }
    } catch {
      showToast('Connection failed. Please ensure the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (result.success) {
        showToast('Verification email resent successfully.', 'success');
      } else {
        showToast(result.error || 'Resend failed.', 'error');
      }
    } catch {
      showToast('Connection failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Account Details', desc: 'Basic information' },
    { num: 2, label: 'Institution Details', desc: 'Tell us about your institution' },
    { num: 3, label: 'Verify Email', desc: 'Confirm your email address' },
    { num: 4, label: 'Start Innovating', desc: 'Explore and participate' }
  ];

  return (
    <div className="h-screen w-screen flex bg-white text-zinc-900 overflow-hidden font-sans select-none">
      {/* Left Column: premium glowing cosmic gradient */}
      <section className="hidden md:flex w-1/2 min-h-screen relative overflow-hidden bg-slate-950 flex-col justify-between p-12 select-none">
        <div className="absolute top-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full bg-indigo-600/15 blur-[130px]" />

        <div className="relative z-10">
          <CiisicLogo />
        </div>

        {/* Center content: Stepper Status */}
        <div className="relative z-10 space-y-8 my-auto pl-6 text-left">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Create Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">
                Student Account
              </span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-medium">
              Join thousands of innovators building tomorrow's solutions today.
            </p>
          </div>

          {/* Stepper Progress Steps */}
          <div className="space-y-5 max-w-xs pt-2">
            {steps.map((s) => {
              const isActive = activeStep === s.num;
              const isPast = activeStep > s.num;
              return (
                <div key={s.num} className="flex items-center gap-3.5 transition-all">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      isActive
                        ? 'border-violet-500 bg-violet-500 text-white font-extrabold shadow-lg shadow-violet-500/25'
                        : isPast
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-white/10 bg-white/5 text-neutral-500'
                    }`}
                  >
                    {s.num}
                  </div>
                  <div className="leading-tight text-left">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-neutral-400'}`}>
                      {s.label}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-medium">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shield Notice */}
        <div className="relative z-10 flex items-center gap-3 text-neutral-400 text-xs leading-tight">
          <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0" />
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider text-left">
            Your data is secure with CIISIC <br />
            <span className="text-[9px] text-neutral-600 font-semibold normal-case">
              We use industry-standard encryption to protect your information.
            </span>
          </p>
        </div>
      </section>

      {/* Right Column: Dynamic Form Screen based on Step */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white min-h-screen overflow-y-auto">
        <div className="w-full max-w-sm my-auto py-8">
          {activeStep === 1 && (
            <div className="space-y-7 text-left">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Account Details</h1>
                <p className="text-xs text-zinc-500 font-medium">Let's get started with your basic information</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Full Name</label>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                    <User className="w-4 h-4 text-zinc-400 mr-2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Institutional Email</label>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                    <Mail className="w-4 h-4 text-zinc-400 mr-2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@institution.edu.in"
                      className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Password</label>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                      <Lock className="w-4 h-4 text-zinc-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Confirm</label>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                      <Lock className="w-4 h-4 text-zinc-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {password && (
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-zinc-400">Password strength:</span>
                    <span
                      className={
                        strength === 'Weak'
                          ? 'text-rose-500'
                          : strength === 'Medium'
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                      }
                    >
                      {strength}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full rounded-2xl bg-violet-600 hover:bg-violet-750 text-white py-3.5 font-bold transition-all mt-2 active:scale-[0.99] cursor-pointer text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  Next Step →
                </button>
              </div>

              <p className="text-center text-xs font-semibold text-zinc-500">
                Already have an account?{' '}
                <a href="/auth/login" className="text-violet-600 hover:underline transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          )}

          {activeStep === 2 && (
            <form onSubmit={handleRegister} className="space-y-7 text-left">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Institution Details</h1>
                <p className="text-xs text-zinc-500 font-medium">Tell us about your institution details</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Institution Name</label>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                    <GraduationCap className="w-4 h-4 text-zinc-400 mr-2" />
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. LNCT University Bhopal"
                      className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Course</label>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                    <BookOpen className="w-4 h-4 text-zinc-400 mr-2" />
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech or MCA"
                      className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Branch</label>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                      <Layers className="w-4 h-4 text-zinc-400 mr-1" />
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Year</label>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                      <Calendar className="w-4 h-4 text-zinc-400 mr-1" />
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 3"
                        className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-violet-600 hover:bg-violet-750 text-white py-3.5 font-bold transition-all mt-2 active:scale-[0.99] cursor-pointer text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Register & Verify →'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="w-full text-center text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  ← Back to Account Details
                </button>
              </div>
            </form>
          )}

          {activeStep === 3 && (
            <div className="space-y-7 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto text-violet-600 animate-bounce">
                <MailCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Verify Your Email</h1>
                <p className="text-xs text-zinc-500 font-medium">We've sent a verification link to {email}</p>
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                  Please check your inbox and click the link to verify your email address.
                </p>
              </div>

              <div className="p-5 bg-zinc-50/80 border border-zinc-150 rounded-2xl text-left text-[11px] font-semibold text-zinc-500 leading-relaxed space-y-3">
                <p>Haven't received the email? Check your spam folder or resend the email.</p>
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="py-1.5 px-4 bg-white border border-zinc-200 rounded-xl font-bold text-zinc-700 hover:bg-zinc-50 transition-all text-[10px] cursor-pointer disabled:opacity-50"
                >
                  Resend Email
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
