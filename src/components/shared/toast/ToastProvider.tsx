'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, ShoppingCart, Trash2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'cart' | 'remove';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  success: <CheckCircle className="w-5 h-5 text-[#22C55E]" />,
  error: <AlertCircle className="w-5 h-5 text-[#EF4444]" />,
  info: <Info className="w-5 h-5 text-[#3B82F6]" />,
  cart: <ShoppingCart className="w-5 h-5 text-[#E8C547]" />,
  remove: <Trash2 className="w-5 h-5 text-[#EF4444]" />,
};

const borderColors = {
  success: 'border-l-[#22C55E]',
  error: 'border-l-[#EF4444]',
  info: 'border-l-[#3B82F6]',
  cart: 'border-l-[#E8C547]',
  remove: 'border-l-[#EF4444]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-center gap-3 
              min-w-[300px] max-w-[400px]
              px-4 py-3 
              bg-[#161616] 
              border border-[#2A2A2A] border-l-4 ${borderColors[toast.type]}
              rounded-lg shadow-lg shadow-black/50
              transform transition-all duration-300 ease-out
              animate-in slide-in-from-right-4 fade-in
            `}
          >
            <div className="flex-shrink-0">
              {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm text-[#F5F5F3] font-medium">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 hover:bg-[#2A2A2A] rounded transition-colors"
            >
              <X className="w-4 h-4 text-[#888888]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
