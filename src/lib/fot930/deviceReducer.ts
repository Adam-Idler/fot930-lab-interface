/**
 * Конечный автомат (FSM) для прибора FOT-930
 * Управляет состоянием прибора и переходами между экранами
 */

import type {
	DeviceAction,
	DeviceState,
	LengthUnit,
	PreparationState,
	Wavelength
} from '../../types/fot930';

/** Начальное состояние подготовки */
export const initialPreparationState: PreparationState = {
	portStatus: 'dirty',
	fastestSettings: {
		portType: 'MM',
		lengthUnit: 'ft',
		lossWavelengths: [1625],
		orlWavelengths: [1625],
		isConfigured: false
	},
	referenceResults: [],
	referenceType: 'POINT_TO_POINT',
	isReadyForMeasurements: false
};

/** Начальное состояние прибора */
export const initialDeviceState: DeviceState = {
	screen: 'OFF',
	isPoweredOn: false,
	preparation: initialPreparationState,
	setupMenuIndex: 0,
	fastestSetupSectionIndex: 0,
	fastestLengthUnitIndex: 0,
	fastestWavelengthIndex: 0,
	fastestMainReferenceTypeSelected: false,
	fiberCounter: 0,
	currentFiberResult: null,
	fiberMeasurementsHistory: {}
};

/** Доступные длины волн для FasTest */
const FASTEST_WAVELENGTHS: Wavelength[] = [1310, 1550, 1625];

/** Доступные единицы измерения длины */
const LENGTH_UNITS: LengthUnit[] = ['ft', 'mi', 'm', 'km'];

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

		case 'PRESS_FASTEST':
			return handleFastestButton(state);

		case 'PRESS_F1':
			return handleF1Button(state);

		case 'PRESS_F2':
			return handleF2Button(state);

		case 'COMPLETE_LOADING':
			return handleCompleteLoading(state);

		case 'CLEAN_PORTS':
			return {
				...state,
				preparation: {
					...state.preparation,
					portStatus: 'cleaning'
				}
			};

		case 'COMPLETE_PORT_CLEANING':
			return {
				...state,
				preparation: {
					...state.preparation,
					portStatus: 'clean',
					isReadyForMeasurements: checkIfReadyForMeasurements({
						...state.preparation,
						portStatus: 'clean'
					})
				}
			};

		case 'TOGGLE_FASTEST_PORT':
			return handleToggleFastestPort(state);

		case 'TOGGLE_LOSS_WAVELENGTH':
			return handleToggleLossWavelength(state, action.payload);

		case 'SET_REFERENCE_TYPE':
			return {
				...state,
				preparation: {
					...state.preparation,
					referenceType: action.payload
				}
			};

		case 'START_REFERENCE_MEASUREMENT':
			return {
				...state,
				screen: 'FASTEST_MEASURING'
			};

		case 'COMPLETE_REFERENCE_MEASUREMENT':
			return {
				...state,
				screen: 'FASTEST_MAIN',
				preparation: {
					...state.preparation,
					referenceResults: action.payload,
					isReadyForMeasurements: checkIfReadyForMeasurements({
						...state.preparation,
						referenceResults: action.payload
					})
				}
			};

		case 'START_FIBER_MEASUREMENT':
			return {
				...state,
				screen: 'FASTEST_MEASURING'
			};

		case 'COMPLETE_FIBER_MEASUREMENT':
			return {
				...state,
				screen: 'FASTEST_RESULTS',
				currentFiberResult: action.payload,
				fiberCounter: state.fiberCounter + 1,
				fiberMeasurementsHistory: {
					...state.fiberMeasurementsHistory,
					[action.payload.componentId]: action.payload
				}
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
	return {
		...state,
		screen: 'MENU_SETUP',
		setupMenuIndex: 0
	};
}

function handleUpButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MENU_SETUP':
			// Навигация по меню Setup (пока только FasTest)
			return {
				...state,
				setupMenuIndex: state.setupMenuIndex > 0 ? state.setupMenuIndex - 1 : 0
			};

		case 'FASTEST_SETUP':
			// Навигация по FasTest Setup (3 секции: 0-Port, 1-Length Unit, 2-Wavelengths)
			if (state.fastestSetupSectionIndex === 0) {
				// В секции FasTest Port: UP переходит к Loss Wavelengths
				return {
					...state,
					fastestSetupSectionIndex: 2,
					fastestWavelengthIndex: 0
				};
			} else if (state.fastestSetupSectionIndex === 1) {
				// В секции Length Unit: UP перемещает по единицам измерения или переходит к FasTest Port
				if (state.fastestLengthUnitIndex > 0) {
					return {
						...state,
						fastestLengthUnitIndex: state.fastestLengthUnitIndex - 1
					};
				} else {
					// Если на первом элементе, переходим к FasTest Port
					return {
						...state,
						fastestSetupSectionIndex: 0
					};
				}
			} else {
				// В секции Loss Wavelengths: UP перемещает по длинам волн или переходит к Length Unit
				if (state.fastestWavelengthIndex > 0) {
					return {
						...state,
						fastestWavelengthIndex: state.fastestWavelengthIndex - 1
					};
				} else {
					// Если на первом элементе, переходим к Length Unit
					return {
						...state,
						fastestSetupSectionIndex: 1,
						fastestLengthUnitIndex: 0
					};
				}
			}

		case 'FASTEST_MAIN':
			// Переключаем выбор типа опорного значения
			return {
				...state,
				fastestMainReferenceTypeSelected:
					!state.fastestMainReferenceTypeSelected
			};

		default:
			return state;
	}
}

function handleDownButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MENU_SETUP':
			// Навигация по меню Setup (пока только FasTest)
			return {
				...state,
				setupMenuIndex: state.setupMenuIndex < 0 ? state.setupMenuIndex + 1 : 0
			};

		case 'FASTEST_SETUP':
			// Навигация по FasTest Setup (3 секции: 0-Port, 1-Length Unit, 2-Wavelengths)
			if (state.fastestSetupSectionIndex === 0) {
				// В секции FasTest Port: DOWN переходит к Length Unit
				return {
					...state,
					fastestSetupSectionIndex: 1,
					fastestLengthUnitIndex: 0
				};
			} else if (state.fastestSetupSectionIndex === 1) {
				// В секции Length Unit: DOWN перемещает по единицам измерения или переходит к Loss Wavelengths
				if (state.fastestLengthUnitIndex < LENGTH_UNITS.length - 1) {
					return {
						...state,
						fastestLengthUnitIndex: state.fastestLengthUnitIndex + 1
					};
				} else {
					// Если на последнем элементе, переходим к Loss Wavelengths
					return {
						...state,
						fastestSetupSectionIndex: 2,
						fastestWavelengthIndex: 0
					};
				}
			} else {
				// В секции Loss Wavelengths: DOWN перемещает по длинам волн или переходит к FasTest Port
				if (state.fastestWavelengthIndex < FASTEST_WAVELENGTHS.length - 1) {
					return {
						...state,
						fastestWavelengthIndex: state.fastestWavelengthIndex + 1
					};
				} else {
					// Если на последнем элементе, переходим к FasTest Port
					return {
						...state,
						fastestSetupSectionIndex: 0
					};
				}
			}

		case 'FASTEST_MAIN':
			// Переключаем выбор типа опорного значения
			return {
				...state,
				fastestMainReferenceTypeSelected:
					!state.fastestMainReferenceTypeSelected
			};

		default:
			return state;
	}
}

function handleEnterButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MENU_SETUP':
			// Переход в FasTest Setup
			if (state.setupMenuIndex === 0) {
				return {
					...state,
					screen: 'FASTEST_SETUP'
				};
			}
			return state;

		case 'FASTEST_SETUP': {
			const { fastestSettings } = state.preparation;

			// Если в секции FasTest Port (0)
			if (state.fastestSetupSectionIndex === 0) {
				// Переключаем тип порта MM ↔ SM
				const newPortType = fastestSettings.portType === 'SM' ? 'MM' : 'SM';
				return {
					...state,
					preparation: {
						...state.preparation,
						fastestSettings: {
							...fastestSettings,
							portType: newPortType
						}
					}
				};
			}

			// Если в секции Length Unit (1)
			if (state.fastestSetupSectionIndex === 1) {
				// Переключаем единицу измерения циклически
				const newLengthUnit = LENGTH_UNITS[state.fastestLengthUnitIndex];
				return {
					...state,
					preparation: {
						...state.preparation,
						fastestSettings: {
							...fastestSettings,
							lengthUnit: newLengthUnit
						}
					}
				};
			}

			// Если в секции Loss Wavelengths (2)
			if (state.fastestSetupSectionIndex === 2) {
				const selectedWavelength =
					FASTEST_WAVELENGTHS[state.fastestWavelengthIndex];
				const currentWavelengths = fastestSettings.lossWavelengths;
				const isSelected = currentWavelengths.includes(selectedWavelength);

				// Добавляем или убираем выбранную длину волны
				const newWavelengths = isSelected
					? currentWavelengths.filter((w) => w !== selectedWavelength)
					: [...currentWavelengths, selectedWavelength].sort((a, b) => a - b);

				return {
					...state,
					preparation: {
						...state.preparation,
						fastestSettings: {
							...fastestSettings,
							lossWavelengths: newWavelengths
						}
					}
				};
			}

			return state;
		}

		case 'FASTEST_MAIN':
			// Переключаем тип опорного значения
			if (state.fastestMainReferenceTypeSelected) {
				const currentType = state.preparation.referenceType;
				const newReferenceType =
					currentType === 'LOOPBACK'
						? 'POINT_TO_POINT'
						: currentType === 'POINT_TO_POINT'
							? 'NONE'
							: 'LOOPBACK';
				return {
					...state,
					preparation: {
						...state.preparation,
						referenceType: newReferenceType
					}
				};
			}
			return state;

		default:
			return state;
	}
}

