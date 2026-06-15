/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, PlusCircle, Send, CheckCircle2 } from 'lucide-react';
import { ChatThread, ChatMessage } from '../types';

interface InboxTabProps {
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onMarkThreadAsRead: (threadId: string) => void;
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
}

export default function InboxTab({
  threads,
  onSendMessage,
  onMarkThreadAsRead,
  activeThreadId,
  setActiveThreadId
}: InboxTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Filter threads
  const filteredThreads = threads.filter(t => 
    t.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (activeThread) {
      onMarkThreadAsRead(activeThread.id);
    }
  }, [activeThread?.messages?.length, activeThread?.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    onSendMessage(activeThread.id, inputText.trim());
    setInputText('');

    // Simulated reply after 1.5 seconds
    const threadIdToSend = activeThread.id;
    const peerName = activeThread.participantName;
    
    setTimeout(() => {
      let replyWord = "Kedengarannya sempurna! Mari kunci jadwal itu. Sampai jumpa di lantai tiga perpustakaan.";
      if (peerName.includes('David')) {
        replyWord = "Senang Anda setuju! Saya akan memperbarui repo dan menggabungkan pull request.";
      } else if (peerName.includes('Elena')) {
        replyWord = "Bagus, beri tahu saya jika Anda ingin mereview rumus makroekonomi lagi.";
      } else if (peerName.includes('Marcus')) {
        replyWord = "Hebat, beri tahu saya saat Anda menandatangani kontrak, dan mari mulai silabus Kimia!";
      }

      onSendMessage(threadIdToSend, replyWord);
    }, 1500);
  };  return (
    <div className="pt-2 pb-6 px-0 md:px-2 max-w-7xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col md:grid md:grid-cols-12 gap-6 overflow-hidden animate-fadeIn">
      {/* Thread list panel */}
      <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
        {/* Search Bar query */}
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-mono">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari percakapan..."
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#1A1A1A] focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] outline-none text-xs font-mono uppercase tracking-wider text-[#1A1A1A] transition-all placeholder-[#1A1A1A]/40 rounded-none"
          />
        </div>

        {/* Dynamic contacts index */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px] md:max-h-full">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-10 bg-white border-2 border-[#1A1A1A] rounded-none">
              <p className="text-xs text-[#1A1A1A] font-mono font-bold uppercase tracking-wider">Tidak ada kontak yang cocok</p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThread?.id;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <div 
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    onMarkThreadAsRead(thread.id);
                  }}
                  className={`p-3 rounded-none flex items-center gap-3 cursor-pointer transition-all border-2 ${isSelected ? 'bg-white border-[#1A1A1A] shadow-[3px_3px_0px_#FF3E00]' : 'bg-transparent border-[#1A1A1A]/25 hover:bg-[#1A1A1A]/5'}`}
                >
                  <div className="relative shrink-0 select-none">
                    <img 
                      alt={thread.participantName} 
                      className="w-11 h-11 rounded-none object-cover border-2 border-[#1A1A1A]" 
                      src={thread.participantAvatar} 
                    />
                    {thread.participantStatus === 'Online' && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FF3E00] border border-[#1A1A1A] rounded-none" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-tight font-mono truncate leading-tight">
                        {thread.participantName}
                      </h3>
                      <span className="text-[9px] text-[#1A1A1A]/60 font-mono font-bold">{thread.lastMessageTime}</span>
                    </div>
                    <p className={`text-xs truncate ${thread.unread ? 'font-bold text-[#FF3E00] font-mono uppercase text-[10px]' : 'text-[#1A1A1A]/70 font-normal'}`}>
                      {lastMsg ? lastMsg.text : thread.lastMessage}
                    </p>
                  </div>

                  {thread.unread && (
                    <div className="w-2.5 h-2.5 bg-[#FF3E00] border border-[#1A1A1A] shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Primary chat workspace pane */}
      <div className="flex-1 md:col-span-8 lg:col-span-8 bg-white rounded-none border-2 border-[#1A1A1A] flex flex-col h-full overflow-hidden select-text shadow-[4px_4px_0px_#1A1A1A]">
        {activeThread ? (
          <>
            {/* Header profile area */}
            <div className="p-4 flex justify-between items-center bg-[#F4F1EA] border-b-2 border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none border-2 border-[#1A1A1A] overflow-hidden">
                  <img alt={activeThread.participantName} className="w-full h-full object-cover" src={activeThread.participantAvatar} />
                </div>
                <div>
                  <h2 className="font-extrabold text-[#1A1A1A] text-xs md:text-sm uppercase tracking-wider font-mono">
                    {activeThread.participantName}
                  </h2>
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#FF3E00] uppercase">
                    <span className="w-1.5 h-1.5 bg-[#FF3E00] inline-block" />
                    <span>{activeThread.participantStatus}</span>
                  </span>
                </div>
              </div>

              {/* Utility actions inside chat header */}
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => alert(`Memanggil ${activeThread.participantName}...\nUmpan video akan dikonfigurasi setelah izin kamera.`)}
                  className="p-1.5 text-[#1A1A1A] hover:text-[#FF3E00] border border-transparent hover:border-[#1A1A1A] rounded-none transition-all cursor-pointer bg-white"
                  title="Panggilan Video"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => alert(`Menghubungkan panggilan suara ke ${activeThread.participantName}...`)}
                  className="p-1.5 text-[#1A1A1A] hover:text-[#FF3E00] border border-transparent hover:border-[#1A1A1A] rounded-none transition-all cursor-pointer bg-white"
                  title="Panggilan Suara"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => alert('Pilihan: Hapus Riwayat Chat, Laporkan Pengguna, Lihat Detail Kontrak.')}
                  className="p-1.5 text-[#1A1A1A]/60 hover:text-red-650 transition-all cursor-pointer"
                  title="Opsi Lainnya"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable messages log */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F4F1EA]/30 space-y-4">
              <div className="flex justify-center my-3">
                <span className="px-3 py-1 bg-white border border-[#1A1A1A] font-mono text-[9px] text-[#1A1A1A]/80 font-bold uppercase tracking-widest">
                  HARI INI
                </span>
              </div>

              {activeThread.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {!isUser && (
                      <img 
                        alt="" 
                        className="w-7 h-7 rounded-none flex-shrink-0 mb-1 border border-[#1A1A1A]" 
                        src={activeThread.participantAvatar} 
                      />
                    )}
                    <div className="flex flex-col gap-0.5 max-w-full">
                      <div 
                        className={`p-3 border-2 border-[#1A1A1A] text-xs font-mono tracking-tight leading-snug rounded-none ${isUser ? 'bg-[#FF3E00] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-white text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'}`}
                      >
                        {msg.text}
                      </div>
                      <span className={`text-[8px] text-[#1A1A1A]/50 font-mono font-bold mt-0.5 uppercase tracking-wider ${isUser ? 'text-right pr-1' : 'pl-1'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Send input board */}
            <form onSubmit={handleSend} className="p-3 bg-[#F4F1EA] border-t-2 border-[#1A1A1A]">
              <div className="flex items-center gap-2 bg-white border-2 border-[#1A1A1A] p-2 rounded-none focus-within:shadow-[3px_3px_0px_#1A1A1A] transition-all">
                <button 
                  type="button" 
                  onClick={() => alert('Lampiran: Bagikan screenshot, esai, atau file ZIP skrip.')}
                  className="p-1.5 text-[#1A1A1A] hover:text-[#FF3E00] transition-colors cursor-pointer"
                  title="Unggah Lampiran"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-mono uppercase tracking-wide text-[#1A1A1A] py-2 placeholder-[#1A1A1A]/40"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] hover:bg-black transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-350 cursor-pointer shadow-none"
                  title="Kirim Pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <p className="font-extrabold text-xs uppercase tracking-widest font-mono text-[#1A1A1A]">Pilih percakapan teman sekelas untuk membaca pertukaran</p>
          </div>
        )}
      </div>
    </div>
  );
}
