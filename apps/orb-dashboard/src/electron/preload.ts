import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: (): Promise<any> => ipcRenderer.invoke('get-system-info'),
  openCommAnalytics: (): Promise<any> => ipcRenderer.invoke('open-comm-analytics'),
  saveData: (payload: any): Promise<any> => ipcRenderer.invoke('save-data', payload),
  runMountNas: (): Promise<any> => ipcRenderer.invoke('run-mount-nas'),
  saveNasCreds: (creds: any): Promise<any> => ipcRenderer.invoke('save-nas-creds', creds),
  loadNasCreds: (): Promise<any> => ipcRenderer.invoke('load-nas-creds'),
});