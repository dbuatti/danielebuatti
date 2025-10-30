import { toast, type ToastOptions } from "sonner"; // Import ToastOptions type

export const showSuccess = (message: string, options?: ToastOptions) => { // Add optional options parameter
  toast.success(message, options);
};

export const showError = (message: string, options?: ToastOptions) => { // Add optional options parameter
  toast.error(message, options);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => { // Allow toastId to be string or number
  toast.dismiss(toastId);
};