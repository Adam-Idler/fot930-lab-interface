/**
 * Система генерации реалистичных результатов измерений
 * Эмулирует реальные значения затухания для оптических компонентов
 */

import type {
	BidirectionalMeasurementResult,
	ConnectionScheme,
	FiberMeasurementResult,
	MeasurementMode,
	PassiveComponent,
	PortStatus,
	Wavelength
} from '../../types/fot930';
import { getSplitterOutputCount, isSplitterType } from './splitter';

/**
 * Удельное затухание оптического волокна (дБ/км)
 * Используется для расчёта потерь катушки ОВ с учётом её длины
 */
const FIBER_ATTENUATION_DB_PER_KM: Record<Wavelength, number> = {
	850: 2.5, // многомодовое волокно 50/125 мкм (типично 2.5–3.5 дБ/км)
	1300: 0.5, // многомодовое волокно 50/125 мкм (типично 0.7–1.5 дБ/км)
	1310: 0.34, // одномодовое G.652/G.657: 0.33–0.36 дБ/км
	1550: 0.2, // одномодовое G.652/G.657: 0.18–0.22 дБ/км
	1625: 0.22 // L-диапазон, немного выше 1550 нм
};

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
 * Фиксированные избыточные потери для неисправных компонентов (dB).
 * Добавляются к типичным потерям — результат стабильно превышает допустимую норму.
 * Подобрано с учётом минимального запаса компонентов: оптический шнур (0.10 dB),
 * сплиттер 1:4 (0.30 dB). При значении 0.40 оба компонента гарантированно
 * превышают верхнюю границу из справочных таблиц.
 */
const FAULTY_EXCESS_LOSS_DB = 0.40;

/**
 * Типичные значения затухания компонентов (дБ).
 * Для FIBER_COIL значения приведены для справки (typicalLoss);
 * в расчётах используется FIBER_ATTENUATION_DB_PER_KM × длина.
 * Значения сплиттеров соответствуют Таблице 4 теоретического раздела.
 * Значения OPTICAL_CABLE соответствуют Таблице 2 (SC/APC ↔ SC/APC, 1–5 м).
 */
export const COMPONENT_LOSS_DB: Record<string, Record<Wavelength, number>> = {
	OPTICAL_CABLE: {
		850: 0.45, // многомодовый патч-корд, нет таблицы в теории
		1300: 0.2, // в диапазоне 0.10–0.25 дБ (Таблица 2)
		1310: 0.2, // в диапазоне 0.10–0.25 дБ (Таблица 2)
		1550: 0.18, // немного ниже 1310 нм (Таблица 2)
		1625: 0.19
	},
	FIBER_COIL: {
		// Типичные значения для эталонной 5 км катушки СМВ (справочно)
		850: 2.5,
		1300: 2.0,
		1310: 1.7, // 5 км × 0.34 дБ/км
		1550: 1.0, // 5 км × 0.20 дБ/км
		1625: 1.1
	},
	SPLITTER_1_2: {
		850: 3.5,
		1300: 3.7, // Таблица 4: 3.4–4.0 дБ
		1310: 3.7, // Таблица 4: 3.4–4.0 дБ
		1550: 3.7, // Таблица 4: ~одинаково 1310–1550 нм
		1625: 3.8
	},
	SPLITTER_1_4: {
		850: 7.0,
		1300: 7.2, // Таблица 4: 7.0–7.5 дБ
		1310: 7.2, // Таблица 4: 7.0–7.5 дБ
		1550: 7.2, // Таблица 4: ~одинаково 1310–1550 нм
		1625: 7.3
	},
	SPLITTER_1_8: {
		850: 10.5,
		1300: 10.7, // Таблица 4: 10.5–11.0 дБ
		1310: 10.7, // Таблица 4: 10.5–11.0 дБ
		1550: 10.7, // Таблица 4: ~одинаково 1310–1550 нм
		1625: 10.8
	},
	SPLITTER_1_16: {
		850: 14.0,
		1300: 13.5, // Таблица 4: 13.0–14.0 дБ
		1310: 13.5, // Таблица 4: 13.0–14.0 дБ
		1550: 13.5, // Таблица 4: ~одинаково 1310–1550 нм
		1625: 13.7
	},
	SPLITTER_1_32: {
		850: 17.5,
		1300: 17.0, // ~13.5 + 3.5 дБ (каждое удвоение ≈ +3.5 дБ)
		1310: 17.0,
		1550: 17.0,
		1625: 17.2
	},
	SPLITTER_1_64: {
		850: 21.0,
		1300: 20.5, // ~17.0 + 3.5 дБ
		1310: 20.5,
		1550: 20.5,
		1625: 20.7
	}
};

