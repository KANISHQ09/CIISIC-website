'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Mail, Phone, MapPin, CheckCircle2, Clock } from 'lucide-react';
import useToast from '@/hooks/useToast';

const contactSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters long'),
  email: zod.string().email('Please enter a valid email address'),
  message: zod.string().min(10, 'Message must be at least 10 characters long')
});

export default function Contact() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate endpoint dispatch
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSubmitted(true);
      showToast('Helpline message dispatched successfully.', 'success');
    } catch {
      showToast('Connection failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Helpdesk Hub</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Contact Us
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">
              Have questions regarding chapter verification, active challenges, or student credentials? Reach out to our program coordinators.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-zinc-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase">CII MP State Office</h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  Confederation of Indian Industry, E-2/8, Arera Colony, Bhopal, Madhya Pradesh 462016
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase">Email Enquiries</h4>
                <p className="text-xs text-neutral-800 font-bold hover:underline">
                  support@ciisic.in
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase">Helpline Support</h4>
                <p className="text-xs text-neutral-800 font-bold">+91 (755) 422-3112</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8 max-w-xl mx-auto lg:mx-0">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Message Received!</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto font-medium">
                  Thank you for reaching out. A CIISIC state coordinator will reply to your registered email address within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Your Name</label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.name && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Email Address</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="example@ciisic.in"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.email && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">Message / Inquiry</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Describe your inquiry..."
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                  {errors.message && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#0F294A] hover:bg-[#1A3A63] text-white font-semibold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
