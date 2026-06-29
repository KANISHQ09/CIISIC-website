'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Message, Conversation } from '@/types/studentPortal';
import { MessageService } from '@/services/messageService';
import { Send, FileText, CheckCheck, MessageSquare, AlertCircle } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { motion } from 'framer-motion';

export default function MessagesChat() {
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch initial conversations list
  useEffect(() => {
    const fetchConvs = async () => {
      setIsLoading(true);
      try {
        const list = await MessageService.getConversations();
        setConversations(list);
        if (list.length > 0) {
          setActiveConv(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConvs();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      const msgs = await MessageService.getMessages(activeConv.id);
      setMessages(msgs);

      // Mark read
      await MessageService.markConversationRead(activeConv.id);

      // Update conversations list badge counts
      const updatedList = await MessageService.getConversations();
      setConversations(updatedList);
    };
    fetchMsgs();
  }, [activeConv]);

  // Scroll to bottom of chat container
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeConv) return;

    try {
      const newMsg = await MessageService.sendMessage(activeConv.id, typedMessage.trim(), 'student');
      setMessages((prev) => [...prev, newMsg]);
      setTypedMessage('');

      // Refresh last message preview in list
      const list = await MessageService.getConversations();
      setConversations(list);

      // Simulate SPOC reply 1.5 seconds later
      setTimeout(async () => {
        const reply = await MessageService.simulateReply(activeConv.id);
        setMessages((prev) => [...prev, reply]);
        const listRefresh = await MessageService.getConversations();
        setConversations(listRefresh);
        showToast(`New message from ${activeConv.participantName}`, 'info');
      }, 1500);
    } catch {
      showToast('Failed to deliver message', 'error');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'SPOC':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'COORDINATOR':
        return 'bg-violet-50 text-violet-700 border-violet-100';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="border border-zinc-150 bg-white rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-140px)] flex select-none text-left">
      {/* Left panel: Conversations list */}
      <div className="w-80 border-r border-zinc-100 flex flex-col justify-between shrink-0 h-full">
        <div className="p-4 border-b border-zinc-100 shrink-0">
          <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Ecosystem Liaison</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
          {conversations.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`p-4 flex items-start gap-3 transition-colors cursor-pointer text-left ${
                  isActive ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-sm shrink-0">
                  {conv.participantName.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-zinc-800 truncate">{conv.participantName}</p>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-violet-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-block text-[8px] font-bold border rounded px-1.5 py-0.2 uppercase mt-1 tracking-wider ${getRoleBadge(conv.participantRole)}`}
                  >
                    {conv.participantRole}
                  </span>
                  <p className="text-[11px] text-zinc-400 font-medium truncate mt-1.5">{conv.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel: Active chat window */}
      <div className="flex-1 flex flex-col justify-between h-full bg-zinc-50/20">
        {activeConv ? (
          <>
            {/* Header info */}
            <div className="h-14 px-6 border-b border-zinc-100 bg-white flex items-center justify-between shrink-0">
              <div className="text-left leading-tight">
                <p className="text-xs font-extrabold text-zinc-900">{activeConv.participantName}</p>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{activeConv.participantCompany}</span>
              </div>
            </div>

            {/* Messages box list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isStudent = msg.sender === 'student';
                return (
                  <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%] text-left space-y-1">
                      <div
                        className={`p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                          isStudent
                            ? 'bg-zinc-950 text-white rounded-tr-none'
                            : 'bg-white border border-zinc-150 text-zinc-800 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-[9px] text-zinc-400 font-bold ${isStudent ? 'justify-end' : 'justify-start'}`}
                      >
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isStudent && <CheckCheck className="w-3 h-3 text-violet-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input message uploader bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-zinc-150 flex gap-3 shrink-0">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-zinc-200 bg-zinc-50/50 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all font-semibold text-zinc-800"
              />
              <button
                type="submit"
                className="py-3 px-5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <MessageSquare className="w-8 h-8 text-zinc-300" />
            <p className="text-xs text-zinc-400 font-bold">Select a conversation to start chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
