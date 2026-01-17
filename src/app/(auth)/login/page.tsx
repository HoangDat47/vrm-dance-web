'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Login successful, navigate to home
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <div className="flex flex-1 justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 w-full max-w-md">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="flex justify-center items-center bg-linear-to-br from-violet-600 to-indigo-600 w-12 h-12">
                <span className="font-bold text-white text-xl">S</span>
              </div>
              <span className="font-semibold text-gray-900 text-xl">Sousharu</span>
            </div>
            <h2 className="font-bold text-gray-900 text-3xl tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 mt-10">
            {error && (
              <div className="bg-red-50 p-4 border-red-500 border-l-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700 text-sm">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-4 py-3 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:text-sm transition-all appearance-none placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block px-4 py-3 pr-11 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:text-sm transition-all appearance-none placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="border-gray-300 focus:ring-violet-500 w-4 h-4 text-violet-600 cursor-pointer"
                />
                <label htmlFor="remember-me" className="block ml-2 text-gray-700 text-sm cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex justify-center bg-linear-to-r from-violet-600 hover:from-violet-700 to-indigo-600 hover:to-indigo-700 disabled:opacity-50 shadow-sm px-4 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 w-full font-semibold text-white text-sm transition-all disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center items-center bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-12">
        <div className="max-w-md text-center">
          <div className="mb-10">
            <div className="inline-flex justify-center items-center bg-white/10 backdrop-blur-lg mb-8 w-24 h-24">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-5 font-bold text-white text-4xl">
              VRM Dance Studio
            </h2>
            <p className="text-violet-100 text-lg leading-relaxed">
              Create amazing VRM character animations with music. Professional tools for creators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
