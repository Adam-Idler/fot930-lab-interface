import type { DeviceState } from '../../../types/fot930';

interface ScreenFastestMeasuringProps {
	state: DeviceState;
}

export function ScreenFastestMeasuring({ state }: ScreenFastestMeasuringProps) {
	const { fastestSettings } = state.preparation;

	return (
		<div className="flex flex-col items-center justify-center w-full h-full p-4">
			<div className="text-sm font-bold mb-4 text-fot930-blue">
				Measuring Reference...
			</div>

			<div className="w-full max-w-[200px] mb-4">
				<div className="flex justify-center gap-1">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="w-2 h-8 bg-fot930-blue animate-pulse"
							style={{ animationDelay: `${i * 0.1}s` }}
						/>
					))}
				</div>
			</div>

			<div className="text-xs text-gray-600 text-center space-y-1">
				<div>Mode: {fastestSettings.portType}</div>
				<div>Wavelengths: {fastestSettings.lossWavelengths.join('nm, ')}nm</div>
			</div>

			<div className="text-[10px] text-gray-500 mt-4">Please wait...</div>
		</div>
	);
}
