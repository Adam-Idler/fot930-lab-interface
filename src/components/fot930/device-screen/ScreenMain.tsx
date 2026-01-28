import type { DeviceState } from '../../../types/fot930';

interface ScreenMainProps {
	state: DeviceState;
}

export function ScreenMain({ state }: ScreenMainProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-6 text-center w-full">
			<div className="text-2xl font-bold tracking-wider border-b-2 border-[#1a2a1e] pb-2">
				FOT-930
			</div>
			<div className="text-xs">Optical Power Meter</div>

			{state.mode && state.wavelength ? (
				<div className="mt-4 space-y-1 text-sm">
					<div>Mode: {state.mode}</div>
					<div>λ: {state.wavelength} nm</div>
					<div className="text-xs mt-2 opacity-70">Press MEASURE</div>
				</div>
			) : (
				<div className="text-xs mt-4 opacity-70">Press MENU</div>
			)}
		</div>
	);
}
