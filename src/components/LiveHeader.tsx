'use client';

import { VRM_MODELS } from '@/constants/models';
import { ModelCombobox } from './ModelCombobox';

interface LiveHeaderProps {
  viewerCount: number;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export default function LiveHeader({ 
  viewerCount, 
  selectedModelId, 
  onSelectModel
}: LiveHeaderProps) {

  return (
    <header className="top-0 right-0 left-0 z-50 fixed bg-linear-to-r from-purple-900/95 to-pink-900/95 shadow-2xl backdrop-blur-xl border-white/10 border-b">
      <div className="px-3 lg:px-6 py-2 lg:py-3">
        <div className="flex justify-between items-center gap-2">
          {/* Left: Title & Viewer Count */}
          <div className="flex items-center gap-2 lg:gap-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="bg-red-500 rounded-full w-2 lg:w-2.5 h-2 lg:h-2.5 animate-pulse" />
              <span className="font-bold text-white text-xs lg:text-sm whitespace-nowrap">LIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-2 lg:px-3 py-1 lg:py-1.5">
              <svg className="w-3 lg:w-4 h-3 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span className="font-semibold text-white text-xs lg:text-sm">
                {viewerCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            <ModelCombobox 
              selectedModelId={selectedModelId}
              onSelectModel={onSelectModel}
            />
          </div>
        </div>
      </div>
    </header>
  );
}