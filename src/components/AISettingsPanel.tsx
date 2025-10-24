'use client';

import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/utils/cookies';
import { PERSONALITIES, DEFAULT_PERSONALITY } from '@/constants/personalities';

interface AISettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const COOKIE_PERSONALITY_KEY = 'ai_personality';
const COOKIE_VOICE_KEY = 'ai_voice';

export default function AISettingsPanel({ isVisible, onClose }: AISettingsPanelProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<string>(DEFAULT_PERSONALITY);

  useEffect(() => {
    const savedPersonality = getCookie(COOKIE_PERSONALITY_KEY);
    if (savedPersonality && PERSONALITIES[savedPersonality]) {
      setSelectedPersonality(savedPersonality);
    }
  }, []);

  const handlePersonalityChange = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    setCookie(COOKIE_PERSONALITY_KEY, personalityId, 365);
  };

  if (!isVisible) return null;

  const currentPersonality = PERSONALITIES[selectedPersonality];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-4 py-3 border-b border-white/20 flex items-center justify-between">
          <h3 className="text-white font-bold text-base">AI Personality Settings</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Current Selection */}
          <div className="bg-black/30 p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{currentPersonality.emoji}</span>
              <div>
                <p className="text-white font-bold">{currentPersonality.name}</p>
                <p className="text-white/60 text-xs">Current Personality</p>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-2">{currentPersonality.base}</p>
          </div>

          {/* Personality Grid */}
          <div>
            <p className="text-white font-semibold mb-3">Choose Personality</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(PERSONALITIES).map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => handlePersonalityChange(personality.id)}
                  className={`p-3 border transition-all ${
                    selectedPersonality === personality.id
                      ? 'bg-purple-500/30 border-purple-400'
                      : 'bg-black/20 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{personality.emoji}</div>
                  <p className="text-white text-xs font-semibold">{personality.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
