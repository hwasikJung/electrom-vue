// 앱 시작 전에 콘솔 인코딩 설정
// if (process.platform === 'win32') {
//   try {
//     // Windows에서 콘솔 출력 인코딩 설정
//     import { spawnSync } from 'child_process';
//     spawnSync('chcp', ['65001'], { shell: true });
//     console.log('콘솔 인코딩이 UTF-8로 설정되었습니다.');
//   } catch (err) {
//     console.error('콘솔 인코딩 설정 오류:', err);
//   }
// }

import { config } from 'dotenv';

import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sequelize from '/models/index.js';
import Sales from '/models/Sales.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
config({ path: path.join(__dirname, '../.env') });

// 데이터베이스 초기화
sequelize
  .sync({ alter: true }) // 개발 환경에서만 사용, 프로덕션에서는 false
  .then(() => {
    console.log('데이터베이스 동기화 완료');
  })
  .catch((err) => {
    console.error('데이터베이스 동기화 오류:', err);
  });

// IPC 핸들러 설정
// IPC 핸들러 설정
ipcMain.handle('get-sales-data', async () => {
  try {
    return await Sales.findAll({
      order: [
        ['department', 'ASC'],
        ['year', 'ASC']
      ],
      raw: true // 순수 JSON 객체로 반환
    });
  } catch (err) {
    console.error('데이터 조회 오류:', err);
    return [];
  }
});

ipcMain.handle('insert-test-data', async () => {
  console.log('insert-test-data start');
  try {
    // 기존 데이터 확인
    const count = await Sales.count();

    if (count === 0) {
      // 테스트 데이터 생성
      const testData = [
        { department: '영업부', amount: 120, year: 2023 },
        { department: '마케팅부', amount: 132, year: 2023 },
        { department: '개발부', amount: 101, year: 2023 },
        { department: '인사부', amount: 134, year: 2023 },
        { department: '재무부', amount: 90, year: 2023 },
        { department: '영업부', amount: 220, year: 2024 },
        { department: '마케팅부', amount: 182, year: 2024 },
        { department: '개발부', amount: 191, year: 2024 },
        { department: '인사부', amount: 234, year: 2024 },
        { department: '재무부', amount: 290, year: 2024 }
      ];

      await Sales.bulkCreate(testData);
      console.log('테스트 데이터가 성공적으로 삽입되었습니다.');
      return true;
    } else {
      console.log('테스트 데이터가 이미 존재합니다.');
      return true;
    }
  } catch (err) {
    console.error('데이터 삽입 오류:', err);
    return false;
  }
});

// 창 상태 유지 (선택사항)
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1090,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });
  const template = [];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 개발 모드에서는 로컬 개발 서버에서 로드
  if (process.env.NODE_ENV === 'development') {
    const devUrl = process.env.BASE_URL || 'http://localhost:5252';
    console.log('dev URL:', devUrl);
    win.loadURL(devUrl).then((r) => r);
    win.webContents.openDevTools();
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    win.loadFile(path.join(__dirname, '../dist/index.html')).then((r) => r);
  }

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${process.env.BASE_URL}; img-src 'self' data:; font-src 'self' data:`
        ]
      }
    });
  });
};

app.whenReady().then(async () => {
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

// 창 컨트롤 이벤트 처리
ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});

ipcMain.on('close-window', () => {
  BrowserWindow.getFocusedWindow()?.close();
});
