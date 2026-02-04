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
			<div className="text-sm font-bold border-b border-fot930-blue pb-2 mb-3 text-fot930-blue">
				SELECT WAVELENGTH
			</div>

			<div className="flex-1 space-y-2">
				{wavelengths.map((wl) => (
					<div
						key={wl}
						className={`px-2 py-1 text-sm ${
							wl === currentWavelength ? 'bg-fot930-blue text-white' : ''
						}`}
					>
						{wl === currentWavelength ? '► ' : '  '}
						{wl} nm
					</div>
				))}
			</div>

			<div className="text-xs opacity-60 text-center border-t border-fot930-blue pt-2 mt-2">
				↑↓ Navigate | ENTER Confirm
			</div>
		</div>
	);
}
