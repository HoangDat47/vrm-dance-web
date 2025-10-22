'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';

const VRMDancer = dynamic(() => import('@/components/VRMDancer'), {
  ssr: false,
});

interface ChatMessage {
  user: string;
  text: string;
  color: string;
  id: number;
}

const DEMO_COMMENTS: Omit<ChatMessage, 'id'>[] = [
  { user: 'Sakura123', text: 'かわいい！💕', color: '#FF69B4' },
  { user: 'Yuki_Chan', text: 'ダンス最高！✨', color: '#87CEEB' },
  { user: 'Takeshi88', text: 'すごい！', color: '#FFD700' },
  { user: 'MikuFan', text: '蒼井そらちゃん応援してます！', color: '#FF1493' },
  { user: 'AnimeOtaku', text: 'Beautiful! 😍', color: '#9370DB' },
  { user: 'Haruka_Nya', text: 'かっこいい〜！', color: '#FF6B9D' },
  { user: 'Viewer2025', text: 'Live最高！🎵', color: '#00CED1' },
  { user: 'DanceLover', text: 'すばらしい performance!', color: '#FFA500' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(8234);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Auto show panels on desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setShowPlayer(true);
      setShowChat(true);
    }

    const interval = setInterval(() => {
      const randomComment = DEMO_COMMENTS[Math.floor(Math.random() * DEMO_COMMENTS.length)];
      setChatMessages(prev => [...prev, { ...randomComment, id: Date.now() }].slice(-50));
    }, 3000);

    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 20) - 5);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(viewerInterval);
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setChatMessages(prev => [
        ...prev,
        {
          user: 'You',
          text: inputMessage,
          color: '#FF1493',
          id: Date.now(),
        },
      ]);
      setInputMessage('');
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg lg:text-xl">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-black text-white">Sousharu</h1>
              <p className="text-xs text-purple-300 font-medium">Live Performance</p>
            </div>
          </div>

          {/* Live Stats */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-full border border-white/20">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span className="text-white text-sm font-semibold">{viewerCount.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-3 lg:px-4 py-2 rounded-full shadow-lg shadow-red-500/50">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs lg:text-sm font-bold uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-full pt-16 lg:pt-20">
        {/* VRM Dancer - Center Stage */}
        <div className="absolute inset-0 z-10">
          <VRMDancer
            vrmUrl="/models/3193725086051913960.vrm"
            animationUrl="/animations/dance.vrma"
          />
        </div>

        {/* Danmaku Layer - Desktop only */}
        <div className="hidden lg:block">
          <DanmakuLayer comments={chatMessages} />
        </div>

        {/* Live Chat - Left Side */}
        {showChat ? (
          <div className="fixed left-4 bottom-4 lg:bottom-8 z-40 w-[calc(100%-2rem)] lg:w-96 max-h-[50vh] lg:max-h-[600px] flex flex-col backdrop-blur-2xl bg-black/40 border border-white/20 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="text-white font-bold text-sm">Live Chat</h3>
                <span className="text-white/60 text-xs">({chatMessages.length})</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div
              ref={chatBoxRef}
              className="flex-1 overflow-y-auto p-3 space-y-2"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
            >
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors animate-fadeIn">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: msg.color }}
                  >
                    {msg.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/90">{msg.user}</p>
                    <p className="text-sm text-white/80 break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="fixed left-4 bottom-4 lg:bottom-8 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl shadow-purple-500/50 transition-all hover:scale-110"
          >
            💬
          </button>
        )}

        {/* Spotify Player - Right Side */}
        {showPlayer ? (
          <div className="fixed right-4 top-20 lg:top-28 z-40 w-[calc(100%-2rem)] lg:w-96 backdrop-blur-2xl bg-black/40 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="text-white font-bold text-sm">Now Playing</h3>
              </div>
              <button
                onClick={() => setShowPlayer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <iframe
                src="https://open.spotify.com/embed/playlist/7zDGwh1ILDa5JAN0qgkZ2G?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPlayer(true)}
            className="fixed right-4 top-20 lg:top-28 z-40 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl shadow-green-500/50 transition-all hover:scale-110"
          >
            🎵
          </button>
        )}

        {/* Mobile Control Panel */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-4 py-3 shadow-2xl">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
              showChat
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            💬
          </button>
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
              showPlayer
                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🎵
          </button>
        </div>
      </main>
    </div>
  );
}

function DanmakuLayer({ comments }: { comments: ChatMessage[] }) {
  const [danmakuItems, setDanmakuItems] = useState<
    Array<{ text: string; color: string; id: number; top: number }>
  >([]);

  useEffect(() => {
    if (comments.length === 0) return;

    const latestComment = comments[comments.length - 1];
    const randomTop = Math.random() * 60 + 20;

    setDanmakuItems(prev => [
      ...prev,
      { text: latestComment.text, color: latestComment.color, id: latestComment.id, top: randomTop }
    ]);

    setTimeout(() => {
      setDanmakuItems(prev => prev.filter(item => item.id !== latestComment.id));
    }, 8000);
  }, [comments.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {danmakuItems.map((item) => (
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
