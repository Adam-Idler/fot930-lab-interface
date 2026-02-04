import type { DeviceState } from '../../../types/fot930';

interface ScreenResultProps {
	state: DeviceState;
}

export function ScreenResult({ state }: ScreenResultProps) {
	if (!state.lastMeasurement) return null;

	const { value, unit, wavelength } = state.lastMeasurement;
	const formattedValue = value.toFixed(2);

	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center h-full">
			<div className="text-sm opacity-70 mb-2">MEASUREMENT RESULT</div>

			<div className="border-2 border-fot930-blue p-4 rounded">
				<div className="text-3xl font-bold tabular-nums text-fot930-blue">{formattedValue}</div>
				<div className="text-lg font-bold mt-1 text-fot930-blue">{unit}</div>
			</div>

			<div className="text-xs opacity-70 mt-2">λ: {wavelength} nm</div>

			<div className="text-xs opacity-60 mt-4">ENTER to continue</div>
		</div>
	);
}
