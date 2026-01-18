'use client';

import { useEffect, useState } from 'react';
import { testSupabaseConnection, testSupabaseAuth } from '@/utils/test-supabase';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const connResult = await testSupabaseConnection();
    const authResult = await testSupabaseAuth();
    setConnectionStatus(connResult);
    setAuthStatus(authResult);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="bg-gray-900 p-8 min-h-screen text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-bold text-3xl">🔧 Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="mb-2 font-semibold text-xl">Database Connection</h2>
            <div className="flex items-center gap-2">
              {loading ? (
                <span>⏳ Testing...</span>
              ) : connectionStatus === null ? (
                <span>❓ Not tested yet</span>
              ) : connectionStatus ? (
                <span className="text-green-400">✅ Connected</span>
              ) : (
                <span className="text-red-400">❌ Failed</span>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="mb-2 font-semibold text-xl">Authentication Service</h2>
            <div className="flex items-center gap-2">
              {loading ? (
                <span>⏳ Testing...</span>
              ) : authStatus === null ? (
                <span>❓ Not tested yet</span>
              ) : authStatus ? (
                <span className="text-green-400">✅ Available</span>
              ) : (
                <span className="text-red-400">❌ Failed</span>
              )}
            </div>
          </div>

          <button
            onClick={runTests}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Testing...' : 'Run Tests Again'}
          </button>

          <div className="bg-gray-800 mt-8 p-6 rounded-lg">
            <h3 className="mb-2 font-semibold">ℹ️ Environment Variables:</h3>
            <div className="space-y-1 font-mono text-sm">
              <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Not set'}</div>
              <div>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="mb-2 font-semibold">💡 Tip:</h3>
            <p className="text-gray-400 text-sm">
              Mở Console (F12) để xem chi tiết logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
