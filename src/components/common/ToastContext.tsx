import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Zap, Trophy, ShieldCheck } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'success', duration = 3500 }: Omit<ToastItem, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: ToastItem = { id, title, message, type, duration };
    setToasts(prev => [...prev.slice(-3), newToast]); // keep max 4 at once

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Viewport */}
      <div 
        aria-live="polite"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
      >
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto p-4 rounded-2xl shadow-2xl bg-white border flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-top-3 fade-in ${
                isSuccess
                  ? 'border-emerald-300 shadow-emerald-950/10 text-slate-900'
                  : isWarning
                  ? 'border-amber-300 shadow-amber-950/10 text-slate-900'
                  : isError
                  ? 'border-red-300 shadow-red-950/10 text-slate-900'
                  : 'border-slate-300 shadow-slate-950/10 text-slate-900'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center border border-orange-200">
                    <Zap className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
                {isError && (
                  <div className="w-7 h-7 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                    <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
                {!isSuccess && !isWarning && !isError && (
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center border border-blue-200">
                    <Info className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 font-sans">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
