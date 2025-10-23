import { ChatMessage } from '@/types/chat';

export const DEMO_COMMENTS: Omit<ChatMessage, 'id'>[] = [
  { user: 'Sakura123', text: 'かわいい！💕', color: '#FF69B4' },
  { user: 'Yuki_Chan', text: 'ダンス最高！✨', color: '#87CEEB' },
  { user: 'Takeshi88', text: 'すごい！', color: '#FFD700' },
  { user: 'MikuFan', text: '蒼井そらちゃん応援してます！', color: '#FF1493' },
  { user: 'AnimeOtaku', text: 'Beautiful! 😍', color: '#9370DB' },
  { user: 'Haruka_Nya', text: 'かっこいい〜！', color: '#FF6B9D' },
  { user: 'Viewer2025', text: 'Live最高！🎵', color: '#00CED1' },
  { user: 'DanceLover', text: 'すばらしい performance!', color: '#FFA500' },
];
