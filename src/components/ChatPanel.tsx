'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { getCookie } from '@/utils/cookies';
import { VRM_MODELS } from '@/constants/models';

const COOKIE_MODEL_KEY = 'selected_model';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  onAIResponse?: (response: string) => void;
}

export default function ChatPanel({ messages, onSendMessage, onClose, onAIResponse }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateResponse, isGenerating } = useAIResponse();

  // ✅ Get selected model name
  const selectedModelId = getCookie(COOKIE_MODEL_KEY) || 'default';
  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];
  const aiName = selectedModel.name; // ✅ Use model name (e.g. "🎀 Miku")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    onSendMessage(userMessage);
    setInput('');

    try {
      const response = await generateResponse(userMessage);
      if (response && onAIResponse) {
        onAIResponse(response);
      }
    } catch (error) {
      console.error('AI response failed:', error);
      if (onAIResponse) {
        onAIResponse('Xin lỗi, gặp chút vấn đề... 😅');
      }
    }
  };

  return (
    <div className="fixed right-4 top-16 lg:right-6 lg:top-20 z-40 w-[85vw] max-w-[320px] lg:max-w-[380px] h-[70vh] max-h-[600px] backdrop-blur-xl bg-black/90 border border-white/10 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-3 py-2 lg:px-4 lg:py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
            <h3 className="text-white font-bold text-xs lg:text-sm">Live Chat</h3>
            {isGenerating && (
              <span className="text-white/60 text-xs animate-pulse">🤔</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 lg:p-3 space-y-2">
        {messages.map((msg) => {
          // ✅ Use AI name for AI messages
          const displayName = msg.user === 'AI' ? aiName : msg.user;
          const displayColor = msg.user === 'AI' ? '#e74c3c' : msg.color;
          
          return (
            <div key={msg.id} className="flex items-start gap-2 animate-fade-in">
              <div
                className="w-6 h-6 lg:w-7 lg:h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: displayColor }}
              >
                {displayName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 font-semibold text-xs lg:text-sm mb-0.5">{displayName}</p>
                <p className="text-white/80 text-xs lg:text-sm break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-2 lg:p-3 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGenerating ? "AI is thinking..." : "Say something..."}
            disabled={isGenerating}
            className="flex-1 px-2 py-1.5 lg:px-3 lg:py-2 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-purple-400 focus:outline-none text-xs lg:text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold text-xs lg:text-sm transition-all"
          >
            {isGenerating ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
