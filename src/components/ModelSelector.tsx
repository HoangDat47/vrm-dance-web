'use client';

import { useState } from 'react';
import { VRM_MODELS } from '@/constants/models';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export default function ModelSelector({ selectedModelId, onSelectModel }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];

  const handleSelect = (modelId: string) => {
    onSelectModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 lg:px-4 py-2 border border-white/10 hover:bg-white/20 transition-all"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          <span className="text-white text-xs lg:text-sm font-semibold">
            {selectedModel.name}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full mt-2 right-0 z-50 w-64 bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-2">
              {VRM_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-all ${
                    model.id === selectedModelId
                      ? 'bg-purple-500/30 border-l-2 border-purple-400'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {model.avatar ? (
                    <img 
                      src={model.avatar} 
                      alt={model.name}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {model.name[0]}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{model.name}</p>
                    <p className="text-white/60 text-xs">VRM Model</p>
                  </div>

                  {model.id === selectedModelId && (
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
