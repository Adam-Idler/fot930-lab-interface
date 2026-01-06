import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { appendServiceMenuItem } from './appendServiceMenuItem';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studentFilePath = path.join(app.getPath('userData'), 'student_data.json');

app.whenReady().then(() => {
	const appPath = app.getAppPath();
	const win = new BrowserWindow({
		title: 'Main window',
		width: 960,
		height: 700,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	appendServiceMenuItem(studentFilePath);

	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(process.env.VITE_DEV_SERVER_URL);
		win.webContents.openDevTools();

		win.autoHideMenuBar = false;
	} else {
		const indexPath = path.resolve(appPath, 'dist', 'index.html');
		win.loadFile(indexPath);

		Menu.setApplicationMenu(null);
		win.autoHideMenuBar = true;
	}
});

// Обработчики чтения/записи данных студента через IPC
ipcMain.handle('save-student', async (_, data) => {
	fs.writeFileSync(studentFilePath, JSON.stringify(data, null, 2), 'utf-8');
	return true;
});

ipcMain.handle('load-student', async () => {
	if (fs.existsSync(studentFilePath)) {
		const content = fs.readFileSync(studentFilePath, 'utf-8');
		return JSON.parse(content);
	}
	return null;
});

// Hot reload
process.on('message', (msg) => {
	if (msg === 'electron-vite&type=hot-reload') {
		for (const win of BrowserWindow.getAllWindows()) {
			win.webContents.reload();
		}
	}
});
