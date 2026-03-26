'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

type ModalType = 'alert' | 'confirm' | 'info' | 'success' | 'error';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ModalContextType {
  showAlert: (title: string, message: string, type?: ModalType) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void, confirmLabel?: string, cancelLabel?: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
  });

  const showAlert = useCallback((title: string, message: string, type: ModalType = 'alert') => {
    setState({
      isOpen: true,
      title,
      message,
      type,
    });
  }, []);

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void, 
    confirmLabel: string = 'Confirm', 
    cancelLabel: string = 'Cancel'
  ) => {
    setState({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm,
      onCancel,
      confirmLabel,
      cancelLabel,
    });
  }, []);

  const close = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (state.onConfirm) state.onConfirm();
    close();
  };

  const handleCancel = () => {
    if (state.onCancel) state.onCancel();
    close();
  };

  const getIcon = () => {
    switch (state.type) {
      case 'success': return <CheckCircle2 className="w-16 h-16 text-emerald-500" />;
      case 'error': 
      case 'alert': return <AlertCircle className="w-16 h-16 text-red-500" />;
      case 'confirm': return <AlertTriangle className="w-16 h-16 text-amber-500" />;
      default: return <Info className="w-16 h-16 text-indigo-500" />;
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Modal 
        isOpen={state.isOpen} 
        onClose={close}
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-full bg-slate-50 dark:bg-slate-800/50">
            {getIcon()}
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 leading-none">
            {state.title}
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-sm leading-relaxed max-w-[280px]">
            {state.message}
          </p>

          <div className="flex gap-4 w-full">
            {state.type === 'confirm' && (
              <Button 
                variant="outline" 
                className="flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px]"
                onClick={handleCancel}
              >
                {state.cancelLabel}
              </Button>
            )}
            <Button 
              className={`flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px] ${
                state.type === 'alert' || state.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                state.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                'bg-slate-900 dark:bg-white dark:text-slate-900'
              }`}
              onClick={handleConfirm}
            >
              {state.confirmLabel || 'OK'}
            </Button>
          </div>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useAlertModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useAlertModal must be used within a ModalProvider');
  }
  return context;
};
