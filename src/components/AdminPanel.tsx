'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ModelManagement from './ModelManagement';

interface AdminPanelProps {
  onUploadStateChange: (isUploading: boolean) => void;
  onModelsUpdate: () => void;
}

export default function AdminPanel({ onUploadStateChange, onModelsUpdate }: AdminPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'models' | 'animations'>('models');

  // Only show if user is admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="top-20 left-4 z-50 fixed bg-white/95 shadow-2xl backdrop-blur-md border border-gray-200 w-96 max-h-[600px]">
      {/* Tabs */}
      <div className="flex border-gray-200 border-b">
        <button
          onClick={() => setActiveTab('models')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'models'
              ? 'bg-white text-violet-600 border-b-2 border-violet-600'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          }`}
        >
          Tab Models
        </button>
        <button
          onClick={() => setActiveTab('animations')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'animations'
              ? 'bg-white text-violet-600 border-b-2 border-violet-600'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          }`}
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
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Animation Management</h3>
            <p className="text-gray-600 text-sm">Manage animations here</p>
            {/* Add your animation content here */}
          </div>
        )}
      </div>
    </div>
  );
}
