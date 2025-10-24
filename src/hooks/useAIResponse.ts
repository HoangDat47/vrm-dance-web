'use client';

import { useState, useCallback } from 'react';
import { generateAIResponse } from '@/utils/gemini';
import { PERSONALITIES, DEFAULT_PERSONALITY } from '@/constants/personalities';
import { getCookie } from '@/utils/cookies';

const COOKIE_PERSONALITY_KEY = 'ai_personality';

export function useAIResponse() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = useCallback(async (userMessage: string) => {
    if (isGenerating) return null;

    setIsGenerating(true);

    try {
      const personalityId = getCookie(COOKIE_PERSONALITY_KEY) || DEFAULT_PERSONALITY;
      const personality = PERSONALITIES[personalityId];

      const response = await generateAIResponse(userMessage, personality.base);

      return response;

    } catch (error) {
      console.error('AI Response error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  return {
    generateResponse,
    isGenerating
  };
}
