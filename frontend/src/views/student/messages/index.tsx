'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Message, Conversation } from '@/types/studentPortal';
import { MessageService } from '@/services/messageService';
import { UploadService } from '@/services/uploadService';
import { Send, FileText, CheckCheck, MessageSquare, AlertCircle, Paperclip, Image as ImageIcon, Pin, Search, X } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/auth-provider';
import { io, Socket } from 'socket.io-client';

export default function MessagesChat() {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Real-time socket states
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});
  
  // Attachment states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; url: string } | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial conversations
  const fetchConvs = async () => {
    try {
      const list = await MessageService.getConversations();
      setConversations(list);
      if (list.length > 0 && !activeConv) {
        setActiveConv(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConvs();
  }, []);

  // Establish socket.io connection
  useEffect(() => {
    if (!user?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socket = io(`${socketUrl}/messages`, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Messages namespace via Socket.IO');
      socket.emit('presence:online', { userId: user.id });
    });

    socket.on('message', (msg: any) => {
      // If message is in currently open chat window
      if (activeConv && msg.conversationId === activeConv.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id || Math.random().toString(),
            senderId: msg.senderId,
            senderName: msg.senderName || '',
            text: msg.content,
            fileUrl: msg.attachments?.[0]?.fileUrl,
            fileName: msg.attachments?.[0]?.fileName,
            createdAt: msg.createdAt || new Date().toISOString(),
            isMe: msg.senderId === user.id
          }
        ]);
        // Auto mark read
        MessageService.markConversationRead(activeConv.id);
      } else {
        // Trigger alert and refresh unread counts
        fetchConvs();
      }
    });

    socket.on('typing', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (activeConv && data.conversationId === activeConv.id && data.userId !== user.id) {
        setIsOtherTyping(data.isTyping);
      }
    });

    socket.on('presence:update', (data: { userId: string; online: boolean }) => {
      setPresenceMap((prev) => ({ ...prev, [data.userId]: data.online }));
    });

    return () => {
      socket.disconnect();
    };
  }, [activeConv, user?.id]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      const msgs = await MessageService.getMessages(activeConv.id, user?.id);
      setMessages(msgs);
      setIsOtherTyping(false);
      await MessageService.markConversationRead(activeConv.id);
      
      // Update local unread indicator
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConv.id ? { ...c, unreadCount: 0 } : c))
      );
    };
    fetchMsgs();
  }, [activeConv]);

  // Scroll to bottom of chat list
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(e.target.value);
    
    if (socketRef.current && activeConv) {
      socketRef.current.emit('typing', {
        conversationId: activeConv.id,
        userId: user?.id,
        isTyping: true
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', {
          conversationId: activeConv.id,
          userId: user?.id,
          isTyping: false
        });
      }, 2000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const url = await UploadService.uploadFile(file);
      setAttachedFile({ name: file.name, url });
      showToast('File attachment uploaded successfully!', 'success');
    } catch {
      showToast('Attachment upload failed. Check file dimensions/type.', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!typedMessage.trim() && !attachedFile) || !activeConv) return;

    try {
      const newMsg = await MessageService.sendMessage(activeConv.id, typedMessage.trim(), attachedFile || undefined);
      
      // Sync local state
      setMessages((prev) => [
        ...prev,
        {
          ...newMsg,
          fileUrl: attachedFile?.url,
          fileName: attachedFile?.name
        }
      ]);
      setTypedMessage('');
      setAttachedFile(null);

      // Notify other room participants
      if (socketRef.current) {
        socketRef.current.emit('message', {
          conversationId: activeConv.id,
          senderId: user?.id,
          content: typedMessage.trim(),
          attachments: attachedFile ? [{ fileName: attachedFile.name, fileUrl: attachedFile.url }] : []
        });
      }
    } catch {
      showToast('Message delivery failed.', 'error');
    }
  };

  const filteredConvs = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'STUDENT INNOVATOR':
        return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'COORDINATOR':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-zinc-150 text-zinc-650 border-zinc-200';
    }
  };

  const isImageFile = (url?: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="border border-zinc-150 bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl h-[calc(100vh-140px)] flex select-none text-left">
      {/* Left List Pane */}
      <div className="w-80 border-r border-zinc-100 flex flex-col justify-between shrink-0 h-full bg-white">
        <div className="p-4 border-b border-zinc-50 shrink-0 space-y-3">
          <h2 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider">Ecosystem Liaison</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-150 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold text-zinc-800"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
          {filteredConvs.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            const isOnline = presenceMap[conv.id] || conv.online;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`p-4 flex items-start gap-3 transition-all duration-200 cursor-pointer text-left relative ${
                  isActive ? 'bg-zinc-50/70 border-l-4 border-violet-600' : 'hover:bg-zinc-50/40'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 font-black flex items-center justify-center text-xs">
                    {conv.participantName.slice(0, 2).toUpperCase()}
                  </div>
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-xs font-black text-zinc-950 truncate">{conv.participantName}</p>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-violet-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-block text-[8px] font-bold border rounded px-1.5 py-0.2 uppercase mt-1 tracking-wider ${getRoleColor(conv.participantRole)}`}
                  >
                    {conv.participantRole}
                  </span>
                  <p className="text-[11px] text-zinc-400 font-medium truncate mt-1.5 leading-normal">{conv.lastMessageText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col justify-between h-full bg-zinc-50/10">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="h-14 px-6 border-b border-zinc-100 bg-white/90 flex items-center justify-between shrink-0">
              <div className="text-left leading-tight">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-extrabold text-zinc-950">{activeConv.participantName}</p>
                  {(presenceMap[activeConv.id] || activeConv.online) && (
                    <span className="w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
                  )}
                </div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5 block">
                  {activeConv.participantRole}
                </span>
              </div>
            </div>

            {/* Message Bubble Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isStudent = msg.isMe;
                return (
                  <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%] text-left space-y-1">
                      <div
                        className={`p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                          isStudent
                            ? 'bg-zinc-900 text-white rounded-tr-none'
                            : 'bg-white border border-zinc-150 text-zinc-800 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.text}

                        {/* Inline File Previewer */}
                        {msg.fileUrl && (
                          <div className="mt-3 pt-3 border-t border-zinc-100/10 text-left">
                            {isImageFile(msg.fileUrl) ? (
                              <div className="rounded-2xl overflow-hidden border border-zinc-200/20 max-w-sm">
                                <img src={msg.fileUrl} className="object-cover max-h-48 w-full" alt="Attachment" />
                              </div>
                            ) : (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-xl text-[11px] font-bold tracking-tight inline-flex"
                              >
                                <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                                <span className="truncate max-w-[150px]">{msg.fileName || 'Attachment.pdf'}</span>
                              </a>
                            )}
                          </div>
                        )}
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

              {/* Typing Indicator */}
              {isOtherTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 border border-zinc-200/50 px-4 py-2.5 rounded-3xl rounded-tl-none flex items-center gap-1.5 text-[11px] text-zinc-400 font-bold">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-[10px] text-zinc-400 font-semibold">typing...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Attachment and Message box */}
            <div className="p-4 bg-white border-t border-zinc-150 space-y-3 shrink-0">
              {attachedFile && (
                <div className="flex items-center justify-between p-2 bg-violet-50/70 border border-violet-100 rounded-2xl text-xs font-semibold text-violet-850">
                  <div className="flex items-center gap-2">
                    {isImageFile(attachedFile.url) ? (
                      <ImageIcon className="w-4 h-4 text-violet-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-violet-600" />
                    )}
                    <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="text-violet-650 hover:text-rose-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="p-3 border border-zinc-200 hover:bg-zinc-50 rounded-2xl text-zinc-500 hover:text-zinc-800 transition-colors focus:outline-none cursor-pointer"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  value={typedMessage}
                  onChange={handleInputChange}
                  placeholder={uploadingFile ? 'Uploading attachment...' : 'Type your message...'}
                  className="flex-1 px-4 py-3 border border-zinc-200 bg-zinc-50/50 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all font-semibold text-zinc-800"
                  disabled={uploadingFile}
                />
                
                <button
                  type="submit"
                  className="py-3 px-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer focus:outline-none"
                  disabled={uploadingFile}
                >
                  Send <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-white">
            <MessageSquare className="w-8 h-8 text-zinc-300 animate-pulse" />
            <p className="text-xs text-zinc-400 font-bold">Select a liaison coordinator to exchange messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
