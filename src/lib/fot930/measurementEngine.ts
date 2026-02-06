/**
 * Система генерации реалистичных результатов измерений
 * Эмулирует реальные значения затухания для оптических компонентов
 */

import type {
	ConnectionScheme,
	MeasurementMode,
	PassiveComponent,
	Wavelength
} from '../../types/fot930';

/**
 * Базовые параметры для генерации измерений
 */
const MEASUREMENT_CONFIG = {
	/** Типичная мощность источника света (dBm) */
	SOURCE_POWER: {
		850: -5.0,
		1300: -7.0,
		1310: -6.5,
		1550: -8.0,
		1625: -8.5
	} as Record<Wavelength, number>,

	/** Максимально допустимые потери для успешного измерения (dB) */
	MAX_MEASURABLE_LOSS: 45,

	/** Стандартное отклонение для вариации измерений */
	MEASUREMENT_STD_DEV: 0.15,

	/** Затухание на соединителе (dB) */
	CONNECTOR_LOSS: 0.3,

	/** Затухание на сварке (dB) */
	SPLICE_LOSS: 0.1
};

/**
 * Типичные значения затухания компонентов (dB)
 */
export const COMPONENT_LOSS_DB: Record<string, Record<Wavelength, number>> = {
	OPTICAL_CABLE: {
		850: 0.5,
		1300: 0.4,
		1310: 0.35,
		1550: 0.3,
		1625: 0.32
	},
	FIBER_COIL: {
		850: 2.5,
		1300: 2.0,
		1310: 1.8,
		1550: 1.5,
		1625: 1.6
	},
	SPLITTER_1_2: {
		850: 3.5,
		1300: 3.3,
		1310: 3.2,
		1550: 3.0,
		1625: 3.1
	},
	SPLITTER_1_4: {
		850: 7.0,
		1300: 6.8,
		1310: 6.5,
		1550: 6.2,
		1625: 6.3
	},
	SPLITTER_1_8: {
		850: 10.5,
		1300: 10.2,
		1310: 10.0,
		1550: 9.5,
		1625: 9.7
	},
	SPLITTER_1_16: {
		850: 14.0,
		1300: 13.5,
		1310: 13.2,
		1550: 12.8,
		1625: 13.0
	},
	SPLITTER_1_32: {
		850: 17.5,
		1300: 17.0,
		1310: 16.8,
		1550: 16.2,
		1625: 16.5
	},
	SPLITTER_1_64: {
		850: 21.0,
		1300: 20.5,
		1310: 20.2,
		1550: 19.5,
		1625: 19.8
	}
};

/**
 * Генерирует реалистичное измерение для одиночного компонента
 */
export function generateSingleComponentMeasurement(
	component: PassiveComponent,
	mode: MeasurementMode,
	wavelength: Wavelength
): { value: number; unit: 'dBm' | 'dB' } | { error: string } {
	// Получаем типичное затухание компонента
	const componentLoss = COMPONENT_LOSS_DB[component.type]?.[wavelength] ?? 1.0;

	// Добавляем вариацию (нормальное распределение)
	const variation = gaussianRandom() * MEASUREMENT_CONFIG.MEASUREMENT_STD_DEV;
	const actualLoss = componentLoss + variation;

	// Учитываем потери на коннекторах (2 коннектора: вход и выход)
	const connectorLoss = MEASUREMENT_CONFIG.CONNECTOR_LOSS * 2;
	const totalLoss = actualLoss + connectorLoss;

	// Проверяем, не превышает ли затухание допустимый предел
	if (totalLoss > MEASUREMENT_CONFIG.MAX_MEASURABLE_LOSS) {
		return {
			error: 'Loss exceeds measurement range'
		};
	}

	if (mode === 'POWER') {
		// Режим измерения мощности (dBm)
		const sourcePower = MEASUREMENT_CONFIG.SOURCE_POWER[wavelength];
		const measuredPower = sourcePower - totalLoss;
		return {
			value: parseFloat(measuredPower.toFixed(2)),
			unit: 'dBm'
		};
	} else {
		// Режим измерения потерь (dB)
		return {
			value: parseFloat(totalLoss.toFixed(2)),
			unit: 'dB'
		};
	}
}

