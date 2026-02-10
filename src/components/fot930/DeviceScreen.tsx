/**
 * Компонент цветного экрана прибора FOT-930
 * Белый фон с синими акцентами в цвет корпуса прибора
 */

import type { DeviceState } from '../../types/fot930';
import {
	ScreenFastestMain,
	ScreenFastestMeasuring,
	ScreenFastestResults,
	ScreenFastestSetup,
	ScreenLoading,
	ScreenMain,
	ScreenMenuSetup,
	ScreenOff,
	ScreenSettings
} from './device-screen';

interface DeviceScreenProps {
	state: DeviceState;
}

export function DeviceScreen({ state }: DeviceScreenProps) {
	const isOff = state.screen === 'OFF';

	return (
		<div
			className={`w-full h-full rounded border-2 border-gray-800 flex items-center justify-center font-mono p-2 ${
				isOff ? 'bg-gray-700' : 'bg-white'
			}`}
		>
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
			return <ScreenMain />;

		case 'MENU_SETUP':
			return <ScreenMenuSetup state={state} />;

		case 'SETUP_SETTINGS':
			return <ScreenSettings state={state} />;

		case 'FASTEST_SETUP':
			return <ScreenFastestSetup state={state} />;

		case 'FASTEST_MAIN':
			return <ScreenFastestMain state={state} />;

		case 'FASTEST_MEASURING':
			return <ScreenFastestMeasuring state={state} />;

		case 'FASTEST_RESULTS':
			return <ScreenFastestResults state={state} />;

		default:
			return <ScreenOff />;
	}
}
