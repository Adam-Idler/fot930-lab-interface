/**
 * Компонент LCD экрана прибора FOT-930
 * Эмулирует монохромный ЖК-дисплей с ограниченным разрешением
 */

import type { DeviceState } from '../../types/fot930';
import {
	getAvailableModes,
	getAvailableWavelengths,
	getCurrentMode,
	getCurrentWavelength
} from '../../lib/fot930/deviceReducer';

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

// ============================================================
// ЭКРАНЫ
// ============================================================

function ScreenOff() {
	return <div className="w-full h-full" />;
}

function ScreenLoading() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center">
			<div className="text-3xl font-bold tracking-wider">FOT-930</div>
			<div className="text-sm animate-pulse">Loading...</div>
		</div>
	);
}

function ScreenMain({ state }: { state: DeviceState }) {
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

function ScreenModeSelect({ state }: { state: DeviceState }) {
	const modes = getAvailableModes();
	const currentMode = getCurrentMode(state);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="text-sm font-bold border-b border-[#1a2a1e] pb-2 mb-3">
				SELECT MODE
			</div>

			<div className="flex-1 space-y-2">
				{modes.map((mode) => (
					<div
						key={mode}
						className={`px-2 py-1 text-sm ${
							mode === currentMode ? 'bg-[#1a2a1e] text-[#7a9c7e]' : ''
						}`}
					>
						{mode === currentMode ? '► ' : '  '}
						{mode}
					</div>
				))}
			</div>

			<div className="text-xs opacity-60 text-center border-t border-[#1a2a1e] pt-2 mt-2">
				↑↓ Navigate | ENTER Confirm
			</div>
		</div>
	);
}

function ScreenWavelengthSelect({ state }: { state: DeviceState }) {
	const wavelengths = getAvailableWavelengths();
	const currentWavelength = getCurrentWavelength(state);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="text-sm font-bold border-b border-[#1a2a1e] pb-2 mb-3">
				SELECT WAVELENGTH
			</div>

			<div className="flex-1 space-y-2">
				{wavelengths.map((wl) => (
					<div
						key={wl}
						className={`px-2 py-1 text-sm ${
							wl === currentWavelength ? 'bg-[#1a2a1e] text-[#7a9c7e]' : ''
						}`}
					>
						{wl === currentWavelength ? '► ' : '  '}
						{wl} nm
					</div>
				))}
			</div>

			<div className="text-xs opacity-60 text-center border-t border-[#1a2a1e] pt-2 mt-2">
				↑↓ Navigate | ENTER Confirm
			</div>
		</div>
	);
}

function ScreenReady({ state }: { state: DeviceState }) {
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

function ScreenMeasuring({ state }: { state: DeviceState }) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center h-full">
			<div className="text-lg font-bold animate-pulse">MEASURING...</div>

			<div className="space-y-1 text-sm opacity-70">
				<div>{state.mode}</div>
				<div>{state.wavelength} nm</div>
			</div>

			<div className="mt-4">
				<div className="flex gap-1">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="w-2 h-8 bg-[#1a2a1e] animate-pulse"
							style={{ animationDelay: `${i * 0.1}s` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function ScreenResult({ state }: { state: DeviceState }) {
	if (!state.lastMeasurement) return null;

	const { value, unit, wavelength } = state.lastMeasurement;
	const formattedValue = value.toFixed(2);

	return (
		<div className="flex flex-col items-center justify-center gap-4 text-center h-full">
			<div className="text-sm opacity-70 mb-2">MEASUREMENT RESULT</div>

			<div className="border-2 border-[#1a2a1e] p-4 rounded">
				<div className="text-3xl font-bold tabular-nums">{formattedValue}</div>
				<div className="text-lg font-bold mt-1">{unit}</div>
			</div>

			<div className="text-xs opacity-70 mt-2">λ: {wavelength} nm</div>

			<div className="text-xs opacity-60 mt-4">ENTER to continue</div>
		</div>
	);
}

function ScreenError({ state }: { state: DeviceState }) {
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
