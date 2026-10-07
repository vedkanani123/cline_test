import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { uid } from './demo';

type ToastTone = 'good' | 'info' | 'warn';
type ToastItem = { id: string; message: string; tone: ToastTone };

type ToastContextValue = { toast: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = 'good') => {
      const item: ToastItem = { id: uid('toast'), message, tone };
      setItems((prev) => [...prev.slice(-2), item]);
      window.setTimeout(() => dismiss(item.id), 4200);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`toast toast--${item.tone}`}>
            <span className="toast__text">{item.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
}
