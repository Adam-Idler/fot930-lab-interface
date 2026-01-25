/**
 * Конечный автомат (FSM) для прибора FOT-930
 * Управляет состоянием прибора и переходами между экранами
 */

import type {
	DeviceState,
	DeviceAction,
	MeasurementMode,
	Wavelength
} from '../../types/fot930';

/** Начальное состояние прибора */
export const initialDeviceState: DeviceState = {
	screen: 'OFF',
	isPoweredOn: false,
	mode: null,
	wavelength: null,
	modeMenuIndex: 0,
	wavelengthMenuIndex: 0,
	lastMeasurement: null,
	lastError: null
};

/** Доступные режимы измерения */
const MODES: MeasurementMode[] = ['POWER', 'LOSS'];

/** Доступные длины волн */
const WAVELENGTHS: Wavelength[] = [850, 1300, 1310, 1550];

/**
 * Reducer для управления состоянием прибора
 */
export function deviceReducer(
	state: DeviceState,
	action: DeviceAction
): DeviceState {
	switch (action.type) {
		case 'PRESS_POWER':
			return handlePowerButton(state);

		case 'PRESS_MENU':
			return handleMenuButton(state);

		case 'PRESS_UP':
			return handleUpButton(state);

		case 'PRESS_DOWN':
			return handleDownButton(state);

		case 'PRESS_ENTER':
			return handleEnterButton(state);

		case 'PRESS_BACK':
			return handleBackButton(state);

		case 'PRESS_MEASURE':
			return handleMeasureButton(state);

		case 'COMPLETE_LOADING':
			return handleCompleteLoading(state);

		case 'COMPLETE_MEASUREMENT':
			return {
				...state,
				screen: 'RESULT',
				lastMeasurement: action.payload,
				lastError: null
			};

		case 'MEASUREMENT_ERROR':
			return {
				...state,
				screen: 'ERROR',
				lastError: action.payload,
				lastMeasurement: null
			};

		default:
			return state;
	}
}

// ============================================================
// ОБРАБОТЧИКИ КНОПОК
// ============================================================

function handlePowerButton(state: DeviceState): DeviceState {
	if (!state.isPoweredOn) {
		// Включаем прибор
		return {
			...initialDeviceState,
			isPoweredOn: true,
			screen: 'LOADING'
		};
	} else {
		// Выключаем прибор
		return initialDeviceState;
	}
}

function handleMenuButton(state: DeviceState): DeviceState {
	// Menu доступно только на главном экране или экране готовности
	if (state.screen === 'MAIN' || state.screen === 'READY') {
		return {
			...state,
			screen: 'MODE_SELECT',
			modeMenuIndex: state.mode ? MODES.indexOf(state.mode) : 0
		};
	}
	return state;
}

function handleUpButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MODE_SELECT':
			// Перемещаемся вверх по меню режимов
			return {
				...state,
				modeMenuIndex:
					state.modeMenuIndex > 0 ? state.modeMenuIndex - 1 : MODES.length - 1
			};

		case 'WAVELENGTH_SELECT':
			// Перемещаемся вверх по меню длин волн
			return {
				...state,
				wavelengthMenuIndex:
					state.wavelengthMenuIndex > 0
						? state.wavelengthMenuIndex - 1
						: WAVELENGTHS.length - 1
			};

		default:
			return state;
	}
}

function handleDownButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MODE_SELECT':
			// Перемещаемся вниз по меню режимов
			return {
				...state,
				modeMenuIndex:
					state.modeMenuIndex < MODES.length - 1 ? state.modeMenuIndex + 1 : 0
			};

		case 'WAVELENGTH_SELECT':
			// Перемещаемся вниз по меню длин волн
			return {
				...state,
				wavelengthMenuIndex:
					state.wavelengthMenuIndex < WAVELENGTHS.length - 1
						? state.wavelengthMenuIndex + 1
						: 0
			};

		default:
			return state;
	}
}

function handleEnterButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MODE_SELECT':
			// Подтверждаем выбор режима и переходим к выбору длины волны
			return {
				...state,
				mode: MODES[state.modeMenuIndex],
				screen: 'WAVELENGTH_SELECT',
				wavelengthMenuIndex: state.wavelength
					? WAVELENGTHS.indexOf(state.wavelength)
					: 0
			};

		case 'WAVELENGTH_SELECT':
			// Подтверждаем выбор длины волны и переходим к экрану готовности
			return {
				...state,
				wavelength: WAVELENGTHS[state.wavelengthMenuIndex],
				screen: 'READY'
			};

		case 'RESULT':
		case 'ERROR':
			// Возврат к экрану готовности после просмотра результата
			return {
				...state,
				screen: 'READY',
				lastMeasurement: null,
				lastError: null
			};

		default:
			return state;
	}
}

function handleBackButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MODE_SELECT':
			// Возврат на главный экран
			return {
				...state,
				screen: state.mode && state.wavelength ? 'READY' : 'MAIN'
			};

		case 'WAVELENGTH_SELECT':
			// Возврат к выбору режима
			return {
				...state,
				screen: 'MODE_SELECT'
			};

		case 'READY':
			// Возврат на главный экран, сбрасываем настройки
			return {
				...state,
				screen: 'MAIN',
				mode: null,
				wavelength: null
			};

		case 'RESULT':
		case 'ERROR':
			// Возврат к экрану готовности
			return {
				...state,
				screen: 'READY',
				lastMeasurement: null,
				lastError: null
			};

		default:
			return state;
	}
}

function handleMeasureButton(state: DeviceState): DeviceState {
	// Измерение доступно только на экране READY
	if (state.screen === 'READY' && state.mode && state.wavelength) {
		return {
			...state,
			screen: 'MEASURING'
		};
	}
	return state;
}

function handleCompleteLoading(state: DeviceState): DeviceState {
	if (state.screen === 'LOADING') {
		return {
			...state,
			screen: 'MAIN'
		};
	}
	return state;
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

/**
 * Получить текущий режим по индексу
 */
export function getCurrentMode(state: DeviceState): MeasurementMode | null {
	if (state.screen === 'MODE_SELECT') {
		return MODES[state.modeMenuIndex];
	}
	return state.mode;
}

/**
 * Получить текущую длину волны по индексу
 */
export function getCurrentWavelength(state: DeviceState): Wavelength | null {
	if (state.screen === 'WAVELENGTH_SELECT') {
		return WAVELENGTHS[state.wavelengthMenuIndex];
	}
	return state.wavelength;
}

/**
 * Получить список всех доступных режимов
 */
export function getAvailableModes(): MeasurementMode[] {
	return [...MODES];
}

/**
 * Получить список всех доступных длин волн
 */
export function getAvailableWavelengths(): Wavelength[] {
	return [...WAVELENGTHS];
}
