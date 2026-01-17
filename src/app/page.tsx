'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LiveHeader from '@/components/LiveHeader';
import AdminPanel from '@/components/AdminPanel';
import { BACKGROUNDS, DEFAULT_BACKGROUND_ID } from '@/constants/backgrounds';
import { getCookie, setCookie } from '@/utils/cookies';
import { testSupabaseConnection, testSupabaseAuth } from '@/utils/test-supabase';
import { useAuth } from '@/lib/auth-context';

const VRMDancer = dynamic(() => import('@/components/VRMDancer'), { ssr: false });

const COOKIE_MODEL_KEY = 'selected_vrm_model';
const COOKIE_BACKGROUND_KEY = 'selected_background';

interface Model {
  id: string;
  name: string;
  path: string;
  avatar: string | null;
  rotation: number;
  scale: number;
}

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [viewerCount, setViewerCount] = useState(8234);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>(DEFAULT_BACKGROUND_ID);
  const [pauseVRM, setPauseVRM] = useState(false);

  const refreshModels = async () => {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      if (data.models && data.models.length > 0) {
        setModels(data.models);

        const savedModelId = getCookie(COOKIE_MODEL_KEY);
        setSelectedModelId((prev) => {
          if (prev && data.models.find((m: Model) => m.id === prev)) return prev;
          if (savedModelId && data.models.find((m: Model) => m.id === savedModelId)) return savedModelId;
          return data.models[0].id;
        });
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Test Supabase connection
    testSupabaseConnection();
    testSupabaseAuth();

    // Fetch models from database
    refreshModels();

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
  }, [user, isLoading, router]);

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setCookie(COOKIE_MODEL_KEY, modelId, 365);
  };

  const handleSelectBackground = (backgroundId: string) => {
    setSelectedBackgroundId(backgroundId);
    setCookie(COOKIE_BACKGROUND_KEY, backgroundId, 365);
  };

  // Show loading state while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="flex justify-center items-center bg-neutral-900 w-screen h-screen">
        <div className="text-center">
          <div className="inline-block mb-4 border-4 border-white/20 border-t-white rounded-full w-12 h-12 animate-spin"></div>
          <p className="font-medium text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!mounted) return null;

  const selectedModel = models.length > 0 ? models.find(m => m.id === selectedModelId) || models[0] : null;
  const selectedBackground = BACKGROUNDS.find(b => b.id === selectedBackgroundId) || BACKGROUNDS[0];

  return (
    <div 
      className="relative bg-cover bg-center w-screen h-screen overflow-hidden"
      style={{ backgroundImage: `url('${selectedBackground.path}')` }}
    >
      {/* Dark overlay for better readability */}
      <div className="z-0 absolute inset-0 bg-black/10" />

      {/* Admin Panel - Only visible for admin users */}
      <AdminPanel onUploadStateChange={setPauseVRM} onModelsUpdate={refreshModels} />

      <LiveHeader 
        viewerCount={viewerCount}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
        models={models}
        selectedBackgroundId={selectedBackgroundId}
        onSelectBackground={handleSelectBackground}
      />

      <main className="relative pt-14 lg:pt-16 w-full h-full">
        {pauseVRM ? (
          <div className="z-10 absolute inset-0 flex justify-center items-center bg-black/20">
            <div className="bg-white/90 shadow-lg backdrop-blur-md px-6 py-4 rounded-lg">
              <p className="font-semibold text-gray-900 text-lg">Preparing model...</p>
              <p className="text-gray-600 text-sm">VRM dancer paused</p>
            </div>
          </div>
        ) : selectedModel ? (
          <div className="z-10 absolute inset-0">
            <VRMDancer 
              key={selectedModelId} 
              vrmUrl={selectedModel.path}
              rotation={selectedModel.rotation || 0}
              scale={selectedModel.scale || 1.5}
            />
          </div>
        ) : (
          <div className="z-10 absolute inset-0 flex justify-center items-center">
            <p className="font-semibold text-white text-xl">No models available</p>
          </div>
        )}
      </main>
    </div>
  );
}
