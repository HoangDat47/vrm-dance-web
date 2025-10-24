const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative'
].join(' ');

// ✅ Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Generate code verifier and challenge for PKCE
const generateRandomString = (length: number): string => {
  if (!isBrowser) return '';
  
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string): Promise<ArrayBuffer | null> => {
  if (!isBrowser || !window.crypto?.subtle) {
    console.warn('crypto.subtle not available');
    return null;
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// ✅ Generate auth URL (client-side only)
export const getAuthUrl = async (): Promise<string> => {
  if (!isBrowser) {
    return '';
  }

  try {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    
    if (!hashed) {
      console.error('Failed to generate code challenge');
      return '';
    }
    
    const codeChallenge = base64encode(hashed);

    // Save code verifier to localStorage
    localStorage.setItem('code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  } catch (error) {
    console.error('Failed to generate auth URL:', error);
    return '';
  }
};

// Exchange code for token
export const exchangeCodeForToken = async (code: string): Promise<string | null> => {
  if (!isBrowser) return null;
  
  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) {
    console.error('No code verifier found');
    return null;
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Token exchange failed:', error);
      return null;
    }

    const data = await response.json();
    
    if (data.access_token) {
      localStorage.removeItem('code_verifier');
      return data.access_token;
    }
  } catch (error) {
    console.error('Failed to exchange code for token:', error);
  }

  return null;
};

// Get code from URL
export const getCodeFromUrl = (): string | null => {
  if (!isBrowser) return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
};

export const saveToken = (token: string) => {
  if (!isBrowser) return;
  localStorage.setItem('spotify_token', token);
  localStorage.setItem('spotify_token_timestamp', Date.now().toString());
};

export const getStoredToken = (): string | null => {
  if (!isBrowser) return null;
  
  const token = localStorage.getItem('spotify_token');
  const timestamp = localStorage.getItem('spotify_token_timestamp');
  
  if (!token || !timestamp) return null;
  
  const hourInMs = 3600000;
  if (Date.now() - parseInt(timestamp) > hourInMs) {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_timestamp');
    return null;
  }
  
  return token;
};

export const clearToken = () => {
  if (!isBrowser) return;
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_token_timestamp');
  localStorage.removeItem('code_verifier');
};