/**
 * Генерирует измерение для сложной схемы (последовательность компонентов)
 */
export function generateComplexSchemeMeasurement(
	scheme: ConnectionScheme,
	components: PassiveComponent[],
	mode: MeasurementMode,
	wavelength: Wavelength
): { value: number; unit: 'dBm' | 'dB' } | { error: string } {
	let totalLoss = 0;

	// Суммируем потери всех компонентов в схеме
	for (const element of scheme.sequence) {
		if (element.type === 'COMPONENT') {
			const component = components.find((c) => c.id === element.id);
			if (component) {
				const componentLoss =
					COMPONENT_LOSS_DB[component.type]?.[wavelength] ?? 1.0;
				const variation =
					gaussianRandom() * MEASUREMENT_CONFIG.MEASUREMENT_STD_DEV;
				totalLoss += componentLoss + variation;
			}
		} else if (element.type === 'CONNECTOR') {
			// Добавляем потери на соединителях
			totalLoss += MEASUREMENT_CONFIG.CONNECTOR_LOSS;
		}
	}

	// Проверяем, не превышает ли затухание допустимый предел
	if (totalLoss > MEASUREMENT_CONFIG.MAX_MEASURABLE_LOSS) {
		return {
			error: 'Loss exceeds measurement range. Check connections.'
		};
	}

	if (mode === 'POWER') {
		// Режим измерения мощности (dBm)
		const sourcePower = MEASUREMENT_CONFIG.SOURCE_POWER[wavelength];
		const measuredPower = sourcePower - totalLoss;
		return {
			value: parseFloat(measuredPower.toFixed(2)),
			unit: 'dBm'
		};
	} else {
		// Режим измерения потерь (dB)
		return {
			value: parseFloat(totalLoss.toFixed(2)),
			unit: 'dB'
		};
	}
}

/**
 * Проверяет корректность схемы подключения
 */
export function validateConnectionScheme(scheme: ConnectionScheme): {
	valid: boolean;
	error?: string;
} {
	const { sequence, correctSequence } = scheme;

	// Проверяем длину последовательности
	if (sequence.length !== correctSequence.length) {
		return {
			valid: false,
			error: 'Incorrect number of elements in scheme'
		};
	}

	// Проверяем порядок элементов
	for (let i = 0; i < sequence.length; i++) {
		if (sequence[i].id !== correctSequence[i]) {
			return {
				valid: false,
				error: `Incorrect element at position ${i + 1}`
			};
		}
	}

	return { valid: true };
}

/**
 * Генерирует случайное число по нормальному распределению (метод Бокса-Мюллера)
 */
function gaussianRandom(): number {
	let u = 0;
	let v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Создаёт тестовый сценарий с заведомо избыточными потерями
 * Для демонстрации ошибки измерения
 */
export function createExcessiveLossScenario(): ConnectionScheme {
	return {
		sequence: [
			{ type: 'TESTER', id: 'tester' },
			{ type: 'CONNECTOR', id: 'conn1', connectorType: 'SC_APC' },
			{ type: 'COMPONENT', id: 'splitter_1_32' },
			{ type: 'CONNECTOR', id: 'conn2', connectorType: 'SC_APC' },
			{ type: 'COMPONENT', id: 'splitter_1_32' },
			{ type: 'CONNECTOR', id: 'conn3', connectorType: 'SC_APC' },
			{ type: 'COMPONENT', id: 'fiber_coil' },
			{ type: 'CONNECTOR', id: 'conn4', connectorType: 'SC_APC' }
		],
		correctSequence: [
			'tester',
			'conn1',
			'splitter_1_32',
			'conn2',
			'splitter_1_32',
			'conn3',
			'fiber_coil',
			'conn4'
		]
	};
}
