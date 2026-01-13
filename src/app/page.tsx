'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LiveHeader from '@/components/LiveHeader';
import { VRM_MODELS, DEFAULT_MODEL_ID } from '@/constants/models';
import { getCookie, setCookie } from '@/utils/cookies';

const VRMDancer = dynamic(() => import('@/components/VRMDancer'), { ssr: false });

const COOKIE_MODEL_KEY = 'selected_vrm_model';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [viewerCount, setViewerCount] = useState(8234);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);

  useEffect(() => {
    setMounted(true);

    const savedModelId = getCookie(COOKIE_MODEL_KEY);
    if (savedModelId && VRM_MODELS.find(m => m.id === savedModelId)) {
      setSelectedModelId(savedModelId);
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

  if (!mounted) return null;

  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];

  return (
    <div className="relative bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 w-screen h-screen overflow-hidden">
      <div className="z-0 absolute inset-0">
        <div className="top-1/4 left-1/4 absolute bg-purple-500/20 blur-3xl rounded-full w-96 h-96 animate-pulse" />
        <div className="right-1/4 bottom-1/4 absolute bg-pink-500/20 blur-3xl rounded-full w-80 h-80 animate-pulse" />
      </div>

      <LiveHeader 
        viewerCount={viewerCount}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
      />

      <main className="relative pt-14 lg:pt-16 h-full">
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
