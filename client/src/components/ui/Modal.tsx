import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className={`relative bg-white dark:bg-slate-900 w-full ${sizes[size]} rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden`}>
        {showClose && (
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors z-50"
          >
            <XCircle className="w-8 h-8" />
          </button>
        )}

        {(title || description) && (
          <div className="text-center mb-10 pr-4">
            {title && (
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 pr-6">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};
