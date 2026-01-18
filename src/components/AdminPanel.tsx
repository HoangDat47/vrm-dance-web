'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ModelManagement from './ModelManagement';
import AnimationManagement from './AnimationManagement';

interface AdminPanelProps {
  onUploadStateChange: (isUploading: boolean) => void;
  onModelsUpdate: () => void;
  onAnimationsUpdate?: () => void;
  isUploading?: boolean;
}

export default function AdminPanel({ onUploadStateChange, onModelsUpdate, onAnimationsUpdate, isUploading = false }: AdminPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'models' | 'animations'>('models');

  // Only show if user is admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleTabChange = (tab: 'models' | 'animations') => {
    if (!isUploading) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="top-20 left-4 z-50 fixed bg-white/95 shadow-2xl backdrop-blur-md border border-gray-200 w-96 max-h-[600px]">
      {/* Tabs */}
      <div className="flex border-gray-200 border-b">
        <button
          onClick={() => handleTabChange('models')}
          disabled={isUploading}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'models'
              ? 'bg-white text-violet-600 border-b-2 border-violet-600'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          title={isUploading ? 'Cannot switch tabs during upload' : 'Switch to Models tab'}
        >
          Tab Models
        </button>
        <button
          onClick={() => handleTabChange('animations')}
          disabled={isUploading}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'animations'
              ? 'bg-white text-violet-600 border-b-2 border-violet-600'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          title={isUploading ? 'Cannot switch tabs during upload' : 'Switch to Animations tab'}
        >
          Tab Animations
        </button>
      </div>

      {/* Panel Content */}
      <div className="p-4 max-h-137.75 overflow-y-auto">
        {activeTab === 'models' ? (
          <ModelManagement 
            onUploadStateChange={onUploadStateChange}
            onModelsUpdate={onModelsUpdate}
          />
        ) : (
          <AnimationManagement 
            onUploadStateChange={onUploadStateChange}
            onAnimationsUpdate={onAnimationsUpdate}
          />
        )}
      </div>
    </div>
  );
}
