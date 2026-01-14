'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LiveHeader from '@/components/LiveHeader';
import { VRM_MODELS, DEFAULT_MODEL_ID } from '@/constants/models';
import { BACKGROUNDS, DEFAULT_BACKGROUND_ID } from '@/constants/backgrounds';
import { getCookie, setCookie } from '@/utils/cookies';

const VRMDancer = dynamic(() => import('@/components/VRMDancer'), { ssr: false });

const COOKIE_MODEL_KEY = 'selected_vrm_model';
const COOKIE_BACKGROUND_KEY = 'selected_background';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [viewerCount, setViewerCount] = useState(8234);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>(DEFAULT_BACKGROUND_ID);

  useEffect(() => {
    setMounted(true);

    const savedModelId = getCookie(COOKIE_MODEL_KEY);
    if (savedModelId && VRM_MODELS.find(m => m.id === savedModelId)) {
      setSelectedModelId(savedModelId);
    }

    const savedBackgroundId = getCookie(COOKIE_BACKGROUND_KEY);
    if (savedBackgroundId && BACKGROUNDS.find(b => b.id === savedBackgroundId)) {
      setSelectedBackgroundId(savedBackgroundId);
    }

    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 20) - 5);
    }, 5000);

    return () => {
      clearInterval(viewerInterval);
    };
  }, []);

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setCookie(COOKIE_MODEL_KEY, modelId, 365);
  };

  const handleSelectBackground = (backgroundId: string) => {
    setSelectedBackgroundId(backgroundId);
    setCookie(COOKIE_BACKGROUND_KEY, backgroundId, 365);
  };

  if (!mounted) return null;

  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];
  const selectedBackground = BACKGROUNDS.find(b => b.id === selectedBackgroundId) || BACKGROUNDS[0];

  return (
    <div 
      className="relative bg-cover bg-center w-screen h-screen overflow-hidden"
      style={{ backgroundImage: `url('${selectedBackground.path}')` }}
    >
      {/* Dark overlay for better readability */}
      <div className="z-0 absolute inset-0 bg-black/10" />

      <LiveHeader 
        viewerCount={viewerCount}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
        selectedBackgroundId={selectedBackgroundId}
        onSelectBackground={handleSelectBackground}
      />

      <main className="relative pt-14 lg:pt-16 w-full h-full">
        <div className="z-10 absolute inset-0">
          <VRMDancer 
            key={selectedModelId} 
            vrmUrl={selectedModel.path}
            rotation={selectedModel.rotation || 0}
            scale={selectedModel.scale || 1.5}
          />
        </div>
      </main>
    </div>
  );
}
