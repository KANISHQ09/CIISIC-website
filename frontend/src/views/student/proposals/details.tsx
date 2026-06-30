'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Proposal } from '@/types/studentPortal';
import { ProposalService } from '@/services/proposalService';
import { StudentService } from '@/services/studentService';
import { UploadService } from '@/services/uploadService';
import { StatusBadge } from '@/components/student/StatusBadge';
import { Timeline } from '@/components/student/Timeline';
import { ArrowLeft, File, Download, Send, Upload, Clock, CheckCircle, FileText } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { motion } from 'framer-motion';

export default function ProposalDetails() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const proposalId = params?.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Revision Form States
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionDesc, setRevisionDesc] = useState('');
  const [revisionFileName, setRevisionFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      if (!proposalId) return;
      setIsLoading(true);
      try {
        const item = await ProposalService.getProposalById(proposalId);
        setProposal(item);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposalDetails();
  }, [proposalId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !proposal) return;

    try {
      const student = await StudentService.getProfile();
      const updated = await ProposalService.addProposalComment(proposal.id, student.name, 'Student', commentText.trim());
      if (updated) {
        setProposal(updated);
        setCommentText('');
        showToast('Comment posted to timeline!', 'success');
      }
    } catch {
      showToast('Failed to post comment', 'error');
    }
  };

  const handleUploadRevisionFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are supported.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await UploadService.uploadFile(file);
      setRevisionFileName(res.fileName);
      setUploadedFileUrl(res.fileUrl);
      showToast('Revision PDF uploaded successfully!', 'success');
    } catch {
      showToast('Failed to upload revision PDF.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal || !revisionFileName || !revisionDesc.trim()) {
      showToast('Please upload a file and describe the revision.', 'error');
      return;
    }

    try {
      const updated = await ProposalService.submitRevision(proposal.id, uploadedFileUrl || '#', revisionFileName, revisionDesc.trim());
      if (updated) {
        setProposal(updated);
        setRevisionFileName('');
        setRevisionDesc('');
        setUploadedFileUrl('');
        setShowRevisionForm(false);
        showToast('Revision submitted successfully!', 'success');
      }
    } catch {
      showToast('Failed to submit revision', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-zinc-500 font-bold">Proposal brief not found.</p>
        <button onClick={() => router.push('/proposals')} className="text-xs text-violet-600 hover:underline">
          Go back to proposals
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back navigation */}
      <button
        onClick={() => router.push('/proposals')}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to proposals
      </button>

      {/* Header Banner */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">ID: {proposal.id.toUpperCase()}</span>
            <span>•</span>
            <StatusBadge status={proposal.status} />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">{proposal.title}</h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Challenge Reference: <span className="text-zinc-800 font-bold">{proposal.challengeTitle}</span> ({proposal.companyName})
          </p>
        </div>

        {/* Action revision button */}
        {proposal.status === 'REVISION_REQUESTED' && !showRevisionForm && (
          <button
            onClick={() => setShowRevisionForm(true)}
            className="py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-[0.98] self-start sm:self-center"
          >
            <Upload className="w-4 h-4" /> Upload Revision
          </button>
        )}
      </div>

      {/* Grid view layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left pane: solution details, uploads, revisions uploader */}
        <div className="lg:col-span-2 space-y-6">
          {/* Solution context */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Solution Brief</h2>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">{proposal.description}</p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-wider">Technical Approach</h4>
              <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl text-xs font-medium text-zinc-700 whitespace-pre-line leading-relaxed">
                {proposal.technicalApproach}
              </div>
            </div>
          </div>

          {/* Active file brief */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Active Document version</h2>
            <div className="p-4 border border-zinc-150 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <File className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-extrabold text-zinc-800 truncate max-w-[200px]">{proposal.fileName}</p>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Version {proposal.versionHistory.length}</span>
                </div>
              </div>
              <button className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-500 hover:text-zinc-950 transition-all cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Revision upload form panel */}
          {showRevisionForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-md space-y-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-50 pb-3">
                <h3 className="text-base font-extrabold text-zinc-900">Upload Revision Version</h3>
                <button onClick={() => setShowRevisionForm(false)} className="text-xs font-bold text-zinc-400 hover:text-zinc-600">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmitRevision} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Select PDF File</label>
                  {!revisionFileName ? (
                    <label className="border border-dashed border-zinc-200 hover:border-zinc-350 bg-zinc-50/50 hover:bg-zinc-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleUploadRevisionFile}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Upload className="w-5 h-5 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-600">{isUploading ? 'Uploading...' : 'Choose PDF document'}</span>
                    </label>
                  ) : (
                    <div className="p-3 border border-zinc-200 bg-zinc-50/30 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-zinc-700 font-bold max-w-[180px] truncate">{revisionFileName}</span>
                      <button type="button" onClick={() => setRevisionFileName('')} className="text-zinc-400 hover:text-rose-500">
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Revision Description</label>
                  <textarea
                    value={revisionDesc}
                    onChange={(e) => setRevisionDesc(e.target.value)}
                    placeholder="Describe what changes were made in this version brief..."
                    rows={4}
                    className="w-full p-3 border border-zinc-200 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium text-zinc-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all mt-2 cursor-pointer"
                >
                  Submit Revision Brief
                </button>
              </form>
            </motion.div>
          )}
        </div>

        {/* Right pane: timeline Stepper tracking, previous versions, discussion comment uploader */}
        <div className="space-y-6">
          {/* Version Logs history */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Version Logs</h3>
            <div className="space-y-3.5">
              {proposal.versionHistory.map((ver) => (
                <div
                  key={ver.version}
                  className="flex items-center justify-between text-xs border-b border-zinc-50 pb-2 last:border-0 last:pb-0 text-left"
                >
                  <div>
                    <p className="font-extrabold text-zinc-800">Version {ver.version}</p>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">
                      {new Date(ver.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors">
                    <Download className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Timeline activity */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">
              Evaluation timeline
            </h3>
            <Timeline
              comments={proposal.comments}
              submissionDate={proposal.submissionDate}
              verificationStatus={proposal.verificationStatus}
              status={proposal.status}
              feedback={proposal.feedback}
            />

            {/* Direct message response */}
            <form onSubmit={handleAddComment} className="flex gap-2 border-t border-zinc-50 pt-4 mt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post message to coordinator..."
                className="flex-1 px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-2xl text-[11px] focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-semibold text-zinc-800"
              />
              <button type="submit" className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-colors cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
