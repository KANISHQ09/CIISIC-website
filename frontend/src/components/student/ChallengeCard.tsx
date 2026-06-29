import React from 'react';
import { Challenge } from '@/types/studentPortal';
import { StatusBadge } from './StatusBadge';
import { Calendar, Users, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChallengeService } from '@/services/challengeService';
import { useRouter } from 'next/navigation';

interface ChallengeCardProps {
  challenge: Challenge;
  onBookmarkToggle?: () => void;
  isBookmarked?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onBookmarkToggle, isBookmarked = false }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/challenges/${challenge.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-zinc-150 rounded-2xl p-5 flex flex-col justify-between h-full hover:border-zinc-300 transition-all group cursor-pointer shadow-sm"
      onClick={handleCardClick}
    >
      <div className="space-y-4">
        {/* Card Header: Category & Bookmark */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 bg-zinc-100/80 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {challenge.category}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle?.();
            }}
            className="p-1.5 rounded-lg border border-zinc-150 hover:bg-neutral-50 hover:border-zinc-350 transition-colors text-neutral-500 hover:text-neutral-900 focus:outline-none"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-violet-600 fill-violet-50/20" />
            ) : (
              <Bookmark className="w-4 h-4 text-neutral-400" />
            )}
          </button>
        </div>

        {/* Company info & title */}
        <div className="space-y-2 text-left">
          <h3 className="text-base font-extrabold text-zinc-900 group-hover:text-violet-600 transition-colors line-clamp-1">
            {challenge.title}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{challenge.description}</p>
        </div>

        {/* Company & Institution badge */}
        <div className="flex items-center gap-3">
          {challenge.companyLogo ? (
            <img src={challenge.companyLogo} alt="logo" className="w-9 h-9 rounded-xl object-cover border border-zinc-100" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-xs">
              {challenge.companyName.slice(0, 2)}
            </div>
          )}
          <div className="text-left leading-tight">
            <p className="text-xs font-bold text-zinc-800">{challenge.companyName}</p>
            <p className="text-[10px] text-zinc-400 font-medium">{challenge.institutionName || 'Ecosystem Cell'}</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-zinc-100 pt-4 mt-4 flex items-center justify-between text-[11px] font-bold text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>Deadline: {challenge.deadline}</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={challenge.difficulty} />
        </div>
      </div>
    </motion.div>
  );
};
