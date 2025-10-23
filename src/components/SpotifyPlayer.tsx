'use client';

interface SpotifyPlayerProps {
  playlistId: string;
  onClose: () => void;
}

export default function SpotifyPlayer({ playlistId, onClose }: SpotifyPlayerProps) {
  return (
    <div className="fixed left-4 bottom-4 lg:left-6 lg:bottom-6 z-40 w-[90vw] max-w-[340px] backdrop-blur-xl bg-black/50 border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/90 to-green-600/90 px-3 py-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <h3 className="text-white font-bold text-xs">Now Playing</h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Spotify Embed */}
      <div className="bg-black/40">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="440"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block"
        />
      </div>
    </div>
  );
}