function handleBackButton(state: DeviceState): DeviceState {
	switch (state.screen) {
		case 'MENU_SETUP':
			// Возврат на главный экран или READY
			return {
				...state,
				screen: 'MAIN'
			};

		case 'FASTEST_SETUP': {
			// Сохраняем настройки и возвращаемся в меню
			const { fastestSettings } = state.preparation;
			const isCorrect =
				fastestSettings.portType === 'SM' &&
				fastestSettings.lengthUnit === 'm' &&
				fastestSettings.lossWavelengths.includes(1310) &&
				fastestSettings.lossWavelengths.includes(1550) &&
				!fastestSettings.lossWavelengths.includes(1625);

			// Всегда возвращаемся в меню, но сохраняем правильность настроек
			return {
				...state,
				screen: 'MENU_SETUP',
				preparation: {
					...state.preparation,
					fastestSettings: {
						...fastestSettings,
						isConfigured: isCorrect
					},
					isReadyForMeasurements: isCorrect
						? checkIfReadyForMeasurements({
								...state.preparation,
								fastestSettings: {
									...fastestSettings,
									isConfigured: true
								}
							})
						: false
				}
			};
		}

		case 'FASTEST_MAIN':
			// Возврат на главный экран или READY
			return {
				...state,
				screen: 'MAIN',
				fastestMainReferenceTypeSelected: false
			};

		default:
			return state;
	}
}

function handleFastestButton(state: DeviceState): DeviceState {
	if (state.preparation.fastestSettings.isConfigured) {
		// С экрана FASTEST_RESULTS повторное нажатие запускает новое измерение
		if (state.screen === 'FASTEST_RESULTS' || state.screen === 'FASTEST_MAIN') {
			return {
				...state,
				screen: 'FASTEST_MEASURING'
			};
		}

		// С других экранов открывает FASTEST_MAIN
		return {
			...state,
			screen: 'FASTEST_MAIN',
			fastestMainReferenceTypeSelected: true
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

function handleF1Button(state: DeviceState): DeviceState {
	// F1 на экране FASTEST_MAIN запускает измерение Reference
	// только если выбран правильный тип измерения (LOOPBACK)
	if (
		state.screen === 'FASTEST_MAIN' &&
		state.preparation.referenceType === 'LOOPBACK'
	) {
		return {
			...state,
			screen: 'FASTEST_MEASURING'
		};
	}
	return state;
}

function handleF2Button(state: DeviceState): DeviceState {
	// F2 на экране FASTEST_MAIN начинает измерение тестируемого волокна
	if (
		state.screen === 'FASTEST_MAIN' &&
		state.preparation.isReadyForMeasurements
	) {
		return {
			...state,
			screen: 'FASTEST_MEASURING'
		};
	}

	// F2 на экране FASTEST_RESULTS возвращает на FASTEST_MAIN
	if (state.screen === 'FASTEST_RESULTS') {
		return {
			...state,
			screen: 'FASTEST_MAIN',
			currentFiberResult: null
		};
	}

	return state;
}

function handleToggleFastestPort(state: DeviceState): DeviceState {
	if (state.screen === 'FASTEST_SETUP') {
		const newPortType =
			state.preparation.fastestSettings.portType === 'SM' ? 'MM' : 'SM';
		return {
			...state,
			preparation: {
				...state.preparation,
				fastestSettings: {
					...state.preparation.fastestSettings,
					portType: newPortType
				}
			}
		};
	}
	return state;
}

function handleToggleLossWavelength(
	state: DeviceState,
	wavelength: Wavelength
): DeviceState {
	if (state.screen === 'FASTEST_SETUP') {
		const currentWavelengths =
			state.preparation.fastestSettings.lossWavelengths;
		const isSelected = currentWavelengths.includes(wavelength);

		const newWavelengths = isSelected
			? currentWavelengths.filter((w) => w !== wavelength)
			: [...currentWavelengths, wavelength];

		return {
			...state,
			preparation: {
				...state.preparation,
				fastestSettings: {
					...state.preparation.fastestSettings,
					lossWavelengths: newWavelengths
				}
			}
		};
	}
	return state;
}

/**
 * Проверяет, готов ли прибор к измерениям
 */
function checkIfReadyForMeasurements(preparation: PreparationState): boolean {
	return (
		preparation.portStatus === 'clean' &&
		preparation.fastestSettings.isConfigured &&
		preparation.referenceResults.length > 0
	);
}
