import clsx from 'clsx';
import { Show } from '../../../lib/components';
import type { DeviceState } from '../../../types/fot930';

interface ScreenSourceVflMenuProps {
	state: DeviceState;
}

const menuItems = ['Источник', 'VFL', 'Видеомикроскоп'];

export function ScreenSourceVflMenu({ state }: ScreenSourceVflMenuProps) {
	const selectedIndex = state.vflMenuIndex;

	return (
		<div className="flex flex-col w-full h-full p-3">
			<div className="text-lg font-bold mb-3 pb-1 border-b border-fot930-blue text-fot930-blue">
				Источник/VFL/Видеомикроскоп
			</div>

			<div className="space-y-1">
				{menuItems.map((item, index) => {
					const isSelected = index === selectedIndex;
					const rowClass = clsx(
						'px-3 py-1 text-sm',
						isSelected && 'bg-fot930-blue text-white',
						!isSelected && 'text-gray-800'
					);

					return (
						<div key={item} className={rowClass}>
							<Show when={isSelected}>▶ </Show>
							{item}
						</div>
					);
				})}
			</div>
		</div>
	);
}
