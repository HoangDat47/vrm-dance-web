'use client';

import { useEffect, useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { VRM_MODELS } from '@/constants/models';

interface DanmakuProps {
  comments: ChatMessage[];
}

// ✅ FIX: Use Omit to avoid type conflict
interface ActiveComment extends Omit<ChatMessage, 'id'> {
  y: number;
  speed: number;
  id: string | number; // Now we can override the type
}

export default function Danmaku({ comments }: DanmakuProps) {
  const [activeComments, setActiveComments] = useState<ActiveComment[]>([]);

  // Get all model names for filtering
  const modelNames = VRM_MODELS.map(m => m.name);
  const isAIMessage = (user: string) => {
    return modelNames.includes(user) || user === 'AI' || user === 'AI Character';
  };

  useEffect(() => {
    if (comments.length === 0) return;

    const latestComment = comments[comments.length - 1];
    
    // Skip AI messages - don't show in danmaku
    if (isAIMessage(latestComment.user)) {
      return;
    }

    const newComment: ActiveComment = {
      ...latestComment,
      y: Math.random() * 60 + 10, // Random vertical position (10-70%)
      speed: Math.random() * 3 + 6, // Random speed 
      id: latestComment.id || Date.now(),
    };

    setActiveComments(prev => [...prev, newComment]);

    // Remove comment after animation completes
    const timer = setTimeout(() => {
      setActiveComments(prev => prev.filter(c => c.id !== newComment.id));
    }, newComment.speed * 8000);

    return () => clearTimeout(timer);
  }, [comments]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {activeComments.map((comment) => (
        <div
          key={comment.id}
          className="absolute whitespace-nowrap animate-danmaku"
          style={{
            top: `${comment.y}%`,
            right: '-100%',
            color: comment.color,
            animationDuration: `${comment.speed}s`,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {/* <span className="font-bold text-sm lg:text-base">
            {comment.user}:
          </span> */}
          <span className="ml-2 text-sm lg:text-base">
            {comment.text}
          </span>
        </div>
      ))}
    </div>
  );
}
