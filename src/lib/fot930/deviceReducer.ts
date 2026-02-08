/**
 * Конечный автомат (FSM) для прибора FOT-930
 * Управляет состоянием прибора и переходами между экранами
 */

import type {
	DeviceAction,
	DeviceState,
	FasTestPortType,
	LengthUnit,
	PreparationState,
	ReferenceType,
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
	openDropdown: null,
	dropdownIndex: 0,
	fiberCounter: 0,
	currentFiberResult: null,
	fiberMeasurementsHistory: {},
	currentMeasurementType: null
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
				currentMeasurementType: null,
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
				currentMeasurementType: null,
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
			// Если dropdown открыт - навигация по элементам dropdown
			if (state.openDropdown === 'PORT') {
				// Dropdown Port: SM/MM (2 элемента)
				return {
					...state,
					dropdownIndex: state.dropdownIndex > 0 ? state.dropdownIndex - 1 : 1
				};
			} else if (state.openDropdown === 'LENGTH_UNIT') {
				// Dropdown Length Unit: ft/mi/m/km (4 элемента)
				return {
					...state,
					dropdownIndex:
						state.dropdownIndex > 0
							? state.dropdownIndex - 1
							: LENGTH_UNITS.length - 1
				};
			}

			// Dropdown закрыт - навигация между секциями
			if (state.fastestSetupSectionIndex === 0) {
				// Port -> Loss Wavelengths
				return {
					...state,
					fastestSetupSectionIndex: 2,
					fastestWavelengthIndex: 0
				};
			} else if (state.fastestSetupSectionIndex === 1) {
				// Length Unit -> Port
				return {
					...state,
					fastestSetupSectionIndex: 0
				};
			} else {
				// Loss Wavelengths: перемещение по элементам или переход к Length Unit
				if (state.fastestWavelengthIndex > 0) {
					return {
						...state,
						fastestWavelengthIndex: state.fastestWavelengthIndex - 1
					};
				} else {
					return {
						...state,
						fastestSetupSectionIndex: 1
					};
				}
			}

		case 'FASTEST_MAIN':
			// Если dropdown открыт - навигация по типам опорного значения
			if (state.openDropdown === 'REFERENCE_TYPE') {
				// Dropdown Reference Type: Обрат. петля/Точка-точка/Нет этл (3 элемента)
				return {
					...state,
					dropdownIndex: state.dropdownIndex > 0 ? state.dropdownIndex - 1 : 2
				};
			}
			// Dropdown закрыт - переключаем выбор поля
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
			// Если dropdown открыт - навигация по элементам dropdown
			if (state.openDropdown === 'PORT') {
				// Dropdown Port: SM/MM (2 элемента)
				return {
					...state,
					dropdownIndex: state.dropdownIndex < 1 ? state.dropdownIndex + 1 : 0
				};
			} else if (state.openDropdown === 'LENGTH_UNIT') {
				// Dropdown Length Unit: ft/mi/m/km (4 элемента)
				return {
					...state,
					dropdownIndex:
						state.dropdownIndex < LENGTH_UNITS.length - 1
							? state.dropdownIndex + 1
							: 0
				};
			}

			// Dropdown закрыт - навигация между секциями
			if (state.fastestSetupSectionIndex === 0) {
				// Port -> Length Unit
				return {
					...state,
					fastestSetupSectionIndex: 1
				};
			} else if (state.fastestSetupSectionIndex === 1) {
				// Length Unit -> Loss Wavelengths
				return {
					...state,
					fastestSetupSectionIndex: 2,
					fastestWavelengthIndex: 0
				};
			} else {
				// Loss Wavelengths: перемещение по элементам или переход к Port
				if (state.fastestWavelengthIndex < FASTEST_WAVELENGTHS.length - 1) {
					return {
						...state,
						fastestWavelengthIndex: state.fastestWavelengthIndex + 1
					};
				} else {
					return {
						...state,
						fastestSetupSectionIndex: 0
					};
				}
			}

		case 'FASTEST_MAIN':
			// Если dropdown открыт - навигация по типам опорного значения
			if (state.openDropdown === 'REFERENCE_TYPE') {
				// Dropdown Reference Type: Обрат. петля/Точка-точка/Нет этл (3 элемента)
				return {
					...state,
					dropdownIndex: state.dropdownIndex < 2 ? state.dropdownIndex + 1 : 0
				};
			}
			// Dropdown закрыт - переключаем выбор поля
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

			// Если dropdown открыт - применяем выбранное значение
			if (state.openDropdown === 'PORT') {
				const portTypes: FasTestPortType[] = ['SM', 'MM'];
				const newPortType = portTypes[state.dropdownIndex];
				return {
					...state,
					openDropdown: null,
					dropdownIndex: 0,
					preparation: {
						...state.preparation,
						fastestSettings: {
							...fastestSettings,
							portType: newPortType
						}
					}
				};
			}

			if (state.openDropdown === 'LENGTH_UNIT') {
				const newLengthUnit = LENGTH_UNITS[state.dropdownIndex];
				return {
					...state,
					openDropdown: null,
					dropdownIndex: 0,
					preparation: {
						...state.preparation,
						fastestSettings: {
							...fastestSettings,
							lengthUnit: newLengthUnit
						}
					}
				};
			}

			// Dropdown закрыт - открываем его или toggle checkbox
			// Если в секции FasTest Port (0) - открываем dropdown
			if (state.fastestSetupSectionIndex === 0) {
				const currentIndex = fastestSettings.portType === 'SM' ? 0 : 1;
				return {
					...state,
					openDropdown: 'PORT',
					dropdownIndex: currentIndex
				};
			}

			// Если в секции Length Unit (1) - открываем dropdown
			if (state.fastestSetupSectionIndex === 1) {
				const currentIndex = LENGTH_UNITS.indexOf(fastestSettings.lengthUnit);
				return {
					...state,
					openDropdown: 'LENGTH_UNIT',
					dropdownIndex: currentIndex
				};
			}

			// Если в секции Loss Wavelengths (2) - toggle checkbox
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
			// Если dropdown открыт - применяем выбранное значение
			if (state.openDropdown === 'REFERENCE_TYPE') {
				const referenceTypes: ReferenceType[] = [
					'LOOPBACK',
					'POINT_TO_POINT',
					'NONE'
				];
				const newReferenceType = referenceTypes[state.dropdownIndex];
				return {
					...state,
					openDropdown: null,
					dropdownIndex: 0,
					preparation: {
						...state.preparation,
						referenceType: newReferenceType
					}
				};
			}

			// Dropdown закрыт - открываем его если поле выбрано
			if (state.fastestMainReferenceTypeSelected) {
				const currentType = state.preparation.referenceType;
				const currentIndex =
					currentType === 'LOOPBACK'
						? 0
						: currentType === 'POINT_TO_POINT'
							? 1
							: 2;
				return {
					...state,
					openDropdown: 'REFERENCE_TYPE',
					dropdownIndex: currentIndex
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
			// Если dropdown открыт - закрываем его без применения
			if (state.openDropdown !== null) {
				return {
					...state,
					openDropdown: null,
					dropdownIndex: 0
				};
			}

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

		case 'FASTEST_RESULTS': {
			return {
				...state,
				screen: 'FASTEST_MAIN',
				currentFiberResult: null
			};
		}

		case 'FASTEST_MAIN':
			// Если dropdown открыт - закрываем его без применения
			if (state.openDropdown !== null) {
				return {
					...state,
					openDropdown: null,
					dropdownIndex: 0
				};
			}

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
			screen: 'FASTEST_MEASURING',
			currentMeasurementType: 'REFERENCE'
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
			screen: 'FASTEST_MEASURING',
			currentMeasurementType: 'FIBER'
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
