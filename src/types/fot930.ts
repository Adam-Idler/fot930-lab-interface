/**
 * Типы для эмуляции оптического тестера FOT-930
 * Учебный программный тренажёр
 */

// ============================================================
// ОСНОВНЫЕ ТИПЫ ПРИБОРА
// ============================================================

/** Режимы измерения прибора */
export type MeasurementMode = 'POWER' | 'LOSS';

/** Длины волн (нм) */
export type Wavelength = 850 | 1300 | 1310 | 1550;

/** Кнопки управления прибором */
export type DeviceButton =
	| 'POWER'
	| 'MENU'
	| 'UP'
	| 'DOWN'
	| 'ENTER'
	| 'BACK'
	| 'MEASURE';

/** Экраны прибора (LCD) */
export type DeviceScreen =
	| 'OFF' // Прибор выключен
	| 'LOADING' // Экран загрузки
	| 'MAIN' // Главный экран
	| 'MODE_SELECT' // Выбор режима измерения
	| 'WAVELENGTH_SELECT' // Выбор длины волны
	| 'READY' // Готов к измерению
	| 'MEASURING' // Процесс измерения
	| 'RESULT' // Результат измерения
	| 'ERROR'; // Ошибка измерения

// ============================================================
// СОСТОЯНИЕ ПРИБОРА
// ============================================================

/** Состояние прибора FOT-930 */
export interface DeviceState {
	/** Текущий экран */
	screen: DeviceScreen;

	/** Питание включено */
	isPoweredOn: boolean;

	/** Выбранный режим измерения */
	mode: MeasurementMode | null;

	/** Выбранная длина волны */
	wavelength: Wavelength | null;

	/** Текущий индекс в меню выбора режима */
	modeMenuIndex: number;

	/** Текущий индекс в меню выбора длины волны */
	wavelengthMenuIndex: number;

	/** Последний результат измерения */
	lastMeasurement: MeasurementResult | null;

	/** Последняя ошибка */
	lastError: string | null;
}

/** Результат измерения */
export interface MeasurementResult {
	/** Значение измерения */
	value: number;

	/** Единица измерения */
	unit: 'dBm' | 'dB';

	/** Режим измерения */
	mode: MeasurementMode;

	/** Длина волны */
	wavelength: Wavelength;

	/** Временная метка */
	timestamp: number;
}

// ============================================================
// ДЕЙСТВИЯ ДЛЯ FSM
// ============================================================

/** Действия для конечного автомата прибора */
export type DeviceAction =
	| { type: 'PRESS_POWER' }
	| { type: 'PRESS_MENU' }
	| { type: 'PRESS_UP' }
	| { type: 'PRESS_DOWN' }
	| { type: 'PRESS_ENTER' }
	| { type: 'PRESS_BACK' }
	| { type: 'PRESS_MEASURE' }
	| { type: 'COMPLETE_LOADING' }
	| { type: 'COMPLETE_MEASUREMENT'; payload: MeasurementResult }
	| { type: 'MEASUREMENT_ERROR'; payload: string };

// ============================================================
// ЛАБОРАТОРНАЯ РАБОТА
// ============================================================

/** Типы пассивных компонентов */
export type PassiveComponentType =
	| 'OPTICAL_CABLE' // Оптический шнур
	| 'FIBER_COIL' // Катушка ОВ
	| 'SPLITTER_1_2' // Сплиттер 1:2
	| 'SPLITTER_1_4' // Сплиттер 1:4
	| 'SPLITTER_1_8' // Сплиттер 1:8
	| 'SPLITTER_1_16' // Сплиттер 1:16
	| 'SPLITTER_1_32' // Сплиттер 1:32
	| 'SPLITTER_1_64'; // Сплиттер 1:64

/** Типы коннекторов */
export type ConnectorType =
	| 'SC_APC' // SC/APC (зелёный)
	| 'SC_UPC'; // SC/UPC (синий)

/** Сторона измерения */
export type MeasurementSide = 'A' | 'B';

/** Пассивный компонент */
export interface PassiveComponent {
	/** Уникальный идентификатор */
	id: string;

	/** Тип компонента */
	type: PassiveComponentType;

	/** Отображаемое название */
	label: string;

	/** Типичное затухание на разных длинах волн (dB) */
	typicalLoss: Record<Wavelength, number>;

	/** Коннектор на стороне A */
	connectorA: ConnectorType;

	/** Коннектор на стороне B */
	connectorType: ConnectorType;
}

/** Схема подключения */
export interface ConnectionScheme {
	/** Последовательность элементов */
	sequence: ConnectionElement[];

	/** Правильная последовательность (для проверки) */
	correctSequence: string[];
}

/** Элемент подключения */
export interface ConnectionElement {
	/** Тип элемента */
	type: 'TESTER' | 'COMPONENT' | 'CONNECTOR';

	/** ID элемента */
	id: string;

	/** Отображаемое название */
	label?: string;

	/** Тип коннектора (если элемент - коннектор) */
	connectorType?: ConnectorType;
}

/** Этапы выполнения лабораторной работы */
export type LabStage =
	| 'PREPARATION' // Подготовка прибора
	| 'SINGLE_MEASUREMENTS' // Измерения одиночных компонентов
	| 'CONNECTION_SCHEME' // Сборка схемы подключения
	| 'COMPLEX_SCHEMES' // Сложные схемы
	| 'RESULTS_ANALYSIS'; // Анализ результатов

/** Состояние лабораторной работы */
export interface LabWorkState {
	/** Текущий этап */
	currentStage: LabStage;

	/** Состояние прибора */
	deviceState: DeviceState;

	/** Выбранный компонент для измерения */
	selectedComponent: PassiveComponent | null;

	/** Текущая схема подключения */
	connectionScheme: ConnectionScheme | null;

	/** Все выполненные измерения */
	measurements: CompletedMeasurement[];

	/** Прогресс по этапам */
	stageProgress: Record<LabStage, boolean>;
}

/** Выполненное измерение (для таблицы результатов) */
export interface CompletedMeasurement {
	/** ID компонента */
	componentId: string;

	/** Название компонента */
	componentLabel: string;

	/** Длина волны */
	wavelength: Wavelength;

	/** Сторона измерения */
	side: MeasurementSide;

	/** Номер попытки (1-3) */
	attemptNumber: number;

	/** Результат измерения */
	result: MeasurementResult;
}
