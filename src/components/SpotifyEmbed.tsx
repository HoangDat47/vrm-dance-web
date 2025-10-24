'use client';

import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/utils/cookies';
import { DEFAULT_PLAYLISTS, DEFAULT_PLAYLIST_ID } from '@/constants/default-playlists';

interface SpotifyEmbedProps {
  isVisible: boolean;
  onClose: () => void;
}

const COOKIE_PLAYLIST_KEY = 'spotify_playlist_id';
const COOKIE_CUSTOM_PLAYLISTS_KEY = 'custom_playlists';

export default function SpotifyEmbed({ isVisible, onClose }: SpotifyEmbedProps) {
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string>(DEFAULT_PLAYLIST_ID);
  const [inputValue, setInputValue] = useState<string>('');
  const [customPlaylists, setCustomPlaylists] = useState<Array<{ id: string; name: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedPlaylistId = getCookie(COOKIE_PLAYLIST_KEY);
    if (savedPlaylistId) {
      setCurrentPlaylistId(savedPlaylistId);
    }

    const savedCustomPlaylists = getCookie(COOKIE_CUSTOM_PLAYLISTS_KEY);
    if (savedCustomPlaylists) {
      try {
        setCustomPlaylists(JSON.parse(savedCustomPlaylists));
      } catch (e) {
        console.error('Failed to parse custom playlists');
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const playlistId = inputValue.trim();
    setCurrentPlaylistId(playlistId);
    setCookie(COOKIE_PLAYLIST_KEY, playlistId, 365);

    const exists = customPlaylists.some(p => p.id === playlistId);
    if (!exists) {
      const newCustom = [...customPlaylists, { id: playlistId, name: `Custom ${customPlaylists.length + 1}` }];
      setCustomPlaylists(newCustom);
      setCookie(COOKIE_CUSTOM_PLAYLISTS_KEY, JSON.stringify(newCustom), 365);
    }

    setInputValue('');
    setShowDropdown(false);
  };

  const handleSelectPlaylist = (playlistId: string) => {
    setCurrentPlaylistId(playlistId);
    setCookie(COOKIE_PLAYLIST_KEY, playlistId, 365);
    setShowDropdown(false);
  };

  const handleRemoveCustom = (playlistId: string) => {
    const updated = customPlaylists.filter(p => p.id !== playlistId);
    setCustomPlaylists(updated);
    setCookie(COOKIE_CUSTOM_PLAYLISTS_KEY, JSON.stringify(updated), 365);
  };

  const allPlaylists = [...DEFAULT_PLAYLISTS, ...customPlaylists];

  return (
    <div 
      className={`fixed left-4 bottom-4 lg:left-6 lg:bottom-6 z-40 w-[90vw] max-w-[340px] backdrop-blur-xl bg-black/90 border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-600/90 to-green-600/90 px-3 py-2 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
            <h3 className="text-white font-bold text-xs flex-shrink-0">Music Player</h3>
            
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="ml-1 flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 transition-colors"
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
              </svg>
              <svg className={`w-3 h-3 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-1 mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter Playlist ID..."
            className="flex-1 px-2 py-1 text-xs bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
          >
            Load
          </button>
        </div>
      </div>

      {showDropdown && (
        <div className="bg-black/95 border-b border-white/10 max-h-[200px] overflow-y-auto">
          <p className="text-white/60 text-xs px-3 py-2 border-b border-white/5">Select Playlist</p>
          
          {DEFAULT_PLAYLISTS.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handleSelectPlaylist(playlist.id)}
              className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 transition-colors ${
                currentPlaylistId === playlist.id ? 'bg-green-500/20' : ''
              }`}
            >
              <span className="text-white text-xs">{playlist.name}</span>
              {currentPlaylistId === playlist.id && (
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}

          {customPlaylists.length > 0 && (
            <>
              <p className="text-white/60 text-xs px-3 py-2 border-t border-white/5">Custom Playlists</p>
              {customPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`flex items-center justify-between px-3 py-2 hover:bg-white/10 transition-colors ${
                    currentPlaylistId === playlist.id ? 'bg-green-500/20' : ''
                  }`}
                >
                  <button
                    onClick={() => handleSelectPlaylist(playlist.id)}
                    className="flex-1 text-left"
                  >
                    <span className="text-white text-xs">{playlist.name}</span>
                    <p className="text-white/40 text-[10px] truncate">{playlist.id}</p>
                  </button>
                  <button
                    onClick={() => handleRemoveCustom(playlist.id)}
                    className="ml-2 p-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <div className="bg-black/40">
        <iframe
          key={currentPlaylistId}
          src={`https://open.spotify.com/embed/playlist/${currentPlaylistId}?utm_source=generator&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block"
        />
      </div>

      <div className="bg-black/60 px-3 py-2 border-t border-white/10">
        <p className="text-white/40 text-[10px] truncate">
          Current: {currentPlaylistId}
        </p>
      </div>
    </div>
  );
}
