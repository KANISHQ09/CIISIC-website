'use client';

import React, { useState, useEffect } from 'react';
import { Send, Search, EyeOff, Bot, Paperclip, MessageSquare } from 'lucide-react';
import useToast from '@/hooks/useToast';

interface Message {
  id: string;
  sender: 'INDUSTRY' | 'STUDENT';
  content: string;
  timestamp: string;
}

interface Thread {
  id: string;
  candidateCode: string;
  challengeTitle: string;
  messages: Message[];
  unread: boolean;
}

export default function AnonymousChat() {
  const { showToast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const initialThreads: Thread[] = [
      {
        id: 't1',
        candidateCode: 'Solver-C481',
        challengeTitle: 'IoT Soil Moisture Telemetry Optimizations',
        unread: true,
        messages: [
          {
            id: 'm1',
            sender: 'STUDENT',
            content: 'Hi, I updated the PCB telemetry schematics to include the new low-pass filters. Could you review?',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      },
      {
        id: 't2',
        candidateCode: 'Solver-D982',
        challengeTitle: 'Bio-Fuel Catalyst Viscosity Enhancement',
        unread: false,
        messages: [
          {
            id: 'm2',
            sender: 'STUDENT',
            content: 'Hello, we tested the surfactant variables. The viscosity logs were uploaded as version 2.',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      }
    ];
    setThreads(initialThreads);
    setActiveThreadId(initialThreads[0].id);
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeThread) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'INDUSTRY',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [...t.messages, newMsg] };
      }
      return t;
    });

    setThreads(updatedThreads);
    setInputMessage('');

    // Trigger mock student response delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const studentReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'STUDENT',
        content: `Got it! I will audit the specifications you mentioned and submit the revised version by tomorrow.`,
        timestamp: new Date().toISOString()
      };

      setThreads((current) =>
        current.map((t) => {
          if (t.id === activeThreadId) {
            return { ...t, messages: [...t.messages, studentReply] };
          }
          return t;
        })
      );
      showToast('New message received from student.', 'info');
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex border border-zinc-150 rounded-3xl overflow-hidden bg-white shadow-sm select-none text-left">
      {/* Threads Sidebar */}
      <div className="w-80 border-r border-zinc-100 flex flex-col justify-between h-full bg-zinc-50/20">
        <div className="p-4 border-b border-zinc-100 space-y-3">
          <h3 className="text-sm font-extrabold text-zinc-900">Anonymous Threads</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
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
                  isSelected ? 'bg-zinc-50/70 border-l-2 border-blue-500' : 'hover:bg-zinc-50/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-800 text-xs">
                    <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t.candidateCode}</span>
                  </div>
                  {t.unread && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider line-clamp-1">{t.challengeTitle}</p>
                {lastMsg && <p className="text-[11px] text-zinc-500 font-medium line-clamp-1">{lastMsg.content}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Conversation window */}
      {activeThread ? (
        <div className="flex-1 flex flex-col justify-between h-full bg-white">
          {/* Active Conversation Header */}
          <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/10">
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-zinc-900">{activeThread.candidateCode}</h4>
                <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.2 rounded border border-blue-100 uppercase">
                  Solver Active
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5 line-clamp-1">
                {activeThread.challengeTitle}
              </span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeThread.messages.map((msg) => {
              const isIndustry = msg.sender === 'INDUSTRY';
              return (
                <div key={msg.id} className={`flex ${isIndustry ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs font-medium leading-relaxed text-left ${
                      isIndustry ? 'bg-zinc-950 text-white rounded-tr-none' : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-[8px] block text-right mt-1.5 ${isIndustry ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 text-zinc-500 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs font-bold">
                  <Bot className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
                  <span>Student is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form write panel */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 flex items-center gap-3 bg-zinc-50/10">
            <button type="button" className="p-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 rounded-xl">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message anonymized..."
              className="flex-1 px-4 py-3 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
            />
            <button
              type="submit"
              className="py-3 px-5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-zinc-400 space-y-2">
          <MessageSquare className="w-8 h-8 text-zinc-300" />
          <p className="text-xs font-bold">Select a thread to view conversation.</p>
        </div>
      )}
    </div>
  );
}
