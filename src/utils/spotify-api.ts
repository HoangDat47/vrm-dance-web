export const fetchUserPlaylists = async (token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch playlists');
  
  return response.json();
};

export const fetchPlaylist = async (playlistId: string, token: string) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch playlist');
  
  return response.json();
};

export const playPlaylist = async (deviceId: string, playlistUri: string, token: string) => {
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      context_uri: playlistUri
    })
  });
};

export const pausePlayback = async (deviceId: string, token: string) => {
  await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const resumePlayback = async (deviceId: string, token: string) => {
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const skipToNext = async (deviceId: string, token: string) => {
  await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const skipToPrevious = async (deviceId: string, token: string) => {
  await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
};
