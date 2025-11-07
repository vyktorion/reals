import { toast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'destructive' | 'default';
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      if (variant === 'destructive') {
        toast.error(title, { description });
      } else {
        toast.success(title, { description });
      }
    }
  };
};