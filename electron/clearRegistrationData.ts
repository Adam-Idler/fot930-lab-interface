import fs from 'node:fs';
import { BrowserWindow, dialog } from 'electron';

export async function clearRegistrationData(filePath: string): Promise<void> {
	const mainWindow =
		BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

	if (!mainWindow) {
		dialog.showMessageBox({
			type: 'error',
			title: 'Ошибка',
			message: 'Не найдено активное окно'
		});
		return;
	}

	try {
		if (fs.existsSync(filePath)) {
			const result = await dialog.showMessageBox(mainWindow, {
				type: 'warning',
				buttons: ['Отмена', 'Очистить'],
				defaultId: 0,
				cancelId: 0,
				title: 'Подтверждение очистки',
				message: 'Очистить данные регистрации?',
				detail: 'Это действие удалит все сохраненные данные формы регистрации.'
			});

			if (result.response === 1) {
				fs.unlinkSync(filePath);
				dialog.showMessageBox(mainWindow, {
					type: 'info',
					title: 'Данные очищены',
					message: 'Данные регистрации успешно удалены'
				});
				mainWindow.webContents.reload();
			}
		} else {
			dialog.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Файл не найден',
				message: 'Файл с данными регистрации не существует'
			});
		}
	} catch (error) {
		console.error('Ошибка при удалении файла регистрации:', error);
		dialog.showMessageBox(mainWindow, {
			type: 'error',
			title: 'Ошибка',
			message: 'Не удалось очистить данные регистрации'
		});
	}
}
