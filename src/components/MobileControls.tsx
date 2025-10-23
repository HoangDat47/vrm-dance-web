'use client';

interface MobileControlsProps {
  showChat: boolean;
  showPlayer: boolean;
  onToggleChat: () => void;
  onTogglePlayer: () => void;
}

export default function MobileControls({ showChat, showPlayer, onToggleChat, onTogglePlayer }: MobileControlsProps) {
  return (
    <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/70 backdrop-blur-xl border border-white/10 px-4 py-2 shadow-2xl">
      <button
        onClick={onToggleChat}
        className={`w-10 h-10 flex items-center justify-center text-lg transition-all border ${
          showChat
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 border-white/20'
            : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
        }`}
      >
        💬
      </button>
      
      <div className="w-px h-8 bg-white/10" />
      
      <button
        onClick={onTogglePlayer}
        className={`w-10 h-10 flex items-center justify-center text-lg transition-all border ${
          showPlayer
            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 border-white/20'
            : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
        }`}
      >
        🎵
      </button>
    </div>
  );
}
