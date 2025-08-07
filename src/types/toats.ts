// types/toast.ts
export type ToastType = 'success' | 'error' | 'warning' | 'info';

type DEFAULT_TOAST_DURATION = 5000;
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: DEFAULT_TOAST_DURATION;
}
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export type { ToastContextType};

