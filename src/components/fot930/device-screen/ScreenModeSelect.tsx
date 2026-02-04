import {
	getAvailableModes,
	getCurrentMode
} from '../../../lib/fot930/deviceReducer';
import type { DeviceState } from '../../../types/fot930';

interface ScreenModeSelectProps {
	state: DeviceState;
}

export function ScreenModeSelect({ state }: ScreenModeSelectProps) {
	const modes = getAvailableModes();
	const currentMode = getCurrentMode(state);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="text-sm font-bold border-b border-fot930-blue pb-2 mb-3 text-fot930-blue">
				SELECT MODE
			</div>

			<div className="flex-1 space-y-2">
				{modes.map((mode) => (
					<div
						key={mode}
						className={`px-2 py-1 text-sm ${
							mode === currentMode ? 'bg-fot930-blue text-white' : ''
						}`}
					>
						{mode === currentMode ? '► ' : '  '}
						{mode}
					</div>
				))}
			</div>

			<div className="text-xs opacity-60 text-center border-t border-fot930-blue pt-2 mt-2">
				↑↓ Navigate | ENTER Confirm
			</div>
		</div>
	);
}