/**
 * Возвращает потери компонента на заданной длине волны (дБ).
 * Для FIBER_COIL вычисляет потери на основе длины волокна (дБ/км × длина),
 * для остальных компонентов берёт значение из COMPONENT_LOSS_DB.
 */
function getComponentLoss(
	component: PassiveComponent,
	wavelength: Wavelength
): number {
	if (component.type === 'FIBER_COIL') {
		const attenuationPerKm = FIBER_ATTENUATION_DB_PER_KM[wavelength];
		const lengthKm = component.fiberLength / 1000;
		return attenuationPerKm * lengthKm;
	}
	return COMPONENT_LOSS_DB[component.type]?.[wavelength] ?? 1.0;
}

/**
 * Верхние границы допустимых потерь компонентов (дБ).
 * Соответствуют максимальным значениям из справочных таблиц в теоретическом разделе.
 */
const COMPONENT_LOSS_UPPER_BOUND: Record<string, Record<Wavelength, number>> = {
	OPTICAL_CABLE: {
		850: 1.0,
		1300: 0.3, // Таблица 2: SC/UPC ↔ SC/UPC до 0.30 дБ
		1310: 0.3,
		1550: 0.3,
		1625: 0.3
	},
	SPLITTER_1_2: {
		850: 4.5,
		1300: 4.0, // Таблица 4: 3.4–4.0 дБ
		1310: 4.0,
		1550: 4.0,
		1625: 4.1
	},
	SPLITTER_1_4: {
		850: 8.0,
		1300: 7.5, // Таблица 4: 7.0–7.5 дБ
		1310: 7.5,
		1550: 7.5,
		1625: 7.6
	},
	SPLITTER_1_8: {
		850: 12.0,
		1300: 11.0, // Таблица 4: 10.5–11.0 дБ
		1310: 11.0,
		1550: 11.0,
		1625: 11.1
	},
	SPLITTER_1_16: {
		850: 15.0,
		1300: 14.0, // Таблица 4: 13.0–14.0 дБ
		1310: 14.0,
		1550: 14.0,
		1625: 14.2
	},
	SPLITTER_1_32: {
		850: 19.0,
		1300: 17.5, // ~14.0 + 3.5 дБ
		1310: 17.5,
		1550: 17.5,
		1625: 17.7
	},
	SPLITTER_1_64: {
		850: 23.0,
		1300: 21.0, // ~17.5 + 3.5 дБ
		1310: 21.0,
		1550: 21.0,
		1625: 21.2
	}
};

/**
 * Верхняя граница удельного затухания оптического волокна (дБ/км).
 * Используется для проверки FIBER_COIL: если измеренное затухание/км
 * превышает этот порог — волокно или соединение неисправно.
 */
const FIBER_ATTENUATION_UPPER_BOUND_DB_PER_KM: Record<Wavelength, number> = {
	850: 3.5, // MMF 50/125 мкм: верхняя граница
	1300: 1.5, // MMF 50/125 мкм: верхняя граница
	1310: 0.4, // SMF G.652: немного выше максимума 0.36 дБ/км
	1550: 0.25, // SMF G.652: немного выше максимума 0.22 дБ/км
	1625: 0.28
};

/**
 * Возвращает верхнюю допустимую границу потерь компонента (дБ).
 * Для FIBER_COIL учитывает длину волокна.
 */
