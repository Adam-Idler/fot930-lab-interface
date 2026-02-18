import { Show } from '../../../lib/components';
import type { DeviceState } from '../../../types/fot930';

interface ScreenSettingsProps {
	state: DeviceState;
}

export function ScreenSettings({ state }: ScreenSettingsProps) {
	const menuItems = [
		'Устройство',
		'Автоимена данных',
		'Порог. значения',
		'Измеритель мощности',
		'Измеритель ORL',
		'FasTest'
	];
	const selectedIndex = state.settingsMenuIndex;

	return (
		<div className="flex flex-col w-full h-full p-3">
			<div className="text-lg font-bold mb-3 pb-1 border-b border-fot930-blue text-fot930-blue">
				Настройка
			</div>

			<div className="space-y-1">
				{menuItems.map((item, index) => (
					<div
						key={item}
						className={`px-3 py-1 text-sm ${
							index === selectedIndex
								? 'bg-fot930-blue text-white'
								: 'text-gray-800'
						}`}
					>
						<Show when={index === selectedIndex}>▶ </Show>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}
