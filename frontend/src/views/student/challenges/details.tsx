'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Challenge } from '@/types/studentPortal';
import { ChallengeService } from '@/services/challengeService';
import { StudentService } from '@/services/studentService';
import { StatusBadge } from '@/components/student/StatusBadge';
import {
  Calendar,
  Building,
  GraduationCap,
  Download,
  Send,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  FileText
} from 'lucide-react';
import useToast from '@/hooks/useToast';
import { motion } from 'framer-motion';

export default function ChallengeDetails() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const challengeId = params?.id as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!challengeId) return;
      setIsLoading(true);
      try {
        const item = await ChallengeService.getChallengeById(challengeId);
        setChallenge(item);
        if (item) {
          setIsSaved(ChallengeService.isBookmarked(item.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [challengeId]);

  const handleBookmarkToggle = async () => {
    if (!challenge) return;
    const bookmarked = await ChallengeService.toggleBookmark(challenge.id);
    setIsSaved(bookmarked);
    if (bookmarked) {
      showToast('Challenge bookmarked!', 'success');
    } else {
      showToast('Bookmark removed.', 'info');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !challenge) return;

    try {
      const student = await StudentService.getProfile();
      const updated = await ChallengeService.addDiscussionComment(challenge.id, student.name, 'Student', commentText.trim());
      if (updated) {
        setChallenge(updated);
        setCommentText('');
        showToast('Comment posted successfully!', 'success');
      }
    } catch {
      showToast('Failed to post comment', 'error');
    }
  };

  const getDifficultyBg = (dif: string) => {
    switch (dif) {
      case 'HARD':
        return 'bg-rose-50 border-rose-100 text-rose-700';
      case 'MEDIUM':
        return 'bg-blue-50 border-blue-100 text-blue-700';
      default:
        return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    }
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
      <div className="text-center py-16 space-y-4">
        <p className="text-zinc-500 font-bold">Challenge brief not found.</p>
        <button onClick={() => router.push('/challenges')} className="text-xs text-violet-600 hover:underline">
          Go back to explorer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back link */}
      <button
        onClick={() => router.push('/challenges')}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to explorer
      </button>

      {/* Hero Header Card */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-zinc-100/80 rounded-lg text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">
              {challenge.category}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border uppercase tracking-wider ${getDifficultyBg(challenge.difficulty)}`}
            >
              {challenge.difficulty} Difficulty
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-tight">{challenge.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-zinc-400" />
              <span>Sponsor: {challenge.companyName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4.5 h-4.5 text-zinc-400" />
              <span>Mentor cell: {challenge.institutionName || 'Regional Office'}</span>
            </div>
          </div>
        </div>

        {/* Actions header */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2.5 border rounded-2xl transition-all cursor-pointer ${
              isSaved
                ? 'border-violet-500 bg-violet-50 text-violet-600'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-400 hover:text-zinc-800'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          {challenge.status === 'OPEN' ? (
            <button
              onClick={() => router.push(`/challenges/${challenge.id}/submit`)}
              className="py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
            >
              Apply Challenge <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="py-3 px-6 bg-zinc-100 border border-zinc-200 text-zinc-400 rounded-2xl text-xs font-bold transition-all cursor-default"
            >
              Challenge Closed
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout Detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Brief details & discussions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Description */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Challenge Brief</h2>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">{challenge.description}</p>

            {/* Deliverables checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-wider">Required Deliverables</h4>
              <ul className="space-y-2">
                {challenge.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 leading-relaxed font-medium">
                    <span className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack badges */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-wider">Suggested Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {challenge.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold text-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Attachments & resources */}
          {challenge.attachments && challenge.attachments.length > 0 && (
            <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Reference Attachments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {challenge.attachments.map((att) => (
                  <div key={att.name} className="p-3 border border-zinc-150 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-zinc-400" />
                      <div className="text-left leading-tight">
                        <p className="text-xs font-bold text-zinc-800 max-w-[120px] truncate">{att.name}</p>
                        <span className="text-[10px] text-zinc-400 font-bold">{att.size}</span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs section */}
          {challenge.faqs && challenge.faqs.length > 0 && (
            <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {challenge.faqs.map((faq) => (
                  <div key={faq.question} className="space-y-1.5 text-left border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-bold text-zinc-800">Q: {faq.question}</p>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussions board */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight border-b border-zinc-50 pb-3">Discussions Thread</h2>

            {/* Comment write box */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask Dr. Mishra or the industry SPOC a question..."
                className="flex-1 px-4 py-3 border border-zinc-200 bg-zinc-50/50 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white font-medium text-zinc-800"
              />
              <button
                type="submit"
                className="p-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl transition-colors cursor-pointer focus:outline-none"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>

            {/* Comment list */}
            {!challenge.discussion || challenge.discussion.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">No discussion posts yet. Be the first to ask a query!</p>
            ) : (
              <div className="space-y-4 mt-2">
                {challenge.discussion.map((disc) => (
                  <div key={disc.id} className="flex items-start gap-3 text-left">
                    {disc.authorAvatar ? (
                      <img
                        src={disc.authorAvatar}
                        className="w-8 h-8 rounded-lg object-cover border border-zinc-100 shrink-0 mt-0.5"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {disc.authorName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-3 flex-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                        <div>
                          <span className="text-zinc-700 font-extrabold mr-1">{disc.authorName}</span>
                          <span className="px-1.5 py-0.2 bg-zinc-100 text-zinc-400 rounded-md uppercase tracking-wider text-[8px]">
                            {disc.authorRole}
                          </span>
                        </div>
                        <span>{new Date(disc.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-zinc-600 font-medium leading-relaxed pt-0.5">{disc.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Timeline steps, skills, SPOC metadata */}
        <div className="space-y-6">
          {/* Milestone timeline */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Milestone Stepper</h3>
            <div className="space-y-4 text-left border-l border-zinc-100 pl-4 relative ml-2">
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-violet-600" />
                <p className="text-xs font-bold text-zinc-800">Challenge Published</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">
                  {new Date(challenge.timeline.published).toLocaleDateString()}
                </p>
              </div>
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-violet-600" />
                <p className="text-xs font-bold text-zinc-800">Proposal Submission Deadline</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">
                  {new Date(challenge.timeline.submissionDeadline).toLocaleDateString()}
                </p>
              </div>
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <p className="text-xs font-bold text-zinc-800">Review Auditing Completed</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">
                  {new Date(challenge.timeline.reviewCompleted).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Prerequisite Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {challenge.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-[10px] font-bold border border-violet-100 uppercase tracking-wider"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* SPOC Contact profile card */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Liaison Information</h3>
            <div className="flex items-center gap-3 border-t border-zinc-50 pt-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-sm shrink-0">
                AS
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-extrabold text-zinc-800">Amit Saxena</p>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Industry Leader</span>
                <p className="text-[10px] text-violet-600 hover:underline cursor-pointer mt-0.5" onClick={() => router.push('/messages')}>
                  Send Direct Message
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