function getComponentLossUpperBound(
	component: PassiveComponent,
	wavelength: Wavelength
): number {
	if (component.type === 'FIBER_COIL') {
		const upperPerKm = FIBER_ATTENUATION_UPPER_BOUND_DB_PER_KM[wavelength];
		const lengthKm = component.fiberLength / 1000;
		return upperPerKm * lengthKm;
	}
	return (
		COMPONENT_LOSS_UPPER_BOUND[component.type]?.[wavelength] ??
		(COMPONENT_LOSS_DB[component.type]?.[wavelength] ?? 1.0) * 2
	);
}

/**
 * Проверяет, является ли измерение неисправным для данного компонента и выхода.
 * — component.faulty === true: неисправен полностью (любой выход).
 * — component.faultyPort === splitterOutput: неисправен только конкретный выход сплиттера.
 */
function isFaultyMeasurement(
	component: PassiveComponent,
	splitterOutput?: number
): boolean {
	if (component.faulty) return true;
	if (component.faultyPort != null && splitterOutput != null) {
		return component.faultyPort === splitterOutput;
	}
	return false;
}

/**
 * Генерирует реалистичное измерение для одиночного компонента
 */
export function generateSingleComponentMeasurement(
	component: PassiveComponent,
	mode: MeasurementMode,
	wavelength: Wavelength
): { value: number; unit: 'dBm' | 'dB' } | { error: string } {
	// Получаем типичное затухание компонента
	const componentLoss = getComponentLoss(component, wavelength);

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
				const componentLoss = getComponentLoss(component, wavelength);
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
			error: 'Неверное число элементов в схеме'
		};
	}

	// Проверяем порядок элементов
	for (let i = 0; i < sequence.length; i++) {
		if (sequence[i].id !== correctSequence[i]) {
			return {
				valid: false,
				error: `Неверный элемент на ${i + 1} позиции`
			};
		}
	}

	return { valid: true };
}

/**
 * Вычисляет детерминированное смещение потерь для конкретного выхода сплиттера.
 * Имитирует физическую неравномерность деления мощности между выходами.
 * Диапазон: ±(N-1)/2 * 0.15 dB, где N — число выходов.
 */
function getSplitterOutputOffset(
	outputIndex: number,
	totalOutputs: number
): number {
	const center = (totalOutputs + 1) / 2;
	return (outputIndex - center) * 0.15;
}

/**
 * Вычисляет суммарные потери комплексной цепи компонентов для одной длины волны.
 * Для сплиттера добавляет детерминированное смещение по номеру выхода.
 * Для неисправных компонентов (faulty/faultyPort) добавляет фиксированные избыточные потери.
 */
function calculateComplexChainLoss(
	chainComponents: PassiveComponent[],
	wavelength: Wavelength,
	splitterOutput: number
): { value: number; isExcessive: boolean } | { error: string } {
	let totalLoss = 0;
	let upperBoundTotal = 0;

	for (const component of chainComponents) {
		const baseLoss = getComponentLoss(component, wavelength);
		const variation = gaussianRandom() * MEASUREMENT_CONFIG.MEASUREMENT_STD_DEV;
		let componentLoss = baseLoss + variation;

		if (isSplitterType(component.type)) {
			const outputCount = getSplitterOutputCount(component.type);
			componentLoss += getSplitterOutputOffset(splitterOutput, outputCount);
		}

		const componentUpperBound = getComponentLossUpperBound(component, wavelength);
		const componentFaulty = isFaultyMeasurement(
			component,
			isSplitterType(component.type) ? splitterOutput : undefined
		);

		if (componentFaulty) {
			// Неисправный компонент: добавляем фиксированные избыточные потери
			componentLoss += FAULTY_EXCESS_LOSS_DB;
		} else {
			// Исправный компонент: зажимаем до верхней границы из справочных таблиц
			componentLoss = Math.min(componentLoss, componentUpperBound);
		}

		totalLoss += componentLoss;
		upperBoundTotal += componentUpperBound;
	}

	// Два коннектора на концах цепи
	totalLoss += MEASUREMENT_CONFIG.CONNECTOR_LOSS * 2;
	upperBoundTotal += MEASUREMENT_CONFIG.CONNECTOR_LOSS * 2;

	if (totalLoss > MEASUREMENT_CONFIG.MAX_MEASURABLE_LOSS) {
		return { error: 'Loss exceeds measurement range' };
	}

	return {
		value: parseFloat(totalLoss.toFixed(2)),
		isExcessive: totalLoss > upperBoundTotal
	};
}

