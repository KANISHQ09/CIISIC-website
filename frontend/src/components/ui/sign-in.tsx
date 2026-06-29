import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
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

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;

  // Controlled fields
  email?: string;
  password?: string;
  onEmailChange?: (val: string) => void;
  onPasswordChange?: (val: string) => void;

  // Dev shortcuts
  activeRole?: string;
  onRoleSelect?: (roleKey: string) => void;
  rolesList?: Array<{ key: string; label: string }>;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500">
    {children}
  </div>
);

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-semibold text-zinc-900 tracking-tight">Welcome</span>,
  description = 'Access your account and continue your journey with us',
  heroImageSrc,
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,

  email = '',
  password = '',
  onEmailChange,
  onPasswordChange,

  activeRole,
  onRoleSelect,
  rolesList = []
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-[100vh] flex flex-col md:flex-row w-[100vw] bg-white text-zinc-900 overflow-hidden select-none">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white md:max-w-[50%] lg:max-w-[45%] xl:max-w-[40%]">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">{title}</h1>
              <p className="text-sm text-zinc-500 font-medium">{description}</p>
            </div>

            {rolesList && rolesList.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Ecosystem Shortcuts (Dev Only)</label>
                <div className="grid grid-cols-2 gap-2">
                  {rolesList.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => onRoleSelect?.(r.key)}
                      className={`py-2.5 px-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeRole === r.key
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600 bg-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={onSignIn}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Email Address</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange?.(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-3.5 rounded-2xl focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => onPasswordChange?.(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-3.5 pr-12 rounded-2xl focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
                  />
                  <span className="text-zinc-600">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onResetPassword?.();
                  }}
                  className="hover:underline text-violet-600 transition-colors"
                >
                  Reset password
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 font-bold transition-all mt-2 active:scale-[0.99] cursor-pointer text-sm shadow-sm"
              >
                Sign In
              </button>
            </form>

            <div className="relative flex items-center justify-center py-1">
              <span className="w-full border-t border-zinc-200"></span>
              <span className="px-4 text-xs font-bold text-zinc-400 bg-white absolute">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full flex items-center justify-center gap-2.5 border border-zinc-200 rounded-2xl py-3 hover:bg-zinc-50 transition-all font-bold text-zinc-700 bg-white text-sm cursor-pointer active:scale-[0.99] shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="text-center text-xs font-semibold text-zinc-500">
              New to our platform?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount?.();
                }}
                className="text-violet-600 hover:underline transition-colors"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: cover image */}
      <section className="hidden md:block flex-1 relative bg-zinc-50">
        {heroImageSrc && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>}
      </section>
    </div>
  );
};
