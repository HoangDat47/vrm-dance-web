'use client';

import { useState } from 'react';
import { PERSONALITIES, DEFAULT_PERSONALITY } from '@/constants/personalities';
import { getCookie, setCookie } from '@/utils/cookies';

const COOKIE_PERSONALITY_KEY = 'ai_personality';

interface AISettingsModalProps {
  onClose: () => void;
}

export default function AISettingsModal({ onClose }: AISettingsModalProps) {
  const [selectedPersonality, setSelectedPersonality] = useState(
    getCookie(COOKIE_PERSONALITY_KEY) || DEFAULT_PERSONALITY
  );

  const handleSave = () => {
    setCookie(COOKIE_PERSONALITY_KEY, selectedPersonality, 365);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">⚙️ AI Personality</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-white font-semibold mb-3 text-lg">
            🎭 Select Personality
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(PERSONALITIES).map(([id, personality]) => (
              <button
                key={id}
                onClick={() => setSelectedPersonality(id)}
                className={`p-4 border-2 transition-all ${
                  selectedPersonality === id
                    ? 'border-pink-400 bg-white/20 scale-105'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-3xl mb-2">{personality.emoji}</div>
                <div className="text-white font-semibold text-sm">
                  {personality.name}
                </div>
              </button>
            ))}
          </div>
          
          {/* Personality Description */}
          <div className="mt-4 p-4 bg-black/30 border border-white/10">
            <p className="text-white/80 text-sm">
              {PERSONALITIES[selectedPersonality].base}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-purple-900/95 backdrop-blur-sm px-6 py-4 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
