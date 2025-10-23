'use client';

import { useRef, useEffect, FormEvent } from 'react';
import { ChatMessage } from '@/types/chat';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

export default function ChatPanel({ messages, onSendMessage, onClose }: ChatPanelProps) {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (value) {
      onSendMessage(value);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="fixed right-4 top-16 lg:right-6 lg:top-20 z-40 w-[90vw] max-w-[360px] h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)] flex flex-col bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/90">
        <h3 className="text-sm font-semibold text-gray-900">Live chat</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto bg-white/50"
        style={{ 
          scrollbarWidth: 'thin', 
          scrollbarColor: '#cbd5e1 transparent' 
        }}
      >
        <div className="px-4 py-3 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 animate-fadeIn">
              {/* Avatar - Rounded */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm"
                style={{ backgroundColor: msg.color }}
              >
                {msg.user[0].toUpperCase()}
              </div>
              
              {/* Message Content với background xám trong suốt */}
              <div className="flex-1 min-w-0 bg-gray-100/60 px-3 py-2 rounded">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  {msg.user}
                </p>
                <p className="text-sm text-gray-900 break-words leading-relaxed">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Say something..."
            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
