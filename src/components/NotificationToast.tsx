import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, ShieldAlert, X, Zap } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toasts,
  onDismiss
}) => {
  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full font-mono pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const borderColor = 
            toast.type === 'success' ? 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300' :
            toast.type === 'warning' ? 'border-amber-500/60 bg-amber-950/80 text-amber-300' :
            toast.type === 'error' ? 'border-rose-500/60 bg-rose-950/80 text-rose-300' :
            'border-cyan-500/60 bg-cyan-950/80 text-cyan-300';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-3.5 rounded-xl border backdrop-blur-md shadow-2xl pointer-events-auto flex items-start gap-3 ${borderColor}`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
              {toast.type === 'error' && <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
              {toast.type === 'info' && <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />}

              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-100">{toast.title}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">{toast.description}</div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-slate-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
