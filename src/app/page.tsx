'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LiveHeader from '@/components/LiveHeader';
import ChatPanel from '@/components/ChatPanel';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import AISettingsPanel from '@/components/AISettingsPanel';
import Danmaku from '@/components/Danmaku';
import MobileControls from '@/components/MobileControls';
import { ChatMessage } from '@/types/chat';
import { DEMO_COMMENTS } from '@/constants/demo-comments';
import { VRM_MODELS, DEFAULT_MODEL_ID } from '@/constants/models';
import { getCookie, setCookie } from '@/utils/cookies';

const VRMDancer = dynamic(() => import('@/components/VRMDancer'), { ssr: false });

const COOKIE_MODEL_KEY = 'selected_vrm_model';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(8234);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);

  useEffect(() => {
    setMounted(true);

    const savedModelId = getCookie(COOKIE_MODEL_KEY);
    if (savedModelId && VRM_MODELS.find(m => m.id === savedModelId)) {
      setSelectedModelId(savedModelId);
    }

    if (window.innerWidth >= 1024) {
      setShowPlayer(true);
      setShowChat(true);
    }

    const msgInterval = setInterval(() => {
      const random = DEMO_COMMENTS[Math.floor(Math.random() * DEMO_COMMENTS.length)];
      setMessages(prev => [...prev, { ...random, id: Date.now() }].slice(-50));
    }, 3000);

    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 20) - 5);
    }, 5000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(viewerInterval);
    };
  }, []);

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setCookie(COOKIE_MODEL_KEY, modelId, 365);
  };

  const handleSendMessage = (text: string) => {
    setMessages(prev => [...prev, { 
      user: 'You', 
      text, 
      color: '#FF1493', 
      id: Date.now() 
    }]);
  };

  // ✅ FIX: Use model name for AI responses
  const handleAIResponse = (response: string) => {
    const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];
    
    setMessages(prev => [...prev, {
      user: selectedModel.name, // ✅ Use model name (e.g., "Emi oxxo")
      text: response,
      color: '#9333EA',
      id: Date.now()
    }]);
  };

  if (!mounted) return null;

  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <LiveHeader 
        viewerCount={viewerCount}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
        onOpenAISettings={() => setShowAISettings(true)}
      />

      <AISettingsPanel
        isVisible={showAISettings}
        onClose={() => setShowAISettings(false)}
      />

      <main className="relative h-full pt-14 lg:pt-16">
        <div className="absolute inset-0 z-10">
          <VRMDancer 
            key={selectedModelId} 
            vrmUrl={selectedModel.path}
            rotation={selectedModel.rotation || 0}
            scale={selectedModel.scale || 1.5}
          />
        </div>

        <div className="hidden lg:block">
          <Danmaku comments={messages} />
        </div>

        {showChat && (
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onAIResponse={handleAIResponse}
            onClose={() => setShowChat(false)}
          />
        )}
        
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="fixed right-4 top-16 lg:right-6 lg:top-20 z-40 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center text-white text-xl lg:text-2xl shadow-2xl shadow-purple-500/50 transition-all hover:scale-105"
          >
            💬
          </button>
        )}

        <SpotifyEmbed
          isVisible={showPlayer}
          onClose={() => setShowPlayer(false)}
        />
        
        {!showPlayer && (
          <button
            onClick={() => setShowPlayer(true)}
            className="fixed left-4 bottom-4 lg:left-6 lg:bottom-6 z-40 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center justify-center text-white text-xl lg:text-2xl shadow-2xl shadow-green-500/50 transition-all hover:scale-105"
          >
            🎵
          </button>
        )}

        <MobileControls
          showChat={showChat}
          showPlayer={showPlayer}
          onToggleChat={() => setShowChat(!showChat)}
          onTogglePlayer={() => setShowPlayer(!showPlayer)}
        />
      </main>
    </div>
  );
}
