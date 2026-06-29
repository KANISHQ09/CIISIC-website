'use client';

import React, { useEffect, useState } from 'react';
import { Challenge } from '@/types/studentPortal';
import { ChallengeService } from '@/services/challengeService';
import { ChallengeCard } from '@/components/student/ChallengeCard';
import { CardSkeleton } from '@/components/student/Skeletons';
import { Bookmark, AlertCircle } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function BookmarksExplorer() {
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const data = await ChallengeService.getSavedChallenges();
      setBookmarks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = async (id: string) => {
    await ChallengeService.toggleBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Challenge removed from bookmarks.', 'info');
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Bookmarked Briefs</h1>
        <p className="text-sm text-zinc-500 font-medium">Manage and review your saved industrial challenge briefs</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <Bookmark className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">No Saved Briefs</h3>
            <p className="text-xs text-zinc-400 font-medium">Browse challenges and bookmark them to save for later.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((c) => (
            <ChallengeCard key={c.id} challenge={c} isBookmarked={true} onBookmarkToggle={() => handleBookmarkToggle(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
