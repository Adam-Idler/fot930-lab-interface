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
export type Wavelength = 850 | 1300 | 1310 | 1550 | 1625;

/** Кнопки управления прибором */
export type DeviceButton =
	| 'F1'
	| 'F2'
	| 'POWER'
	| 'MENU'
	| 'UP'
	| 'DOWN'
	| 'ENTER'
	| 'BACK'
	| 'FASTEST';

/** Экраны прибора (LCD) */
export type DeviceScreen =
	| 'OFF' // Прибор выключен
	| 'LOADING' // Экран загрузки
	| 'MAIN' // Главный экран
	| 'MENU_SETUP' // Меню настроек
	| 'FASTEST_SETUP' // Настройка FasTest
	| 'FASTEST_MAIN' // Главный экран FasTest
	| 'FASTEST_MEASURING' // Измерение FasTest
	| 'FASTEST_RESULTS'; // Результаты измерения FasTest

// ============================================================
// СОСТОЯНИЕ ПРИБОРА
// ============================================================

/** Статус порта прибора */
export type PortStatus = 'dirty' | 'cleaning' | 'clean';

/** Тип порта FasTest */
export type FasTestPortType = 'SM' | 'MM'; // Single-mode / Multi-mode

/** Единицы измерения длины */
export type LengthUnit = 'm' | 'km' | 'ft' | 'mi';

/** Тип измерения опорного значения */
export type ReferenceType = 'LOOPBACK' | 'POINT_TO_POINT' | 'NONE';

/** Настройки FasTest */
export interface FasTestSettings {
	/** Тип порта (SM/MM) */
	portType: FasTestPortType;

	/** Единица измерения длины */
	lengthUnit: LengthUnit;

	/** Выбранные длины волн для измерения потерь */
	lossWavelengths: Wavelength[];

	/** Настроен ли FasTest */
	isConfigured: boolean;
}

/** Результат измерения Reference */
export interface ReferenceResult {
	/** Длина волны */
	wavelength: Wavelength;

	/** Значение опорного сигнала (dBm) */
	value: number;

	/** Временная метка */
	timestamp: number;
}

/** Результат двунаправленного измерения для одной длины волны */
export interface BidirectionalMeasurementResult {
	/** Длина волны */
	wavelength: Wavelength;

	/** Потери A→B (dB) */
	aToB: number;

	/** Потери B→A (dB) */
	bToA: number;

	/** Среднее значение потерь (dB) */
	average: number;
}

/** Результат FASTEST измерения волокна */
export interface FiberMeasurementResult {
	/** Название волокна (BCFiber001, BCFiber002, ...) */
	fiberName: string;

	/** Название кабеля */
	cableName: string;

	/** ID компонента */
	componentId: string;

	/** Название компонента */
	componentLabel: string;

	/** Длина волокна (метры) */
	fiberLength: number;

	/** Результаты измерений для каждой длины волны */
	wavelengths: BidirectionalMeasurementResult[];

	/** Временная метка измерения */
	timestamp: number;
}

/** Состояние подготовки прибора */
export interface PreparationState {
	/** Статус очистки портов */
	portStatus: PortStatus;

	/** Настройки FasTest */
	fastestSettings: FasTestSettings;

	/** Результаты измерения Reference */
	referenceResults: ReferenceResult[];

	/** Тип измерения опорного значения */
	referenceType: ReferenceType;

	/** Готов ли прибор к измерениям */
	isReadyForMeasurements: boolean;
}

/** Состояние прибора FOT-930 */
export interface DeviceState {
	/** Текущий экран */
	screen: DeviceScreen;

	/** Питание включено */
	isPoweredOn: boolean;

	/** Состояние подготовки прибора */
	preparation: PreparationState;

	/** Индекс меню Setup */
	setupMenuIndex: number;

	/** Индекс выбранной секции на экране FasTest Setup */
	fastestSetupSectionIndex: number;

	/** Индекс выбранной единицы измерения в Length Unit */
	fastestLengthUnitIndex: number;

	/** Индекс выбранной длины волны в Loss Wavelengths */
	fastestWavelengthIndex: number;

	/** Выбран ли тип опорного значения на экране FASTEST_MAIN */
	fastestMainReferenceTypeSelected: boolean;

	/** Открытый выпадающий список */
	openDropdown: 'PORT' | 'LENGTH_UNIT' | 'REFERENCE_TYPE' | null;

