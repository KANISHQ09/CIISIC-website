'use client';

import React, { useEffect, useState } from 'react';
import { Challenge } from '@/types/studentPortal';
import { ChallengeService } from '@/services/challengeService';
import { ChallengeCard } from '@/components/student/ChallengeCard';
import { CardSkeleton, ListSkeleton } from '@/components/student/Skeletons';
import { Search, Grid, List, SlidersHorizontal, BookOpen, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function ChallengeExplorer() {
  const { showToast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const list = await ChallengeService.getChallenges();
        setChallenges(list);

        // Fetch bookmarked IDs
        const saved = await ChallengeService.getSavedChallenges();
        setBookmarks(saved.map((s) => s.id));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookmarkToggle = async (id: string) => {
    const bookmarked = await ChallengeService.toggleBookmark(id);
    if (bookmarked) {
      setBookmarks([...bookmarks, id]);
      showToast('Challenge bookmarked successfully!', 'success');
    } else {
      setBookmarks(bookmarks.filter((bId) => bId !== id));
      showToast('Challenge bookmark removed.', 'info');
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty = filterDifficulty === 'ALL' || c.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'ALL' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesBookmark = !showBookmarksOnly || bookmarks.includes(c.id);

    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus && matchesBookmark;
  });

  const categories = Array.from(new Set(challenges.map((c) => c.category)));

  return (
    <div className="space-y-6 text-left pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Challenge Explorer</h1>
          <p className="text-sm text-zinc-500 font-medium">Browse open industrial challenges and publish solutions</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Grid/List View Toggles */}
          <div className="p-1 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'GRID' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'LIST' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98] ${
              showFiltersPanel
                ? 'border-violet-500 bg-violet-50/50 text-violet-600'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFiltersPanel && (
        <div className="bg-white border border-zinc-150 rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Search & Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, industry, tech stack or required skills..."
            className="w-full pl-10 pr-4 py-3 border border-zinc-200 bg-white rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold text-zinc-800"
          />
        </div>

        {/* Saved challenges toggles */}
        <div className="p-1 bg-zinc-100 rounded-2xl border border-zinc-200 flex items-center shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowBookmarksOnly(false)}
            className={`flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              !showBookmarksOnly ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            All Challenges
          </button>
          <button
            type="button"
            onClick={() => setShowBookmarksOnly(true)}
            className={`flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              showBookmarksOnly ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Bookmarked ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Challenges Grid/List Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3">
          <AlertCircle className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">No Challenges Found</h3>
            <p className="text-xs text-zinc-400 font-medium">Try clearing filters or search terms.</p>
          </div>
        </div>
      ) : viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              isBookmarked={bookmarks.includes(c.id)}
              onBookmarkToggle={() => handleBookmarkToggle(c.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((c) => (
            <div
              key={c.id}
              onClick={() => router.push(`/challenges/${c.id}`)}
              className="p-5 border border-zinc-150 bg-white hover:border-zinc-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-sm cursor-pointer transition-all text-left"
            >
              <div className="flex items-start gap-4">
                {c.companyLogo ? (
                  <img src={c.companyLogo} className="w-12 h-12 object-cover rounded-xl border border-zinc-100 shrink-0" alt="logo" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 font-extrabold flex items-center justify-center text-sm shrink-0">
                    {c.companyName.slice(0, 2)}
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{c.category}</span>
                  <h3 className="text-base font-extrabold text-zinc-900 leading-snug">{c.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 font-medium">
                    <span>{c.companyName}</span>
                    <span>•</span>
                    <span>Deadline: {c.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(c.id);
                  }}
                  className="p-2 border border-zinc-150 rounded-xl hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-all focus:outline-none cursor-pointer"
                >
                  {bookmarks.includes(c.id) ? <BookmarkCheck className="w-4 h-4 text-violet-600" /> : <Bookmark className="w-4 h-4" />}
                </button>
                <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 font-bold border border-zinc-200">
                  {c.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
