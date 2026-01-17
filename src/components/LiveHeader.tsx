'use client';

import { Users, LogOut, User } from 'lucide-react';
import { ModelCombobox } from './ModelCombobox';
import { BackgroundCombobox } from './BackgroundCombobox';
import { useAuth } from '@/lib/auth-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LiveHeaderProps {
  viewerCount: number;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  selectedBackgroundId: string;
  onSelectBackground: (backgroundId: string) => void;
}

export default function LiveHeader({ 
  viewerCount, 
  selectedModelId, 
  onSelectModel,
  selectedBackgroundId,
  onSelectBackground
}: LiveHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="top-4 z-50 fixed inset-x-0 flex justify-center px-3">
      <div className="flex items-center gap-3 bg-white/90 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.55)] backdrop-blur-xl px-4 py-2 border border-white/60 rounded-full w-[min(1120px,calc(100%-16px))]">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-neutral-900 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] border border-neutral-200 rounded-full w-10 h-10 font-semibold text-white text-xs uppercase tracking-[0.08em]">
              VR
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-neutral-900 text-sm">Sousharu Live</p>
              <p className="text-neutral-500 text-xs">VRM Dance Studio</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-medium text-neutral-600 text-sm">
            <span className="inline-flex relative w-2 h-2">
              <span className="absolute inset-0 bg-emerald-500 opacity-90 rounded-full" />
              <span className="absolute inset-0 bg-emerald-500 opacity-30 blur-[1px] rounded-full" />
            </span>
            <span className="text-neutral-800 uppercase tracking-wide">Live</span>
            <span className="flex items-center gap-1 text-neutral-600">
              <Users className="w-3.5 h-3.5" />
              {viewerCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-2">
          <BackgroundCombobox 
            selectedBackgroundId={selectedBackgroundId}
            onSelectBackground={onSelectBackground}
          />
          <ModelCombobox 
            selectedModelId={selectedModelId}
            onSelectModel={onSelectModel}
          />
          
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 bg-gradient-to-br from-purple-600 hover:from-purple-700 to-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl px-4 py-2 rounded-full font-medium text-white text-sm transition-all">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.username || user.email}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-64">
                <div className="space-y-3">
                  <div className="pb-3 border-b">
                    <p className="font-semibold text-sm">{user.username || 'User'}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-purple-100 px-2 py-1 rounded-md font-medium text-purple-800 text-xs uppercase">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center gap-2 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}