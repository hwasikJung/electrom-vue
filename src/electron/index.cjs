import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 창 상태 유지 (선택사항)
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1090,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      // preload: path.join(__dirname, 'preload.js')
    }
  });
  const template = [];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 개발 모드에서는 로컬 개발 서버에서 로드
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5252/');
    win.webContents.openDevTools();
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
