'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Challenge } from '@/types/studentPortal';
import { ChallengeService } from '@/services/challengeService';
import { ProposalService } from '@/services/proposalService';
import { StudentService } from '@/services/studentService';
import { UploadService } from '@/services/uploadService';
import { ArrowLeft, ArrowRight, CheckCircle, FileText, UploadCloud, File, X, AlertCircle } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/auth-provider';

export default function ProposalSubmissionWizard() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  const challengeId = params?.id as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Wizard States
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form Fields
  const [proposalTitle, setProposalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [approach, setApproach] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Autosave status
  const [autosaveStatus, setAutosaveStatus] = useState('Draft Saved');

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) return;
      setIsLoading(true);
      try {
        const item = await ChallengeService.getChallengeById(challengeId);
        setChallenge(item);

        // Load existing draft if present
        const savedDraft = localStorage.getItem(`draft_proposal_${challengeId}`);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          setProposalTitle(draft.title || '');
          setDescription(draft.description || '');
          setApproach(draft.approach || '');
          setFileName(draft.fileName || '');
          setFileUrl(draft.fileUrl || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  // Simulate Autosave
  useEffect(() => {
    if (!challengeId || currentStep === 6) return;
    setAutosaveStatus('Saving...');
    const timer = setTimeout(() => {
      const draft = {
        title: proposalTitle,
        description,
        approach,
        fileName,
        fileUrl
      };
      localStorage.setItem(`draft_proposal_${challengeId}`, JSON.stringify(draft));
      setAutosaveStatus('Draft Saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [proposalTitle, description, approach, fileName, fileUrl, challengeId, currentStep]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are supported.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await UploadService.uploadFile(file);
      setFileName(res.fileName);
      setFileUrl(res.fileUrl);
      showToast('PDF uploaded successfully!', 'success');
    } catch {
      showToast('Failed to upload PDF.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileUrl('');
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    try {
      const student = await StudentService.getProfile();
      await ProposalService.submitProposal({
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        companyName: challenge.companyName,
        studentId: user?.id || 'unknown',
        studentName: student.name,
        title: proposalTitle,
        description,
        technicalApproach: approach,
        fileUrl: fileUrl || '#',
        fileName: fileName || 'proposal_solution.pdf',
        status: 'SUBMITTED'
      });

      // Clear draft
      localStorage.removeItem(`draft_proposal_${challengeId}`);
      setCurrentStep(6);
      showToast('Proposal submitted successfully!', 'success');
    } catch {
      showToast('Failed to submit proposal', 'error');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !proposalTitle.trim()) {
      showToast('Please specify your proposal title.', 'error');
      return;
    }
    if (currentStep === 2 && !description.trim()) {
      showToast('Please provide a brief problem description.', 'error');
      return;
    }
    if (currentStep === 3 && !approach.trim()) {
      showToast('Please detail your technical solution approach.', 'error');
      return;
    }
    if (currentStep === 4 && !fileName) {
      showToast('Please upload your proposal brief PDF.', 'error');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 font-bold">Challenge brief not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none max-w-2xl mx-auto">
      {/* Header and back */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <button
          onClick={() => router.push(`/challenges/${challenge.id}`)}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cancel Application
        </button>
        {currentStep < 6 && (
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-md">
            {autosaveStatus}
          </span>
        )}
      </div>

      {currentStep < 6 && (
        <div className="space-y-4">
          {/* Stepper Heading */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest block">Step {currentStep} of 5</span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {currentStep === 1 && 'Basic Solution Details'}
              {currentStep === 2 && 'Problem Context & Analysis'}
              {currentStep === 3 && 'Technical Implementation Approach'}
              {currentStep === 4 && 'Upload Technical Brief PDF'}
              {currentStep === 5 && 'Verify Details & Confirm'}
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Challenge: {challenge.title} ({challenge.companyName})
            </p>
          </div>

          {/* Stepper progress bar */}
          <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps content panels */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Proposal Title</label>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                    <FileText className="w-4.5 h-4.5 text-zinc-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      placeholder="e.g. IoT Edge Controller for Tata Hydration Grid"
                      className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium leading-normal block">
                    Write a concise, professional title representing your technological solution.
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Problem Description */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Problem & Context Analysis</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed explanation of the problem statement and the primary challenges you aim to address..."
                    rows={8}
                    className="w-full p-4 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all font-medium text-zinc-800"
                  />
                  <span className="text-[10px] text-zinc-400 font-medium leading-normal block">
                    Focus on the specific bottlenecks or structural requirements highlighted by the corporate sponsor.
                  </span>
                </div>
              </div>
            )}

            {/* Step 3: Technical Approach */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Technical Approach & Architecture</label>
                  <textarea
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    placeholder="Outline your tech stack, system components, algorithms, and integration schematics step-by-step..."
                    rows={8}
                    className="w-full p-4 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all font-medium text-zinc-800"
                  />
                  <span className="text-[10px] text-zinc-400 font-medium leading-normal block">
                    Specify databases, backend frameworks, hardware protocols, or neural model versions.
                  </span>
                </div>
              </div>
            )}

            {/* Step 4: Upload PDF */}
            {currentStep === 4 && (
              <div className="space-y-5 flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Technical Documentation Uploader</label>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    Please upload a single PDF file (Max 10 MB) summarizing schematics and layouts.
                  </p>
                </div>

                {!fileName ? (
                  <label className="border-2 border-dashed border-zinc-200 bg-zinc-50/30 hover:bg-zinc-50 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group transition-colors">
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-150 shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-violet-600 transition-colors">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-center leading-normal">
                      <p className="text-xs font-bold text-zinc-700">
                        {isUploading ? 'Uploading file...' : 'Click to select PDF document'}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">PDF Documents Only</p>
                    </div>
                  </label>
                ) : (
                  <div className="p-4 border border-zinc-150 rounded-2xl bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="text-left leading-tight">
                        <p className="text-xs font-bold text-zinc-800 truncate max-w-[180px]">{fileName}</p>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">Ready to submit</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Review Details */}
            {currentStep === 5 && (
              <div className="space-y-5 text-left flex-1">
                <div className="space-y-4 border border-zinc-150 rounded-2xl p-5 bg-zinc-50/50">
                  <div className="border-b border-zinc-100 pb-2">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Solution Title</p>
                    <p className="text-sm font-extrabold text-zinc-800">{proposalTitle}</p>
                  </div>
                  <div className="border-b border-zinc-100 pb-2">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Problem Context</p>
                    <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-0.5 line-clamp-3">{description}</p>
                  </div>
                  <div className="border-b border-zinc-100 pb-2">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Technical Approach</p>
                    <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-0.5 line-clamp-3">{approach}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Uploaded Attachment</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-violet-600 font-bold">
                      <File className="w-4 h-4" />
                      <span>{fileName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-[10px] text-zinc-500 font-medium leading-relaxed bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                  <span>
                    Submitting routes this proposal to the LNCT Excellence Cell coordinator. Once verified, it will be published to the
                    industry review panel.
                  </span>
                </div>
              </div>
            )}

            {/* Step 6: Success screen */}
            {currentStep === 6 && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-zinc-950">Proposal Submitted!</h2>
                  <p className="text-xs text-zinc-500 font-medium max-w-sm leading-relaxed">
                    Your solution has been saved. Academic coordinators will verify your application credentials shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/proposals')}
                  className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all mt-4 cursor-pointer focus:outline-none"
                >
                  View My Proposals
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Form navigation buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between border-t border-zinc-100 pt-6 mt-6 shrink-0">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="py-2.5 px-4 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 focus:outline-none"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="py-2.5 px-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none"
              >
                Submit Proposal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
