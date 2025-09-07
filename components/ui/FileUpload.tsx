'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { IPFSService } from '@/lib/services/ipfs';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File | null;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size exceeds 10MB limit');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('File type not supported');
      } else {
        setError('Invalid file');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Additional validation using IPFSService
      const validation = IPFSService.validateFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-gray-600 hover:border-gray-500',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-red-400 bg-red-400/10'
          )}
        >
          <input {...getInputProps()} />
          
          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          
          {isDragActive ? (
            <p className="text-blue-400">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-white mb-2">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-sm text-gray-400">
                PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
