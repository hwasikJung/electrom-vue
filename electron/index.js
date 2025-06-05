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

import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
config({ path: path.join(__dirname, '../.env') });

console.log('.env:', {
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL
});

// PostgreSQL 연결 설정
const pool = new Pool({
  host: process.env.DB_HOST || '223.195.131.15',
  user: process.env.DB_USER || 'ibed_user01',
  password: process.env.DB_PASSWORD || 'Passw0rd',
  database: process.env.DB_NAME || 'ibedmst',
  port: parseInt(process.env.DB_PORT || '15432'),
  schema: process.env.DB_SCHEMA || 'sc_portal'
});

// IPC 핸들러 설정
ipcMain.handle('get-sales-data', async () => {
  try {
    const query = `
      SELECT department, amount, year
      FROM sc_portal.test_sales
      ORDER BY department, year
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('데이터 조회 오류:', err);
    return [];
  }
});

ipcMain.handle('insert-test-data', async () => {
  try {
    // 테이블이 없으면 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_sales (
        department VARCHAR(20),
        amount INTEGER,
        year INTEGER
      )
    `);

    // 기존 데이터 확인
    const result = await pool.query(
      'SELECT COUNT(*) FROM sc_portal.test_sales'
    );
    if (parseInt(result.rows[0].count) === 0) {
      // 테스트 데이터 삽입
      await pool.query(`
        INSERT INTO test_sales (department, amount, year) VALUES
        ('영업부', 120, 2023),
        ('마케팅부', 132, 2023),
        ('개발부', 101, 2023),
        ('인사부', 134, 2023),
        ('재무부', 90, 2023),
        ('영업부', 220, 2024),
        ('마케팅부', 182, 2024),
        ('개발부', 191, 2024),
        ('인사부', 234, 2024),
        ('재무부', 290, 2024)
      `);
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
