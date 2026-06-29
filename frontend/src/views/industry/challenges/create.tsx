'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChallengeDraft } from '@/types/industryPortal';
import { ChallengeManagementService } from '@/services/challengeManagementService';
import { ArrowLeft, ArrowRight, Save, CheckCircle, UploadCloud, X, HelpCircle, FileText } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateChallengeWizard() {
  const router = useRouter();
  const { showToast } = useToast();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Agritech & Bio-Sciences');
  const [problemStatement, setProblemStatement] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [minCGPA, setMinCGPA] = useState(6.0);
  const [branches, setBranches] = useState<string[]>(['Computer Science', 'Information Technology']);
  const [deadline, setDeadline] = useState('2026-08-30');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Autosave status
  const [autosaveStatus, setAutosaveStatus] = useState('Draft Saved');

  // Load existing draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('ciisic_challenge_wizard_draft');
    if (saved) {
      const draft = JSON.parse(saved);
      setTitle(draft.title || '');
      setCategory(draft.category || 'Agritech & Bio-Sciences');
      setProblemStatement(draft.problemStatement || '');
      setTechStack(draft.techStack || []);
      setDeliverables(draft.deliverables || []);
      setMinCGPA(draft.minCGPA || 6.0);
      setBranches(draft.branches || ['Computer Science', 'Information Technology']);
      setDeadline(draft.deadline || '2026-08-30');
      setFileName(draft.fileName || '');
    }
  }, []);

  // Autosave simulator hook
  useEffect(() => {
    if (currentStep === 7) return;
    setAutosaveStatus('Saving...');
    const timer = setTimeout(() => {
      const draft = {
        title,
        category,
        problemStatement,
        techStack,
        deliverables,
        minCGPA,
        branches,
        deadline,
        fileName
      };
      localStorage.setItem('ciisic_challenge_wizard_draft', JSON.stringify(draft));
      setAutosaveStatus('Draft Saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, category, problemStatement, techStack, deliverables, minCGPA, branches, deadline, fileName, currentStep]);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techStackInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techStackInput.trim())) {
        setTechStack([...techStack, techStackInput.trim()]);
      }
      setTechStackInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setTechStack(techStack.filter((s) => s !== skill));
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliverableInput.trim()) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setFileName(file.name);
      setIsUploading(false);
      showToast('Attachment uploaded successfully!', 'success');
    }, 1200);
  };

  const handlePublish = async (isDraft = false) => {
    try {
      const draftData: ChallengeDraft = {
        title,
        category,
        problemStatement,
        requirements: deliverables,
        techStack,
        deliverables,
        eligibility: {
          branches,
          minCGPA,
          yearOfStudy: [3, 4]
        },
        timeline: {
          submissionDeadline: deadline,
          reviewCompleted: new Date(new Date(deadline).getTime() + 15 * 86400000).toISOString().split('T')[0],
          published: new Date().toISOString().split('T')[0]
        },
        attachments: fileName ? [{ name: fileName, size: '2.4 MB', url: '#' }] : [],
        status: isDraft ? 'DRAFT' : 'PUBLISHED'
      };

      await ChallengeManagementService.createChallenge(draftData);

      // Clear draft
      localStorage.removeItem('ciisic_challenge_wizard_draft');
      setCurrentStep(7);
      showToast(isDraft ? 'Challenge draft saved successfully!' : 'Challenge published successfully!', 'success');
    } catch {
      showToast('Failed to process challenge uploader', 'error');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !title.trim()) {
      showToast('Please specify a title.', 'error');
      return;
    }
    if (currentStep === 2 && !problemStatement.trim()) {
      showToast('Please define the problem statement.', 'error');
      return;
    }
    if (currentStep === 3 && techStack.length === 0) {
      showToast('Please add at least one tech stack skill.', 'error');
      return;
    }
    if (currentStep === 4 && deliverables.length === 0) {
      showToast('Please specify at least one deliverable item.', 'error');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  return (
    <div className="space-y-6 text-left pb-16 select-none max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back button */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <button
          onClick={() => router.push('/challenges')}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to registry
        </button>
        {currentStep < 7 && (
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-md">
            {autosaveStatus}
          </span>
        )}
      </div>

      {currentStep < 7 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block">Step {currentStep} of 6</span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {currentStep === 1 && 'Basic Brief Details'}
              {currentStep === 2 && 'Problem Statement Context'}
              {currentStep === 3 && 'Required Tech Stack Skills'}
              {currentStep === 4 && 'Key Solver Deliverables'}
              {currentStep === 5 && 'Candidate Eligibility Constraints'}
              {currentStep === 6 && 'Timeline & Evaluation Settings'}
            </h1>
          </div>

          {/* Stepper Progress */}
          <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm min-h-[320px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Step 1: Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Challenge Title</label>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-blue-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-500 flex items-center px-4">
                    <FileText className="w-4.5 h-4.5 text-zinc-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Optimized telemetry firmware for soil metrics"
                      className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Domain Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-3 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-zinc-700"
                  >
                    <option value="Agritech & Bio-Sciences">Agritech & Bio-Sciences</option>
                    <option value="Clean Energy">Clean Energy</option>
                    <option value="Automotive & Smart mobility">Automotive & Smart mobility</option>
                    <option value="Software Architecture">Software Architecture</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Problem Statement */}
            {currentStep === 2 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Problem Statement Description</label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Outline the technical issue, bottlenecks, current configurations, and target performance parameters..."
                  rows={8}
                  className="w-full p-4 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold text-zinc-800"
                />
              </div>
            )}

            {/* Step 3: Tech Stack */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Required Skills & Frameworks</label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type skill and press Enter (e.g. Raspberry Pi, PyTorch)..."
                    className="w-full px-4 py-3 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {techStack.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-400 hover:text-blue-700 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Deliverables */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <form onSubmit={handleAddDeliverable} className="flex gap-2">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    placeholder="Add deliverable check item (e.g. Gerber files, MATLAB model)..."
                    className="flex-1 px-4 py-3 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-850 transition-colors"
                  >
                    Add
                  </button>
                </form>

                <ul className="space-y-2 pt-2">
                  {deliverables.map((del, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between p-3 border border-zinc-100 rounded-xl text-xs text-zinc-700 font-semibold"
                    >
                      <span>
                        {i + 1}. {del}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(i)}
                        className="text-zinc-400 hover:text-rose-600 focus:outline-none"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 5: Eligibility */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Minimum CGPA Quotient</label>
                  <input
                    type="number"
                    min="4.0"
                    max="10.0"
                    step="0.1"
                    value={minCGPA}
                    onChange={(e) => setMinCGPA(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-bold text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Target Disciplines</label>
                  <div className="flex flex-wrap gap-2">
                    {['Computer Science', 'Electronics & Comm', 'Mechanical Eng', 'Chemical Eng'].map((branch) => {
                      const isSelected = branches.includes(branch);
                      return (
                        <button
                          key={branch}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setBranches(branches.filter((b) => b !== branch));
                            } else {
                              setBranches([...branches, branch]);
                            }
                          }}
                          className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          {branch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Timeline & Files */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Submission Close Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-bold text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Reference Attachment (Optional)</label>
                  {!fileName ? (
                    <label className="border-2 border-dashed border-zinc-200 hover:border-blue-300 bg-zinc-50/30 hover:bg-zinc-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                      <input type="file" onChange={handleFileUpload} className="hidden" />
                      <UploadCloud className="w-5 h-5 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-600">
                        {isUploading ? 'Uploading...' : 'Click to select brief files'}
                      </span>
                    </label>
                  ) : (
                    <div className="p-3 border border-zinc-200 rounded-xl flex items-center justify-between bg-white">
                      <span className="text-xs text-zinc-700 font-bold truncate max-w-[200px]">{fileName}</span>
                      <button type="button" onClick={() => setFileName('')} className="text-zinc-400 hover:text-rose-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Success screen */}
            {currentStep === 7 && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-md animate-bounce">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-zinc-950">Challenge Registered!</h2>
                  <p className="text-xs text-zinc-500 font-medium max-w-sm leading-relaxed">
                    Ecosystem solvers will receive system notification updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/challenges')}
                  className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all mt-4 cursor-pointer"
                >
                  View Active Challenges
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        {currentStep < 7 && (
          <div className="flex justify-between border-t border-zinc-100 pt-6 mt-6 shrink-0">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="py-2.5 px-4 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePublish(true)}
                className="py-2.5 px-4 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save Draft
              </button>
              {currentStep < 6 ? (
                <button
                  onClick={nextStep}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handlePublish(false)}
                  className="py-2.5 px-6 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none"
                >
                  Publish Challenge
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
