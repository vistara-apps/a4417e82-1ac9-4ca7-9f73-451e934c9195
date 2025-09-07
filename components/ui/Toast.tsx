'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'border-green-400 bg-green-500 bg-opacity-20',
  error: 'border-red-400 bg-red-500 bg-opacity-20',
  warning: 'border-yellow-400 bg-yellow-500 bg-opacity-20',
  info: 'border-blue-400 bg-blue-500 bg-opacity-20',
};

function ToastItem({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        'glass-card border-l-4 p-4 shadow-lg animate-slide-up',
        toastStyles[type]
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white">{title}</h4>
          {message && (
            <p className="text-sm text-white text-opacity-80 mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-white text-opacity-60 hover:text-opacity-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast container component
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    (window as any).addToast = addToast;
    return () => {
      delete (window as any).addToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

// Helper function to show toasts
export const toast = {
  success: (title: string, message?: string) => {
    if (typeof window !== 'undefined' && (window as any).addToast) {
      (window as any).addToast({ type: 'success', title, message });
    }
  },
  error: (title: string, message?: string) => {
    if (typeof window !== 'undefined' && (window as any).addToast) {
      (window as any).addToast({ type: 'error', title, message });
    }
  },
  warning: (title: string, message?: string) => {
    if (typeof window !== 'undefined' && (window as any).addToast) {
      (window as any).addToast({ type: 'warning', title, message });
    }
  },
  info: (title: string, message?: string) => {
    if (typeof window !== 'undefined' && (window as any).addToast) {
      (window as any).addToast({ type: 'info', title, message });
    }
  },
};
