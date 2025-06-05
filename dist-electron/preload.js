const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  getSalesData: () => ipcRenderer.invoke("get-sales-data"),
  insertTestData: () => ipcRenderer.invoke("insert-test-data"),
  minimize: () => ipcRenderer.send("minimize-window"),
  maximize: () => ipcRenderer.send("maximize-window"),
  close: () => ipcRenderer.send("close-window")
});
