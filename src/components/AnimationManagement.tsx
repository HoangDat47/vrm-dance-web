'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Upload, Trash2, Music } from 'lucide-react';
import UploadLog, { LogEntry } from '@/components/UploadLog';

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, idx);
  return `${value.toFixed(value >= 10 || value < 1 ? 1 : 2)} ${units[idx]}`;
};

interface Animation {
  id: string;
  name: string;
  path: string;
  duration: number | null;
  created_at: string;
}

interface AnimationManagementProps {
  onAnimationsUpdate?: () => void;
  onUploadStateChange?: (isUploading: boolean) => void;
}

type UploadStep = 'idle' | 'animation' | 'db';

interface UploadStats {
  total: number;
  uploaded: number;
  speedMbps: number | null;
}

export default function AnimationManagement({ onAnimationsUpdate, onUploadStateChange }: AnimationManagementProps) {
  const { user } = useAuth();
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<UploadStep>('idle');
  const [uploadStats, setUploadStats] = useState<UploadStats>({ total: 0, uploaded: 0, speedMbps: null });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Upload form state
  const [animationName, setAnimationName] = useState('');
  const [animationFile, setAnimationFile] = useState<File | null>(null);

  const addLog = (message: string, level: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp,
      level,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const clearForm = () => {
    setAnimationName('');
    setAnimationFile(null);
    setUploadStats({ total: 0, uploaded: 0, speedMbps: null });
    setUploadStep('idle');
    clearLogs();
    onUploadStateChange?.(false);
  };

  useEffect(() => {
    fetchAnimations();
  }, []);

  const fetchAnimations = async () => {
    try {
      const response = await fetch('/api/animations');
      const data = await response.json();
      if (data.animations) {
        setAnimations(data.animations);
      }
    } catch (error) {
      console.error('Error fetching animations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file extension
      if (!file.name.endsWith('.vrma')) {
        alert('Please select a .vrma file');
        return;
      }
      setAnimationFile(file);
    }
  };

  const handleUploadAnimation = async () => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can upload animations');
      return;
    }

    if (!animationFile || !animationName) {
      alert('Please provide animation name and file');
      return;
    }

    clearLogs();
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStep('animation');
    setUploadStats({ total: animationFile.size, uploaded: 0, speedMbps: null });
    onUploadStateChange?.(true);

    addLog(`Starting upload for animation: "${animationName}"`, 'info');
    addLog(`Animation file: ${animationFile.name} (${formatBytes(animationFile.size)})`, 'info');

    try {
      // Upload animation file
      addLog('Uploading animation file...', 'info');
      // Use timestamp + extension only to avoid special character issues
      const fileExtension = animationFile.name.split('.').pop() || 'vrma';
      const fileName = `${Date.now()}.${fileExtension}`;
      
      setUploadProgress(10);
      const uploadStart = performance.now();
      
      const { data: animationData, error: animationError } = await supabase.storage
        .from('animations')
        .upload(fileName, animationFile);

      if (animationError) throw animationError;

      const uploadDuration = Math.max(performance.now() - uploadStart, 1);
      const speedMbps = (animationFile.size / (1024 * 1024)) / (uploadDuration / 1000);
      setUploadStats({ total: animationFile.size, uploaded: animationFile.size, speedMbps });
      addLog(`Animation uploaded successfully (${speedMbps.toFixed(2)} MB/s)`, 'success');

      const animationPath = supabase.storage.from('animations').getPublicUrl(fileName).data.publicUrl;
      setUploadProgress(70);

      setUploadStep('db');
      addLog('Saving animation to database...', 'info');

      // Create animation record
      const response = await fetch('/api/animations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: animationName,
          path: animationPath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create animation');
      }

      addLog('Animation saved to database successfully', 'success');
      setUploadProgress(100);
      setUploadStep('idle');
      addLog('Upload completed successfully!', 'success');

      // Reset form
      clearForm();

      // Refresh animations list
      fetchAnimations();
      onAnimationsUpdate?.();

      alert('Animation uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      addLog(`Error: ${error.message}`, 'error');
      addLog('Upload failed. Check the console for details.', 'error');
      alert('Failed to upload animation: ' + error.message);
      setUploadStep('idle');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      onUploadStateChange?.(false);
    }
  };

  const handleDeleteAnimation = async (animation: Animation) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can delete animations');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${animation.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/animations?id=${animation.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete animation');
      }

      fetchAnimations();
      onAnimationsUpdate?.();
      alert('Animation deleted successfully!');
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Failed to delete animation: ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading animations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-gray-50 p-4 border border-gray-200">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">Upload New Animation</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Animation Name</label>
            <input
              type="text"
              value={animationName}
              onChange={(e) => setAnimationName(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full text-sm"
              placeholder="Enter animation name"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Animation File (.vrma)</label>
            <div className="relative">
              <input
                type="file"
                accept=".vrma"
                onChange={handleFileChange}
                className="hidden"
                id="animation-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="animation-upload"
                className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 text-gray-700 text-sm transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {animationFile ? animationFile.name : 'Choose .vrma file'}
              </label>
            </div>
            {animationFile && (
              <p className="mt-1 text-gray-500 text-xs">
                Size: {formatBytes(animationFile.size)}
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">
                  {uploadStep === 'animation' && '📤 Uploading animation...'}
                  {uploadStep === 'db' && '💾 Saving to database...'}
                </span>
                <span className="font-medium text-violet-600">{uploadProgress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full w-full h-2 overflow-hidden">
                <div
                  className="bg-violet-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              {uploadStats.speedMbps && (
                <p className="text-gray-500 text-xs">
                  Speed: {uploadStats.speedMbps.toFixed(2)} MB/s
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleUploadAnimation}
            disabled={isUploading || !animationFile || !animationName}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 px-4 py-2 rounded text-white text-sm transition-colors disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Animation'}
          </button>

          {/* Upload Log */}
          <UploadLog logs={logs} onClear={clearLogs} isUploading={isUploading} />
        </div>
      </div>

      {/* Animation List */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-900 text-lg">
          Animations ({animations.length})
        </h3>
        
        {animations.length === 0 ? (
          <p className="text-gray-500 text-sm">No animations uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {animations.map((animation) => (
              <div
                key={animation.id}
                className="flex justify-between items-center bg-white hover:bg-gray-50 p-3 border border-gray-200 transition-colors"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <Music className="flex-shrink-0 w-5 h-5 text-violet-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {animation.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(animation.created_at).toLocaleDateString()}
                      {animation.duration && ` • ${animation.duration.toFixed(1)}s`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAnimation(animation)}
                  className="flex-shrink-0 p-2 text-red-600 hover:text-red-700"
                  title="Delete animation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
