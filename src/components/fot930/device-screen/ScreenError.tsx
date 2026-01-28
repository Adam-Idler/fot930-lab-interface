import type { DeviceState } from '../../../types/fot930';

interface ScreenErrorProps {
	state: DeviceState;
}

export function ScreenError({ state }: ScreenErrorProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center h-full px-4">
			<div className="text-lg font-bold">ERROR</div>

			<div className="text-sm border border-[#1a2a1e] p-3 rounded max-w-full">
				{state.lastError || 'Measurement failed'}
			</div>

			<div className="text-xs opacity-70 mt-2">
				{state.wavelength ? `λ: ${state.wavelength} nm` : ''}
			</div>

			<div className="text-xs opacity-60 mt-4">ENTER to continue</div>
		</div>
	);
}
