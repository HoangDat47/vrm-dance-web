'use client';

import { Users } from 'lucide-react';
import { ModelCombobox } from './ModelCombobox';
import { BackgroundCombobox } from './BackgroundCombobox';

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
    <header className="top-4 z-50 fixed inset-x-0 flex justify-center px-3">
      <div className="flex items-center gap-3 bg-white/90 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.55)] backdrop-blur-xl px-4 py-2 border border-white/60 rounded-full w-[min(1120px,calc(100%-16px))]">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-neutral-900 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] border border-neutral-200 rounded-full w-10 h-10 font-semibold text-white text-xs uppercase tracking-[0.08em]">
              VR
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-neutral-900 text-sm">Sousharu Live</p>
              <p className="text-neutral-500 text-xs">VRM Dance Studio</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-medium text-neutral-600 text-sm">
            <span className="inline-flex relative w-2 h-2">
              <span className="absolute inset-0 bg-emerald-500 opacity-90 rounded-full" />
              <span className="absolute inset-0 bg-emerald-500 opacity-30 blur-[1px] rounded-full" />
            </span>
            <span className="text-neutral-800 uppercase tracking-wide">Live</span>
            <span className="flex items-center gap-1 text-neutral-600">
              <Users className="w-3.5 h-3.5" />
              {viewerCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-2">
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