'use client';

import React from 'react';
import { Register } from '@/features/auth/Register';

export default function RegisterPage() {
  return (
    <div className="h-[100vh] flex flex-col md:flex-row w-[100vw] bg-white text-zinc-900 overflow-hidden select-none">
      {/* Left column: registration form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto md:max-w-[50%] lg:max-w-[45%] xl:max-w-[40%]">
        <div className="w-full max-w-sm my-auto py-8">
          <Register />
        </div>
      </section>

      {/* Right column: cover image */}
      <section className="hidden md:block flex-1 relative bg-zinc-50">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/assets/images/cells/6.jpg)` }}></div>
      </section>
    </div>
  );
}
