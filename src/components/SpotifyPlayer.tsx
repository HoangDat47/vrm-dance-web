'use client';

import { useState } from 'react';

export default function SpotifyPlayer({ playlistId }: { playlistId: string }) {
  const [minimized, setMinimized] = useState(false);
  
  return (
    <div className={`absolute ${minimized ? 'bottom-4 right-4' : 'bottom-8 left-8'} z-30 transition-all`}>
      <div className="bg-black/90 backdrop-blur rounded-xl p-2 shadow-2xl">
        {!minimized ? (
          <>
            <iframe 
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
              width="300" 
              height="152" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="rounded-lg"
            />
            
            <button 
              onClick={() => setMinimized(true)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-purple-500 rounded-full text-white text-sm hover:bg-purple-600 flex items-center justify-center"
            >
              ─
            </button>
          </>
        ) : (
          <button 
            onClick={() => setMinimized(false)}
            className="w-12 h-12 bg-green-500 rounded-full text-white flex items-center justify-center hover:bg-green-600"
          >
            🎵
          </button>
        )}
      </div>
    </div>
  );
}