/**
 * Генерирует двунаправленное FASTEST измерение для комплексной схемы
 * (несколько компонентов в цепи).
 *
 * Суммирует потери всех компонентов в цепи. Для сплиттера добавляет
 * детерминированное смещение по номеру выхода, имитируя физическую
 * неравномерность реального сплиттера (±0.5 dB для 1:8).
 *
 * @param chainComponents - Компоненты цепи в порядке подключения
 * @param wavelengths - Длины волн для измерения
 * @param fiberCounter - Счётчик волокна (для имени BCFiberNNN)
 * @param splitterOutput - Номер выхода сплиттера (1-based)
 * @param previousResult - Предыдущий результат этого выхода (для стабильности повторных измерений)
 */
export function generateComplexFiberMeasurement(
	chainComponents: PassiveComponent[],
	wavelengths: Wavelength[],
	fiberCounter: number,
	splitterOutput: number,
	previousResult?: FiberMeasurementResult
): FiberMeasurementResult | { error: string } {
	const bidirectionalResults: BidirectionalMeasurementResult[] = [];

	for (const wavelength of wavelengths) {
		if (previousResult) {
			const prevWavelengthResult = previousResult.wavelengths.find(
				(w) => w.wavelength === wavelength
			);

			if (prevWavelengthResult) {
				// Повторное измерение того же выхода: минимальная вариация для стабильности
				const minimalVariation = gaussianRandom() * 0.015;
				const aToB = prevWavelengthResult.aToB + minimalVariation;
				const bToA = prevWavelengthResult.bToA + minimalVariation;
				const average = (aToB + bToA) / 2;

				bidirectionalResults.push({
					wavelength,
					aToB: parseFloat(aToB.toFixed(2)),
					bToA: parseFloat(bToA.toFixed(2)),
					average: parseFloat(average.toFixed(2)),
					isExcessive: prevWavelengthResult.isExcessive ?? false
				});
				continue;
			}
		}

		// Первое измерение данного выхода: генерируем с учётом цепи
		const lossResult = calculateComplexChainLoss(
			chainComponents,
			wavelength,
			splitterOutput
		);
		if ('error' in lossResult) return lossResult;

		const aToB = lossResult.value;
		const asymmetry = gaussianRandom() * 0.15;
		const bToA = parseFloat((aToB + asymmetry).toFixed(2));
		const average = parseFloat(((aToB + bToA) / 2).toFixed(2));

		bidirectionalResults.push({
			wavelength,
			aToB,
			bToA,
			average,
			isExcessive: lossResult.isExcessive
		});
	}

	const splitterComponent = chainComponents.find((c) => isSplitterType(c.type));
	const totalLength = chainComponents.reduce(
		(sum, c) => sum + c.fiberLength,
		0
	);
	const fiberNumber = fiberCounter.toString().padStart(3, '0');

	return {
		fiberName: `BCFiber${fiberNumber}`,
		cableName: 'BigCable',
		componentId: splitterComponent?.id ?? chainComponents[0].id,
		componentLabel: splitterComponent
			? `${splitterComponent.label} (Выход ${splitterOutput})`
			: chainComponents[0].label,
		fiberLength: totalLength,
		wavelengths: bidirectionalResults,
		timestamp: Date.now()
	};
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
 * Генерирует двунаправленное FASTEST измерение для компонента
 * Эмулирует измерения A→B и B→A для всех настроенных длин волн
 * Если есть предыдущее измерение, использует его с минимальной вариацией (±0.01-0.02 dB)
 *
 * @param component - Пассивный компонент для измерения
 * @param wavelengths - Длины волн для измерения
 * @param fiberCounter - Текущий номер измерения (для имени волокна)
 * @param previousResult - Предыдущий результат измерения этого компонента (если есть)
 * @param splitterOutput - Номер выхода сплиттера (1-based); используется для определения неисправного порта
 * @returns Результат измерения волокна или ошибка
 */
export function generateFiberMeasurement(
	component: PassiveComponent,
	wavelengths: Wavelength[],
	fiberCounter: number,
	previousResult?: FiberMeasurementResult,
	splitterOutput?: number
): FiberMeasurementResult | { error: string } {
	if (!component.fiberLength) {
		return { error: 'Component has no fiber length specified' };
	}

	const bidirectionalResults: BidirectionalMeasurementResult[] = [];

	// Если есть предыдущий результат для этого компонента, используем его с минимальной вариацией
	if (previousResult) {
		for (const wavelength of wavelengths) {
			const prevWavelengthResult = previousResult.wavelengths.find(
				(w) => w.wavelength === wavelength
			);

			if (prevWavelengthResult) {
				// Добавляем очень маленькую вариацию (±0.01-0.02 dB)
				const minimalVariation = gaussianRandom() * 0.015;
				const aToB = prevWavelengthResult.aToB + minimalVariation;
				const bToA = prevWavelengthResult.bToA + minimalVariation;
				const average = (aToB + bToA) / 2;

				bidirectionalResults.push({
					wavelength,
					aToB: parseFloat(aToB.toFixed(2)),
					bToA: parseFloat(bToA.toFixed(2)),
					average: parseFloat(average.toFixed(2)),
					isExcessive: prevWavelengthResult.isExcessive ?? false
				});
			} else {
				// Если длины волны нет в предыдущем результате, генерируем новое
				const result = generateFreshMeasurement(
					component,
					wavelength,
					splitterOutput
				);
				if ('error' in result) return result;
				bidirectionalResults.push(result);
			}
		}
	} else {
		// Нет предыдущего результата - генерируем новые измерения
		for (const wavelength of wavelengths) {
			const result = generateFreshMeasurement(
				component,
				wavelength,
				splitterOutput
			);
			if ('error' in result) return result;
			bidirectionalResults.push(result);
		}
	}

	// Форматируем номер волокна с лидирующими нулями
	const fiberNumber = fiberCounter.toString().padStart(3, '0');

	return {
		fiberName: `BCFiber${fiberNumber}`,
		cableName: 'BigCable',
		componentId: component.id,
		componentLabel: component.label,
		fiberLength: component.fiberLength,
		wavelengths: bidirectionalResults,
		timestamp: Date.now()
	};
}

/**
 * Генерирует одно свежее двунаправленное измерение для компонента и длины волны.
 * Для неисправных компонентов/портов добавляет фиксированные избыточные потери
 * с минимальной вариацией — имитируя стабильный дефект.
 */
function generateFreshMeasurement(
	component: PassiveComponent,
	wavelength: Wavelength,
	splitterOutput?: number
): BidirectionalMeasurementResult | { error: string } {
	const connectorLoss = MEASUREMENT_CONFIG.CONNECTOR_LOSS * 2;
	const faulty = isFaultyMeasurement(component, splitterOutput);

	if (faulty) {
		// Неисправный компонент: базовые потери + фиксированный избыток, минимальная вариация
		const baseLoss =
			getComponentLoss(component, wavelength) + FAULTY_EXCESS_LOSS_DB;
		const variation = gaussianRandom() * 0.05;
		const aToB = parseFloat((baseLoss + variation + connectorLoss).toFixed(2));
		const asymmetry = gaussianRandom() * 0.05;
		const bToA = parseFloat((aToB + asymmetry).toFixed(2));
		const average = parseFloat(((aToB + bToA) / 2).toFixed(2));
		return { wavelength, aToB, bToA, average, isExcessive: true };
	}

	// Исправный компонент: потери строго в пределах допустимого диапазона из таблиц теории
	const baseLoss = getComponentLoss(component, wavelength);
	const componentUpperBound = getComponentLossUpperBound(component, wavelength);

	// Зажимаем потери компонента по верхней границе — исправный компонент
	// не может выдавать значения выше нормы независимо от случайной вариации
	const variation = gaussianRandom() * MEASUREMENT_CONFIG.MEASUREMENT_STD_DEV;
	const componentLoss = Math.min(baseLoss + variation, componentUpperBound);

	// Небольшая асимметрия между направлениями (реальный шум измерений ≤ 0.05 dB)
	const asymmetry = gaussianRandom() * 0.05;
	const aToB = parseFloat((componentLoss + connectorLoss).toFixed(2));
	const bToA = parseFloat((componentLoss + asymmetry + connectorLoss).toFixed(2));
	const average = (aToB + bToA) / 2;

	return {
		wavelength,
		aToB,
		bToA,
		average: parseFloat(average.toFixed(2)),
		isExcessive: false
	};
}

/**
 * Генерирует стабильные опорные значения для FasTest измерений
 * Учитывает состояние портов и предыдущие измерения
 *
 * @param wavelengths - Длины волн для измерения
 * @param portStatus - Состояние портов ('clean' | 'dirty' | 'cleaning')
 * @param previousResults - Предыдущие опорные значения (для стабильности при повторных измерениях)
 * @returns Массив опорных значений
 */
export function generateReferenceMeasurement(
	wavelengths: Wavelength[],
	portStatus: PortStatus,
	previousResults?: { wavelength: Wavelength; value: number }[]
): { wavelength: Wavelength; value: number }[] {
	// Базовые потери для обратной петли (loopback):
	// - 2 коннектора (на приборе и в петле): 2 × 0.3 = 0.6 dB
	// - Патч-корд (~1 метр): ~0.1 dB
	// - Итого: ~0.7 dB
	const BASE_LOOPBACK_LOSS: Record<Wavelength, number> = {
		850: 0.75,
		1300: 0.72,
		1310: 0.7,
		1550: 0.68,
		1625: 0.69
	};

	// Дополнительные потери от грязных портов
	const DIRTY_PORT_PENALTY = 0.8; // +0.8 dB для грязных портов

	return wavelengths.map((wavelength) => {
		// Генерируем ожидаемое базовое значение для текущего состояния портов
		let expectedBaseLoss = BASE_LOOPBACK_LOSS[wavelength];

		// Добавляем penalty если порты грязные или в процессе очистки
		if (portStatus === 'dirty' || portStatus === 'cleaning') {
			expectedBaseLoss += DIRTY_PORT_PENALTY;
		}

		// Проверяем есть ли предыдущее измерение для этой длины волны
		const prevResult = previousResults?.find(
			(r) => r.wavelength === wavelength
		);

		if (prevResult) {
			// Проверяем отличается ли предыдущее значение от ожидаемого для текущего состояния
			// Если разница больше 0.3 dB - значит состояние портов изменилось
			const difference = Math.abs(prevResult.value - expectedBaseLoss);

			if (difference < 0.3) {
				// Состояние портов не изменилось: добавляем минимальную вариацию (±0.01-0.02 dB)
				const minimalVariation = gaussianRandom() * 0.015;
				const value = prevResult.value + minimalVariation;
				return {
					wavelength,
					value: parseFloat(value.toFixed(2))
				};
			}
			// Иначе: состояние портов изменилось - генерируем новое базовое значение
		}

		// Первое измерение или после изменения состояния портов:
		// генерируем новое базовое значение с вариацией
		const variation = gaussianRandom() * MEASUREMENT_CONFIG.MEASUREMENT_STD_DEV;
		const value = expectedBaseLoss + variation;

		return {
			wavelength,
			value: parseFloat(value.toFixed(2))
		};
	});
}
