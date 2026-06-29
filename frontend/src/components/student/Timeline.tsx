import React from 'react';
import { DiscussionMessage } from '@/types/studentPortal';
import { MessageSquare, ArrowUpCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  children?: React.ReactNode;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ icon, title, subtitle, time, children, isLast = false }) => {
  return (
    <div className="flex gap-4 group">
      {/* Icon & Connection Line */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600 shadow-sm shrink-0">
          {icon}
        </div>
        {!isLast && <div className="w-[1.5px] bg-zinc-100 grow my-1 group-last:hidden" />}
      </div>

      {/* Content */}
      <div className="space-y-1.5 pb-6 text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-900">{title}</span>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{subtitle}</span>
          <span className="text-[10px] text-zinc-400 font-bold">•</span>
          <span className="text-[10px] text-zinc-400 font-bold">{time}</span>
        </div>
        {children && <div className="text-xs text-zinc-600 leading-relaxed">{children}</div>}
      </div>
    </div>
  );
};

interface TimelineProps {
  comments?: DiscussionMessage[];
  submissionDate: string;
  verificationStatus: string;
  status: string;
  feedback?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ comments = [], submissionDate, verificationStatus, status, feedback }) => {
  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'REVISION_REQUESTED':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'SUBMITTED':
      case 'INSTITUTION_VERIFIED':
        return <ArrowUpCircle className="w-4 h-4 text-violet-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-zinc-500" />;
    }
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleString();
  };

  return (
    <div className="space-y-1">
      {/* Stage 1: Submitted */}
      <TimelineItem
        icon={<ArrowUpCircle className="w-4 h-4 text-zinc-500" />}
        title="Proposal Submitted"
        subtitle="Student Action"
        time={formatDate(submissionDate)}
      >
        Initial document version uploaded for review.
      </TimelineItem>

      {/* Stage 2: Institution Verification */}
      <TimelineItem
        icon={
          verificationStatus === 'APPROVED' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <ArrowUpCircle className="w-4 h-4 text-zinc-400" />
          )
        }
        title={verificationStatus === 'APPROVED' ? 'Institution Approved' : 'Institution Verification Pending'}
        subtitle="Excellence Cell"
        time={formatDate(submissionDate)}
      >
        {verificationStatus === 'APPROVED'
          ? 'Excellence Cell coordinator has approved the credentials and routed the proposal to the industry partner.'
          : 'Pending academic verification by college coordinator.'}
      </TimelineItem>

      {/* Discussions and feedback logs */}
      {comments.map((comment, index) => (
        <TimelineItem
          key={comment.id}
          icon={getStatusIcon(comment.authorRole === 'Student' ? 'SUBMITTED' : 'COMMENT')}
          title={comment.authorName}
          subtitle={comment.authorRole}
          time={formatDate(comment.createdAt)}
          isLast={index === comments.length - 1 && !feedback}
        >
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3.5 mt-1 max-w-lg font-medium text-zinc-800">
            {comment.content}
          </div>
        </TimelineItem>
      ))}

      {/* Final Stage: Industry feedback/Acceptance */}
      {feedback && (
        <TimelineItem
          icon={getStatusIcon(status)}
          title="Review Evaluation Update"
          subtitle="Industry Response"
          time="Recently"
          isLast={true}
        >
          <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 mt-1 max-w-lg text-zinc-800">
            <p className="font-bold text-violet-800 text-[11px] uppercase tracking-wider mb-1">Feedback Summary</p>
            <p className="font-medium">{feedback}</p>
          </div>
        </TimelineItem>
      )}
    </div>
  );
};
