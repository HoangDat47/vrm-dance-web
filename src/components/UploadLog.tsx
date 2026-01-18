'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

interface UploadLogProps {
  logs: LogEntry[];
  onClear: () => void;
  isUploading: boolean;
}

export default function UploadLog({ logs, onClear, isUploading }: UploadLogProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (logs.length === 0 && !isUploading) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="bg-gray-900 mt-4 border border-gray-700 rounded-lg max-h-64 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 px-4 py-3 border-gray-700 border-b">
        <h4 className="font-semibold text-gray-100 text-sm">Upload Log</h4>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-200 transition-colors"
          title="Clear logs"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Log Content */}
      <div className="space-y-1 bg-gray-950 p-3 max-h-56 overflow-y-auto font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-500">Waiting for upload to start...</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`flex gap-2 items-start py-1 px-2 rounded transition-colors ${getLevelColor(log.level)}`}
            >
              <span className="w-4 font-bold shrink-0">{getLevelIcon(log.level)}</span>
              <div className="flex-1 min-w-0">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className="ml-2">{log.message}</span>
              </div>
            </div>
          ))
        )}
        <div ref={scrollEndRef} />
      </div>

      {/* Loading indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 border-gray-700 border-t">
          <div className="flex gap-1">
            <span className="inline-block bg-violet-500 rounded-full w-2 h-2 animate-bounce"></span>
            <span
              className="inline-block bg-violet-500 rounded-full w-2 h-2 animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></span>
            <span
              className="inline-block bg-violet-500 rounded-full w-2 h-2 animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></span>
          </div>
          <span className="text-gray-300 text-xs">Upload in progress...</span>
        </div>
      )}
    </div>
  );
}
