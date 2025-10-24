'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCodeForToken, saveToken } from '@/utils/spotify-auth';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Authenticating with Spotify...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const handleAuth = async () => {
      if (error) {
        setStatus(`Authentication error: ${error}`);
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      if (code) {
        try {
          console.log('🔑 Got code:', code.substring(0, 20) + '...');
          setStatus('Exchanging code for access token...');
          
          const token = await exchangeCodeForToken(code);
          
          if (token) {
            console.log('✅ Got token:', token.substring(0, 20) + '...');
            saveToken(token);
            setStatus('✅ Success! Redirecting to home...');
            
            setTimeout(() => {
              router.push('/');
            }, 1000);
          } else {
            setStatus('❌ Failed to get access token. Redirecting...');
            setTimeout(() => router.push('/'), 3000);
          }
        } catch (error) {
          console.error('Auth error:', error);
          setStatus('❌ Authentication failed. Redirecting...');
          setTimeout(() => router.push('/'), 3000);
        }
      } else {
        setStatus('No authorization code received. Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-semibold mb-2">{status}</p>
        <p className="text-white/60 text-sm">Please wait...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
