'use client';

import React, { useState, useEffect } from 'react';
import { CMSService } from '@/services/cmsService';
import { CMSContentData } from '@/types/adminPortal';
import { Globe, Save, Edit, RefreshCw } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function CMSEditor() {
  const { showToast } = useToast();
  const [contents, setContents] = useState<CMSContentData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCMS = async () => {
    setIsLoading(true);
    const data = await CMSService.getCMSContent();
    setContents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const handleSave = async (id: string) => {
    if (!editVal.trim()) return;
    try {
      await CMSService.updateCMSContent(id, { content: editVal.trim() });
      showToast('CMS Landing block content updated!', 'success');
      setEditingId(null);
      await fetchCMS();
    } catch {
      showToast('Save failed', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">CMS Content Manager</h1>
        <p className="text-sm text-zinc-500 font-medium">Configure landing page block texts, homepage details, and FAQs logs</p>
      </div>

      {/* Editor list */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {contents.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-zinc-50 pb-3">
                <div className="space-y-1">
                  <span className="text-[9px] text-indigo-650 font-black uppercase tracking-wider block">{c.category}</span>
                  <h4 className="text-sm font-black text-zinc-900 leading-tight">{c.title}</h4>
                </div>
                {editingId === c.id ? (
                  <button
                    onClick={() => handleSave(c.id)}
                    className="py-1 px-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 focus:outline-none"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditVal(c.content);
                    }}
                    className="py-1 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 focus:outline-none"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Block
                  </button>
                )}
              </div>

              {editingId === c.id ? (
                <textarea
                  rows={3}
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  className="w-full p-3 border border-zinc-200 bg-zinc-50/50 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-zinc-800 leading-relaxed"
                />
              ) : (
                <p className="text-xs text-zinc-600 font-semibold leading-relaxed whitespace-pre-line">{c.content}</p>
              )}

              <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-semibold pt-1">
                <span>Last updated by: {c.lastUpdatedBy}</span>
                <span>•</span>
                <span>{new Date(c.lastUpdatedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
