import type { DeviceState } from '../../../types/fot930';

interface ScreenReadyProps {
	state: DeviceState;
}

export function ScreenReady({ state }: ScreenReadyProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center h-full">
			<div className="text-lg font-bold">READY</div>

			<div className="space-y-2 text-sm">
				<div className="flex items-center gap-2">
					<span className="opacity-60">Mode:</span>
					<span className="font-bold">{state.mode}</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="opacity-60">λ:</span>
					<span className="font-bold">{state.wavelength} nm</span>
				</div>
			</div>

			<div className="mt-6 text-xs opacity-70 animate-pulse">
				Press MEASURE to start
			</div>
		</div>
	);
}
