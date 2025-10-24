"use client";

import { useEffect, useState, useRef } from "react";
import {
  getAuthUrl,
  getCodeFromUrl,
  exchangeCodeForToken,
  saveToken,
  getStoredToken,
  clearToken,
} from "@/utils/spotify-auth";
import {
  fetchUserPlaylists,
  playPlaylist,
  skipToNext,
  skipToPrevious,
} from "@/utils/spotify-api";

interface Track {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
}

interface SpotifyWebPlayerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SpotifyWebPlayer({
  isVisible,
  onClose,
}: SpotifyWebPlayerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>("");
  const playerRef = useRef<any>(null);

 // Generate auth URL
useEffect(() => {
  // ✅ Only run after component is mounted (client-side)
  let mounted = true;
  
  const loadAuthUrl = async () => {
    try {
      const url = await getAuthUrl();
      if (mounted) {
        setAuthUrl(url);
      }
    } catch (error) {
      console.error('Failed to generate auth URL:', error);
    }
  };
  
  loadAuthUrl();

  return () => {
    mounted = false;
  };
}, []);

  // Auth - Check for code or stored token
  useEffect(() => {
    const handleAuth = async () => {
      const code = getCodeFromUrl();
      if (code) {
        console.log("🔑 Got authorization code, exchanging for token...");
        const _token = await exchangeCodeForToken(code);
        if (_token) {
          setToken(_token);
          saveToken(_token);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          console.log("✅ Token saved");
        }
      } else {
        const storedToken = getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          console.log("✅ Using stored token");
        }
      }
    };

    handleAuth();
  }, []);

  // Load Spotify SDK
  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const SpotifyPlayer = (window as any).Spotify.Player;

      const spotifyPlayer = new SpotifyPlayer({
        name: "Sousharu VRM Player",
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", ({ device_id }: any) => {
        console.log("✅ Spotify Ready with Device ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
        console.log("❌ Device ID has gone offline", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setIsActive(true);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
      playerRef.current = spotifyPlayer;
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [token]);

  // Fetch playlists
  useEffect(() => {
    if (!token) return;

    const loadPlaylists = async () => {
      try {
        const data = await fetchUserPlaylists(token);
        setPlaylists(data.items || []);
        console.log("✅ Loaded", data.items?.length, "playlists");
      } catch (error) {
        console.error("Failed to load playlists:", error);
      }
    };

    loadPlaylists();
  }, [token]);

  const handlePlayPlaylist = async (playlistUri: string) => {
    if (!deviceId || !token) return;
    try {
      await playPlaylist(deviceId, playlistUri, token);
      console.log("▶️ Playing playlist");
    } catch (error) {
      console.error("Failed to play playlist:", error);
    }
  };

  const handleTogglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const handleNext = async () => {
    if (!deviceId || !token) return;
    try {
      await skipToNext(deviceId, token);
    } catch (error) {
      console.error("Failed to skip:", error);
    }
  };

  const handlePrevious = async () => {
    if (!deviceId || !token) return;
    try {
      await skipToPrevious(deviceId, token);
    } catch (error) {
      console.error("Failed to skip:", error);
    }
  };

  const handleLogout = () => {
    clearToken();
    setToken(null);
    setPlayer(null);
    setDeviceId("");
    setPlaylists([]);
    setCurrentTrack(null);
    if (playerRef.current) {
      playerRef.current.disconnect();
    }
  };

  // Login screen
  if (!token) {
    return (
      <div
        className={`fixed left-4 bottom-4 lg:left-6 lg:bottom-6 z-40 w-[90vw] max-w-[340px] backdrop-blur-xl bg-black/90 border border-white/10 shadow-2xl transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-base mb-2">
            Connect Spotify
          </h3>
          <p className="text-white/60 text-xs mb-4">Sign in to play music</p>
          {authUrl ? (
            <a
              href={authUrl}
              className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold transition-all"
            >
              Sign in with Spotify
            </a>
          ) : (
            <div className="text-white/60 text-xs">Loading...</div>
          )}
        </div>
      </div>
    );
  }

  // Player screen
  return (
    <div
      className={`fixed left-4 bottom-4 lg:left-6 lg:bottom-6 z-40 w-[90vw] max-w-[340px] backdrop-blur-xl bg-black/90 border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/90 to-green-600/90 px-3 py-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <h3 className="text-white font-bold text-xs">Spotify Player</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white text-xs transition-colors"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="p-4 bg-black/40 border-b border-white/10">
          <div className="flex items-center gap-3">
            {currentTrack.album.images[0] && (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.name}
                className="w-16 h-16 object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {currentTrack.name}
              </p>
              <p className="text-white/60 text-xs truncate">
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePrevious}
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white transition-all"
            >
              {isPaused ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 18h2V6h-2zm-11 0l8.5-6L5 6z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Playlists */}
      <div className="max-h-[280px] overflow-y-auto bg-black/20">
        <div className="p-2">
          <p className="text-white/60 text-xs px-2 py-2">Your Playlists</p>
          {playlists.length === 0 ? (
            <p className="text-white/40 text-xs px-2 py-4 text-center">
              No playlists found
            </p>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handlePlayPlaylist(playlist.uri)}
                className="w-full flex items-center gap-3 p-2 hover:bg-white/10 transition-colors text-left"
              >
                {playlist.images[0] && (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-10 h-10 object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">
                    {playlist.name}
                  </p>
                  <p className="text-white/60 text-[10px] truncate">
                    {playlist.tracks.total} tracks
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
