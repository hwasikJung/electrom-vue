// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 차트 데이터 가져오기
  getChartData: () => ipcRenderer.invoke('get-chart-data'),

  // 윈도우 컨트롤 (최소화, 최대화, 닫기)
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window')
});
