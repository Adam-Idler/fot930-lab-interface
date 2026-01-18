import { contextBridge, ipcRenderer } from 'electron';
import type { Student } from '../src/types';

contextBridge.exposeInMainWorld('electronAPI', {
	saveStudent: (data: Student) => ipcRenderer.invoke('save-student', data),
	loadStudent: () => ipcRenderer.invoke('load-student')
});
