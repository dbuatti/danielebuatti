import { toast, type ExternalToast } from "sonner"; // Corrected import to ExternalToast

export const showSuccess = (message: string, options?: ExternalToast) => { // Use ExternalToast
  toast.success(message, options);
};

export const showError = (message: string, options?: ExternalToast) => { // Use ExternalToast
  toast.error(message, options);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};