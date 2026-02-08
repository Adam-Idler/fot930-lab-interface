import { Show } from '../../../lib/components';
import type { DeviceState } from '../../../types/fot930';

interface ScreenMenuSetupProps {
	state: DeviceState;
}

export function ScreenMenuSetup({ state }: ScreenMenuSetupProps) {
	const menuItems = ['Setup'];
	const selectedIndex = state.setupMenuIndex;

	return (
		<div className="flex flex-col w-full h-full p-3">
			<div className="text-lg font-bold mb-3 pb-1 border-b border-fot930-blue text-fot930-blue">
				Menu
			</div>

			<div className="space-y-2">
				{menuItems.map((item, index) => (
					<div
						key={item}
						className={`px-3 py-2 text-sm ${
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

			<div className="mt-auto text-[10px] text-gray-500 text-center">
				UP/DOWN: Navigation
			</div>
		</div>
	);
}
