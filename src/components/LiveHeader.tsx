'use client';

import ModelSelector from './ModelSelector';

interface LiveHeaderProps {
  viewerCount: number;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export default function LiveHeader({ viewerCount, selectedModelId, onSelectModel }: LiveHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-b from-black/50 via-black/40 to-transparent border-b border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
              <span className="text-white font-black text-base lg:text-lg">S</span>
            </div>
          </div>
          
          <div className="space-y-0">
            <h1 className="text-sm lg:text-base font-bold text-white leading-none">
              Sousharu
            </h1>
            <p className="text-[10px] lg:text-xs text-purple-300/80 font-medium uppercase tracking-wider mt-0.5">Live Performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <ModelSelector
            selectedModelId={selectedModelId}
            onSelectModel={onSelectModel}
          />

          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 border border-white/10">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span className="text-xs lg:text-sm font-semibold text-white">
              {viewerCount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-pink-500 px-3 lg:px-4 py-1.5 lg:py-2 shadow-lg shadow-red-500/30">
            <div className="w-1.5 h-1.5 bg-white animate-pulse" />
            <span className="text-white text-xs lg:text-sm font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
