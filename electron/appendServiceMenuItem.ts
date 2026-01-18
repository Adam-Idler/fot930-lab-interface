import { Menu, MenuItem } from 'electron';
import { clearRegistrationData } from './clearRegistrationData';

export function appendServiceMenuItem(registrationDataPath: string) {
	// Получаем текущее меню или создаем стандартное
	const menu = Menu.getApplicationMenu() || new Menu();

	// Добавляем новый пункт в конец
	menu.append(
		new MenuItem({
			label: 'Сервис',
			submenu: [
				{
					label: 'Очистить данные регистрации',
					accelerator: 'CmdOrCtrl+Shift+D',
					click: async () => {
						await clearRegistrationData(registrationDataPath);
					}
				}
			]
		})
	);

	Menu.setApplicationMenu(menu);
}
