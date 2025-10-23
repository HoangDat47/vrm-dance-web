'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';

interface DanmakuProps {
  comments: ChatMessage[];
}

export default function Danmaku({ comments }: DanmakuProps) {
  const [items, setItems] = useState<Array<{ text: string; color: string; id: number; top: number }>>([]);

  useEffect(() => {
    if (comments.length === 0) return;

    const latest = comments[comments.length - 1];
    const top = Math.random() * 60 + 20;

    setItems(prev => [...prev, { text: latest.text, color: latest.color, id: latest.id, top }]);

    const timer = setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== latest.id));
    }, 8000);

    return () => clearTimeout(timer);
  }, [comments.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold text-lg animate-danmaku"
          style={{
            top: `${item.top}%`,
            right: '-20%',
            color: item.color,
            textShadow: '0 0 10px currentColor, 2px 2px 8px rgba(0,0,0,0.9)',
            animationDuration: '8s',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
