import path from 'node:path';
import { app, BrowserWindow, Menu } from 'electron';

app.whenReady().then(() => {
	const win = new BrowserWindow({
		title: 'Main window'
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(process.env.VITE_DEV_SERVER_URL);
		win.webContents.openDevTools();

		win.autoHideMenuBar = false;
	} else {
		const appPath = app.getAppPath();
		const indexPath = path.resolve(appPath, 'dist', 'index.html');
		win.loadFile(indexPath);

		Menu.setApplicationMenu(null);
		win.autoHideMenuBar = true;
	}
});

// Hot reload
process.on('message', (msg) => {
	if (msg === 'electron-vite&type=hot-reload') {
		for (const win of BrowserWindow.getAllWindows()) {
			win.webContents.reload();
		}
	}
});
