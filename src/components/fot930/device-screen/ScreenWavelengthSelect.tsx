import {
	getAvailableWavelengths,
	getCurrentWavelength
} from '../../../lib/fot930/deviceReducer';
import type { DeviceState } from '../../../types/fot930';

interface ScreenWavelengthSelectProps {
	state: DeviceState;
}

export function ScreenWavelengthSelect({ state }: ScreenWavelengthSelectProps) {
	const wavelengths = getAvailableWavelengths();
	const currentWavelength = getCurrentWavelength(state);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="text-sm font-bold border-b border-[#1a2a1e] pb-2 mb-3">
				SELECT WAVELENGTH
			</div>

			<div className="flex-1 space-y-2">
				{wavelengths.map((wl) => (
					<div
						key={wl}
						className={`px-2 py-1 text-sm ${
							wl === currentWavelength ? 'bg-[#1a2a1e] text-[#7a9c7e]' : ''
						}`}
					>
						{wl === currentWavelength ? '► ' : '  '}
						{wl} nm
					</div>
				))}
			</div>

			<div className="text-xs opacity-60 text-center border-t border-[#1a2a1e] pt-2 mt-2">
				↑↓ Navigate | ENTER Confirm
			</div>
		</div>
	);
}
