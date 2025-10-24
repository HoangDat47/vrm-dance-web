'use client';

import { useState, useRef, useEffect } from 'react';
import { VRM_MODELS } from '@/constants/models';
import Image from 'next/image';

interface LiveHeaderProps {
  viewerCount: number;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onOpenAISettings: () => void;
}

export default function LiveHeader({ 
  viewerCount, 
  selectedModelId, 
  onSelectModel,
  onOpenAISettings
}: LiveHeaderProps) {
  const [showModelMenu, setShowModelMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowModelMenu(false);
      }
    }
    
    if (showModelMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showModelMenu]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="px-3 py-2 lg:px-6 lg:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Title & Viewer Count */}
          <div className="flex items-center gap-2 lg:gap-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-bold text-xs lg:text-sm whitespace-nowrap">LIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-2 py-1 lg:px-3 lg:py-1.5">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span className="text-white text-xs lg:text-sm font-semibold">
                {viewerCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            {/* ✅ Custom Model Selector with Avatars */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-2 py-1 lg:px-3 lg:py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs lg:text-sm border border-white/20 hover:border-white/40 transition-colors"
              >
                {selectedModel.avatar && (
                  <Image
                    src={selectedModel.avatar}
                    alt={selectedModel.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                )}
                <span className="hidden sm:inline">{selectedModel.name}</span>
                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showModelMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-purple-900/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                  {VRM_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model.id);
                        setShowModelMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                        model.id === selectedModelId
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {model.avatar && (
                        <Image
                          src={model.avatar}
                          alt={model.name}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white/20"
                        />
                      )}
                      <span>{model.name}</span>
                      {model.id === selectedModelId && (
                        <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Settings Button */}
            <button
              onClick={onOpenAISettings}
              className="px-2 py-1 lg:px-3 lg:py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5"
              title="AI Settings"
            >
              <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="hidden sm:inline">AI</span>
            </button>

            {/* Share Button */}
            <button className="px-2 py-1 lg:px-3 lg:py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs lg:text-sm font-semibold transition-all hidden md:block">
              Share
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
