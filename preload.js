const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title, body) => ipcRenderer.send('notify', { title, body })
});
