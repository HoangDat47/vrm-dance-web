'use client';

import { Users } from 'lucide-react';
import { ModelCombobox } from './ModelCombobox';
import { Badge } from '@/components/ui/badge';

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
    <header className="top-0 right-0 left-0 z-50 fixed bg-background/80 backdrop-blur-xl border-white/10 border-b">
      <div className="flex justify-between items-center px-3 lg:px-6 py-3 lg:py-4">
        {/* Left: Logo & Status */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 rounded-full w-2 lg:w-2.5 h-2 lg:h-2.5 animate-pulse" />
            <span className="font-bold text-white text-xs lg:text-sm whitespace-nowrap">LIVE</span>
          </div>
          
          {/* Viewer Count */}
          <Badge variant="secondary" className="hidden sm:flex gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs">
            <Users className="w-3 h-3" />
            <span className="font-semibold">{viewerCount.toLocaleString()}</span>
          </Badge>
        </div>

        {/* Right: Model Selector */}
        <div className="flex items-center gap-2">
          <ModelCombobox 
            selectedModelId={selectedModelId}
            onSelectModel={onSelectModel}
          />
        </div>
      </div>
    </header>
  );
}