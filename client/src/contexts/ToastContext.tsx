'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in slide-in-from-right-10 fade-in duration-300 ${
              t.type === 'error' ? 'border-red-100 dark:border-red-500/20' : 
              t.type === 'success' ? 'border-emerald-100 dark:border-emerald-500/20' : ''
            }`}
          >
            <div className={`p-2 rounded-2xl flex-shrink-0 ${
              t.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' :
              t.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' :
              'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500'
            }`}>
              {t.type === 'success' ? <CheckCircle2 size={24} /> : 
               t.type === 'error' ? <AlertCircle size={24} /> : <Info size={24} />}
            </div>
            
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight leading-relaxed flex-1">
              {t.message}
            </p>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
