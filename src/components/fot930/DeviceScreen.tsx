/**
 * Компонент цветного экрана прибора FOT-930
 * Белый фон с синими акцентами в цвет корпуса прибора
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
	const isOff = state.screen === 'OFF';

	return (
			<div className={`w-full h-full rounded border-2 border-gray-800 flex items-center justify-center font-mono p-4 ${
				isOff ? 'bg-gray-700' : 'bg-white'
			}`}>
				{renderScreen(state)}
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
