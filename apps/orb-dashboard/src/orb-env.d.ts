// Global augmentation for window.electronAPI exposed via Electron preload
declare global {
  interface Window {
    electronAPI?: {
      getSystemInfo: () => Promise<any>;
      openCommAnalytics: () => Promise<{ success: boolean; message: string }>;
      saveData: (payload: any) => Promise<{ saved: string }>;
      runMountNas: () => Promise<{ stdout?: string; stderr?: string; success: boolean }>;
      saveNasCreds: (creds: any) => Promise<{ success: boolean; message: string }>;
      loadNasCreds: () => Promise<{ success: boolean; creds?: any; message?: string }>;
    };
  }
}

export {};