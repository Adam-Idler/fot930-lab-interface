import type { DeviceState } from '../../../types/fot930';

interface ScreenMeasuringProps {
	state: DeviceState;
}

export function ScreenMeasuring({ state }: ScreenMeasuringProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center h-full">
			<div className="text-lg font-bold animate-pulse text-fot930-blue">MEASURING...</div>

			<div className="space-y-1 text-sm opacity-70">
				<div>{state.mode}</div>
				<div>{state.wavelength} nm</div>
			</div>

			<div className="mt-4">
				<div className="flex gap-1">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="w-2 h-8 bg-fot930-blue animate-pulse"
							style={{ animationDelay: `${i * 0.1}s` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