	/** Индекс элемента в открытом выпадающем списке */
	dropdownIndex: number;

	/** Счетчик волокон для автоувеличения номера (001, 002, ...) */
	fiberCounter: number;

	/** Результат последнего FASTEST измерения волокна */
	currentFiberResult: FiberMeasurementResult | null;

	/** История измерений волокон (для сохранения результатов) */
	fiberMeasurementsHistory: Record<string, FiberMeasurementResult>;

	/** Тип текущего измерения (для различения Reference и Fiber) */
	currentMeasurementType: 'REFERENCE' | 'FIBER' | null;
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
	| { type: 'PRESS_FASTEST' }
	| { type: 'PRESS_F1' }
	| { type: 'PRESS_F2' }
	| { type: 'COMPLETE_LOADING' }
	| { type: 'CLEAN_PORTS' }
	| { type: 'COMPLETE_PORT_CLEANING' }
	| { type: 'TOGGLE_FASTEST_PORT' }
	| { type: 'TOGGLE_LOSS_WAVELENGTH'; payload: Wavelength }
	| { type: 'SET_REFERENCE_TYPE'; payload: ReferenceType }
	| { type: 'START_REFERENCE_MEASUREMENT' }
	| { type: 'COMPLETE_REFERENCE_MEASUREMENT'; payload: ReferenceResult[] }
	| { type: 'START_FIBER_MEASUREMENT'; payload: PassiveComponent }
	| { type: 'COMPLETE_FIBER_MEASUREMENT'; payload: FiberMeasurementResult };

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

	/** Тип коннектора */
	connectorType: ConnectorType;

	/** Длина волокна (метры) */
	fiberLength: number;
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
	| 'CONNECTION_SCHEME' // Сборка схемы подключения
	| 'COMPLEX_SCHEMES' // Сложные схемы
	| 'RESULTS_ANALYSIS'; // Анализ результатов

// ============================================================
// ИНТЕРАКТИВНАЯ ТАБЛИЦА РЕЗУЛЬТАТОВ
// ============================================================

/** Статус ячейки таблицы */
export type CellStatus = 'empty' | 'valid' | 'error';

/** Введенное студентом значение */
export interface StudentMeasurementEntry {
	/** Введенное значение (dB) */
	value: number | null;

	/** Фактическое значение из прибора (для валидации) */
	actualValue: number;

	/** Статус валидации */
	status: CellStatus;

	/** Сообщение об ошибке */
	errorMessage?: string;
}

/** Строка таблицы для одной длины волны */
export interface WavelengthTableRow {
	/** Длина волны */
	wavelength: Wavelength;

	/** Три измерения (попытки) */
	measurements: [
		StudentMeasurementEntry | null,
		StudentMeasurementEntry | null,
		StudentMeasurementEntry | null
	];

	/** Среднее значение (расчитывается студентом) */
	average: StudentMeasurementEntry | null;

	/** Километрическое затухание (dB/км) */
	kilometricAttenuation: StudentMeasurementEntry | null;
}

/** Таблица результатов для одного компонента */
export interface ComponentResultsTable {
	/** ID компонента */
	componentId: string;

	/** Название компонента */
	componentLabel: string;

	/** Длина волокна (м) */
	fiberLength: number;

	/** Строки таблицы (по одной на длину волны) */
	rows: WavelengthTableRow[];

	/** Номер текущего измерения (1-3) */
	currentMeasurementNumber: number;

	/** Все измерения завершены и введены */
	isCompleted: boolean;
}

/** Состояние всех таблиц результатов */
export interface ResultsTableState {
	/** Таблицы по ID компонентов */
	tables: Record<string, ComponentResultsTable>;

	/** ID компонента ожидающего ввода результатов */
	pendingInputComponentId: string | null;
}

// ============================================================
// СОСТОЯНИЕ ЛАБОРАТОРНОЙ РАБОТЫ
// ============================================================

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

	/** Состояние таблиц результатов */
	resultsTableState: ResultsTableState;
}

/** Выполненное измерение (для таблицы результатов) */
export interface CompletedMeasurement {
	/** ID компонента */
	componentId: string;

	/** Название компонента */
	componentLabel: string;

	/** Длина волны */
	wavelength: Wavelength;

	/** Номер попытки (1-3) */
	attemptNumber: number;

	/** Результат измерения */
	result: MeasurementResult;
}
