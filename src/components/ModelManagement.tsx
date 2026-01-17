'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Upload, Trash2, Save } from 'lucide-react';
import dynamic from 'next/dynamic';

const VRMPreview = dynamic(() => import('@/components/VRMPreview'), { ssr: false });

interface Model {
  id: string;
  name: string;
  path: string;
  avatar: string | null;
  rotation: number;
  scale: number;
  created_at: string;
}

interface ModelManagementProps {
  onUploadStateChange: (isUploading: boolean) => void;
  onModelsUpdate: () => void;
}

export default function ModelManagement({ onUploadStateChange, onModelsUpdate }: ModelManagementProps) {
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  
  // Upload form state
  const [modelName, setModelName] = useState('');
  const [vrmFile, setVrmFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewRotation, setPreviewRotation] = useState(0);
  const [previewScale, setPreviewScale] = useState(1.25);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const clearPreview = () => {
    setModelName('');
    setVrmFile(null);
    setAvatarFile(null);
    setPreviewRotation(0);
    setPreviewScale(1.25);
    setPreviewUrl(null);
    onUploadStateChange(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      if (data.models) {
        setModels(data.models);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVrmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVrmFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onUploadStateChange(true); // pause VRM dancer while previewing
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleUploadModel = async () => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can upload models');
      return;
    }

    if (!vrmFile || !modelName) {
      alert('Please provide model name and VRM file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    onUploadStateChange(true);

    try {
      // Upload VRM file
      const vrmFileName = `${Date.now()}_${vrmFile.name}`;
      
      setUploadProgress(25);
      const { data: vrmData, error: vrmError } = await supabase.storage
        .from('vrm-models')
        .upload(vrmFileName, vrmFile);

      if (vrmError) throw vrmError;

      const vrmPath = supabase.storage.from('vrm-models').getPublicUrl(vrmFileName).data.publicUrl;
      setUploadProgress(50);

      // Upload avatar if provided
      let avatarPath = null;
      if (avatarFile) {
        const avatarFileName = `${Date.now()}_${avatarFile.name}`;
        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile);

        if (avatarError) throw avatarError;

        avatarPath = supabase.storage.from('avatars').getPublicUrl(avatarFileName).data.publicUrl;
      }
      setUploadProgress(75);

      // Create model record
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modelName,
          path: vrmPath,
          avatar: avatarPath,
          rotation: previewRotation,
          scale: previewScale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create model');
      }

      setUploadProgress(100);

      // Reset form
      clearPreview();

      // Refresh models list
      fetchModels();
      onModelsUpdate();

      alert('Model uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Failed to upload model: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      onUploadStateChange(false);
    }
  };

  const handleDeleteModel = async (model: Model) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can delete models');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${model.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/models?id=${model.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete model');
      }

      fetchModels();
      alert('Model deleted successfully!');
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Failed to delete model: ' + error.message);
    }
  };

  const handleUpdateModel = async (model: Model) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can update models');
      return;
    }

    try {
      const response = await fetch('/api/models', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: model.id,
          rotation: model.rotation,
          scale: model.scale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update model');
      }

      alert('Model updated successfully!');
      setSelectedModel(null);
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Failed to update model: ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading models...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-gray-50 p-4 border border-gray-200">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">Upload New Model</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full text-sm"
              placeholder="Enter model name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">VRM File</label>
            <input
              type="file"
              accept=".vrm"
              onChange={handleVrmFileChange}
              className="hover:file:bg-violet-100 file:bg-violet-50 file:mr-4 file:px-4 file:py-2 file:border-0 w-full file:font-semibold text-gray-600 file:text-violet-700 text-sm file:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Avatar Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hover:file:bg-violet-100 file:bg-violet-50 file:mr-4 file:px-4 file:py-2 file:border-0 w-full file:font-semibold text-gray-600 file:text-violet-700 text-sm file:text-sm"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="bg-white p-4 border border-gray-300">
              <h4 className="mb-2 font-medium text-gray-700 text-sm">Preview & Adjust</h4>
              <div className="relative bg-gray-100 mb-3 h-80 overflow-hidden">
                <VRMPreview
                  vrmUrl={previewUrl}
                  rotation={previewRotation}
                  scale={previewScale}
                />
              </div>
              <div className="gap-3 grid grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-xs">
                    Rotation (0-360°)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={previewRotation}
                    onChange={(e) => setPreviewRotation(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-xs">
                    Scale (0.5-3.0)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={previewScale}
                    onChange={(e) => setPreviewScale(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={clearPreview}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Cancel preview
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleUploadModel}
            disabled={isUploading || !vrmFile || !modelName}
            className="flex justify-center items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 px-4 py-2 w-full font-semibold text-white text-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Model'}
          </button>

          {/* Progress Bar */}
          {isUploading && (
            <div className="bg-gray-200 rounded-full w-full h-2 overflow-hidden">
              <div
                className="bg-violet-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Models List */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-900 text-lg">Existing Models ({models.length})</h3>
        <div className="space-y-2">
          {models.map((model) => (
            <div key={model.id} className="bg-white hover:bg-gray-50 p-3 border border-gray-200 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{model.name}</h4>
                  <p className="text-gray-500 text-xs">
                    Rotation: {model.rotation}° | Scale: {model.scale}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedModel(selectedModel?.id === model.id ? null : model)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 text-gray-700 text-xs transition-colors"
                  >
                    {selectedModel?.id === model.id ? 'Close' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteModel(model)}
                    className="hover:bg-red-50 p-1 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Edit Panel */}
              {selectedModel?.id === model.id && (
                <div className="mt-3 pt-3 border-gray-200 border-t">
                  <div className="gap-3 grid grid-cols-2 mb-3">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-xs">
                        Rotation (0-360°)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={selectedModel.rotation}
                        onChange={(e) => setSelectedModel({ ...selectedModel, rotation: Number(e.target.value) })}
                        className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-xs">
                        Scale (0.5-3.0)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        max="3"
                        step="0.05"
                        value={selectedModel.scale}
                        onChange={(e) => setSelectedModel({ ...selectedModel, scale: Number(e.target.value) })}
                        className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdateModel(selectedModel)}
                    className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 w-full font-semibold text-white text-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}

          {models.length === 0 && (
            <p className="py-8 text-gray-500 text-sm text-center">No models yet. Upload your first model above!</p>
          )}
        </div>
      </div>
    </div>
  );
}
