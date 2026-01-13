'use client';

import { Users } from 'lucide-react';
import { ModelCombobox } from './ModelCombobox';
import { BackgroundCombobox } from './BackgroundCombobox';
import { Badge } from '@/components/ui/badge';

interface LiveHeaderProps {
  viewerCount: number;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  selectedBackgroundId: string;
  onSelectBackground: (backgroundId: string) => void;
}

export default function LiveHeader({ 
  viewerCount, 
  selectedModelId, 
  onSelectModel,
  selectedBackgroundId,
  onSelectBackground
}: LiveHeaderProps) {
  return (
    <header className="top-0 right-0 left-0 z-50 fixed bg-linear-to-r from-blue-300 via-pink-200 to-purple-300 shadow-lg shadow-purple-200 border-purple-400 border-b-4 w-full h-12 lg:h-14">
      <div className="flex justify-between items-center px-3 lg:px-6 h-full">
        {/* Left: Logo & Viewer Count */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* LIVE indicator */}
          <div className="flex items-center gap-1.5 bg-white/70 px-2 py-0.5 lg:py-1 border-2 border-purple-400 rounded-sm">
            <div className="bg-pink-500 rounded-full w-1.5 lg:w-2 h-1.5 lg:h-2 animate-pulse" />
            <span className="font-bold text-purple-600 text-xs lg:text-sm tracking-widest whitespace-nowrap">LIVE</span>
          </div>
          
          {/* Viewer Count Badge */}
          <Badge className="hidden sm:flex items-center gap-1 bg-white/70 hover:bg-white/90 px-2 py-0.5 lg:py-1 border-2 border-purple-400 rounded-sm font-bold text-purple-600 text-xs lg:text-sm transition-colors">
            <Users className="w-3 h-3" />
            <span>{viewerCount.toLocaleString()}</span>
          </Badge>
        </div>

        {/* Right: Selectors */}
        <div className="flex items-center gap-1 lg:gap-2">
          <BackgroundCombobox 
            selectedBackgroundId={selectedBackgroundId}
            onSelectBackground={onSelectBackground}
          />
          <ModelCombobox 
            selectedModelId={selectedModelId}
            onSelectModel={onSelectModel}
          />
        </div>
      </div>
    </header>
  );
}