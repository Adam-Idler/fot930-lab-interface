/**
 * Компонент LCD экрана прибора FOT-930
 * Эмулирует монохромный ЖК-дисплей с ограниченным разрешением
 */

import type { DeviceState } from '../../types/fot930';
import {
	ScreenError,
	ScreenLoading,
	ScreenMain,
	ScreenMeasuring,
	ScreenModeSelect,
	ScreenOff,
	ScreenReady,
	ScreenResult,
	ScreenWavelengthSelect
} from './device-screen';

interface DeviceScreenProps {
	state: DeviceState;
}

export function DeviceScreen({ state }: DeviceScreenProps) {
	return (
		<div className="w-full h-full bg-[#9cb89f] p-4 rounded-lg border-6 border-gray-700 shadow-inner">
			<div className="w-full h-full bg-[#7a9c7e] rounded border-2 border-[#5a7c5e] flex items-center justify-center font-mono text-[#1a2a1e] p-4">
				{renderScreen(state)}
			</div>
		</div>
	);
}

function renderScreen(state: DeviceState) {
	switch (state.screen) {
		case 'OFF':
			return <ScreenOff />;

		case 'LOADING':
			return <ScreenLoading />;

		case 'MAIN':
			return <ScreenMain state={state} />;

		case 'MODE_SELECT':
			return <ScreenModeSelect state={state} />;

		case 'WAVELENGTH_SELECT':
			return <ScreenWavelengthSelect state={state} />;

		case 'READY':
			return <ScreenReady state={state} />;

		case 'MEASURING':
			return <ScreenMeasuring state={state} />;

		case 'RESULT':
			return <ScreenResult state={state} />;

		case 'ERROR':
			return <ScreenError state={state} />;

		default:
			return <ScreenOff />;
	}
}
