'use client';

import React, { useState } from 'react';
import { Send, Search, Users, ShieldAlert, Paperclip, MessageSquare } from 'lucide-react';
import useToast from '@/hooks/useToast';

interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
}

interface Thread {
  id: string;
  label: string;
  description: string;
  messages: Message[];
  unread: boolean;
}

export default function InstitutionMessages() {
  const { showToast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 'it1',
      label: 'Student Mentorship: Soil Moisture Telemetry',
      description: 'Chat with Madhavan Singh & Dr. Verma',
      unread: true,
      messages: [
        {
          id: 'im1',
          senderName: 'Madhavan Singh',
          senderRole: 'Student',
          content: 'Prof. Verma, we compiled the SF10 configuration logs. The battery is drawing 1.15mA.',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    },
    {
      id: 'it2',
      label: 'Industry SPOC Coord: Netlink Technologies',
      description: 'Channel with Netlink SPOC Amit Saxena',
      unread: false,
      messages: [
        {
          id: 'im2',
          senderName: 'Amit Saxena',
          senderRole: 'Industry SPOC',
          content: 'The telemetry moisture PCB looks highly promising. We will begin physical board vetting next week.',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('it1');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeThread) return;

    setIsSending(true);
    setTimeout(() => {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderName: 'Prof. Verma',
        senderRole: 'College Coordinator',
        content: inputMessage.trim(),
        timestamp: new Date().toISOString()
      };

      setThreads(
        threads.map((t) => {
          if (t.id === activeThreadId) {
            return { ...t, messages: [...t.messages, newMsg] };
          }
          return t;
        })
      );

      setInputMessage('');
      setIsSending(false);
      showToast('Message posted to thread.', 'success');
    }, 500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex border border-zinc-150 rounded-3xl overflow-hidden bg-white shadow-sm select-none text-left">
      {/* Sidebar of message boards */}
      <div className="w-80 border-r border-zinc-100 flex flex-col justify-between h-full bg-zinc-50/20">
        <div className="p-4 border-b border-zinc-100 space-y-3">
          <h3 className="text-sm font-extrabold text-zinc-900">Coordination Channels</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chat boards..."
              className="pl-9 pr-4 py-2 w-full border border-zinc-200 bg-white rounded-xl text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
          {threads.map((t) => {
            const isSelected = t.id === activeThreadId;
            const lastMsg = t.messages[t.messages.length - 1];
            return (
              <div
                key={t.id}
                onClick={() => {
                  setActiveThreadId(t.id);
                  t.unread = false;
                }}
                className={`p-4 text-left leading-normal space-y-1.5 transition-all cursor-pointer ${
                  isSelected ? 'bg-zinc-50/70 border-l-2 border-indigo-500' : 'hover:bg-zinc-50/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-zinc-800 text-xs line-clamp-1">{t.label}</span>
                  {t.unread && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                </div>
                <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">{t.description}</p>
                {lastMsg && <p className="text-[11px] text-zinc-500 font-semibold truncate block">{lastMsg.content}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Messaging thread panel */}
      {activeThread ? (
        <div className="flex-1 flex flex-col justify-between h-full bg-white">
          <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/10">
            <div className="text-left leading-tight">
              <h4 className="text-xs font-black text-zinc-900">{activeThread.label}</h4>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mt-1">{activeThread.description}</span>
            </div>
          </div>

          {/* Chat bubbles */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeThread.messages.map((msg) => {
              const isSelf = msg.senderName === 'Prof. Verma';
              return (
                <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs font-semibold leading-relaxed text-left ${
                      isSelf ? 'bg-zinc-950 text-white rounded-tr-none' : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                    }`}
                  >
                    <p className={`text-[9px] font-bold pb-1 block ${isSelf ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {msg.senderName} ({msg.senderRole})
                    </p>
                    <p>{msg.content}</p>
                    <span className="text-[8px] block text-right mt-1.5 text-zinc-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form sender */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 flex items-center gap-3 bg-zinc-50/10">
            <button type="button" className="p-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 rounded-xl">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send message to thread..."
              className="flex-1 px-4 py-3 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
            />
            <button
              type="submit"
              disabled={isSending}
              className="py-3 px-5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              Send Message <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-zinc-400 space-y-2">
          <MessageSquare className="w-8 h-8 text-zinc-300" />
          <p className="text-xs font-bold">Select a message board thread to start chatting.</p>
        </div>
      )}
    </div>
  );
}
