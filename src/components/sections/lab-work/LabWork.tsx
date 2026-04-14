/**
 * Главный компонент раздела "Выполнение лабораторной работы"
 * Координирует работу всех этапов лабораторной работы
 */

import {
	type Dispatch,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { initialDeviceState } from '../../../lib/fot930/deviceReducer';
import { COMPONENT_LOSS_DB } from '../../../lib/fot930/measurementEngine';
import {
	getSplitterOutputCount,
	isSplitterType
} from '../../../lib/fot930/splitter';
import { useResultsTable } from '../../../lib/fot930/useResultsTable';
import { storage } from '../../../lib/storage';
import type {
	ConnectionScheme,
	DeviceAction,
	DeviceState,
	LabStage,
	PassiveComponent,
	Wavelength
} from '../../../types/fot930';
import { Device } from '../../fot930';
import { useRegistration } from '../../registration-form';
import {
	ConnectionSchemeStage,
	IntroductionStage,
	PassiveMeasurementsStage,
	PreparationStage,
	ResultsStage,
	StageButton
} from './components';
import type { ComplexScenario } from './components/PassiveMeasurementsStage';

// ============================================================
// КОМПОНЕНТЫ ДЛЯ ОДИНОЧНЫХ ИЗМЕРЕНИЙ
// ============================================================

const availableComponents: PassiveComponent[] = [
	{
		id: 'optical_cable_1',
		icon: '/images/scheme/sc-apc-g-652.png',
		type: 'OPTICAL_CABLE',
		label: 'Оптический шнур simplex SC/APC (2 м)',
		typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
		connectorType: 'SC_APC',
		fiberLength: 2
	},
	{
		id: 'optical_cable_2',
		icon: '/images/scheme/sc-upc-g-657.jpg',
		type: 'OPTICAL_CABLE',
		label: 'Оптический шнур simplex SC/UPC (3 м)',
		typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
		connectorType: 'SC_UPC',
		fiberLength: 3,
		faulty: true
	},
	{
		id: 'fiber_coil_1',
		icon: '/images/scheme/optic-fiber-coil.png',
		type: 'FIBER_COIL',
		label: 'Оптический кабель ОКСН-48хG.652D-10кН (2 км)',
		typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
		connectorType: 'SC_APC',
		fiberLength: 2000
	},
	{
		id: 'fiber_coil_2',
		icon: '/images/scheme/optic-fiber-coil.png',
		type: 'FIBER_COIL',
		label: 'Оптический кабель ОКСН-24хG.652D-10кН (10 км)',
		typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
		connectorType: 'SC_APC',
		fiberLength: 10000
	},
	{
		id: 'splitter_1_2',
		icon: '/images/scheme/splitter-1-2.png',
		type: 'SPLITTER_1_2',
		label: 'Сплиттер 1:2 SC/APC',
		typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_2,
		connectorType: 'SC_APC',
		fiberLength: 2
	},
	{
		id: 'splitter_1_4',
		icon: '/images/scheme/splitter-1-4.png',
		type: 'SPLITTER_1_4',
		label: 'Сплиттер 1:4 SC/APC',
		typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_4,
		connectorType: 'SC_APC',
		fiberLength: 2,
		faultyPort: 2
	},
	{
		id: 'splitter_1_8',
		icon: '/images/scheme/splitter-sc-upc-1-8.png',
		type: 'SPLITTER_1_8',
		label: 'Сплиттер 1:8 SC/UPC',
		typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_8,
		connectorType: 'SC_UPC',
		fiberLength: 3
	}
];

// ============================================================
// КОМПОНЕНТЫ ДЛЯ КОМПЛЕКСНОГО СЦЕНАРИЯ
// ============================================================

const SCENARIO_MAGISTRAL: PassiveComponent = {
	id: 'scenario_magistral',
	icon: '/images/scheme/optic-fiber-coil.png',
	type: 'FIBER_COIL',
	label: 'Магистральный кабель ОКСН-G.652D (10 км)',
	typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
	connectorType: 'SC_APC',
	fiberLength: 10000
};

const SCENARIO_SPLITTER: PassiveComponent = {
	id: 'scenario_splitter_1_8',
	icon: '/images/scheme/splitter-sc-apc-1-8.png',
	type: 'SPLITTER_1_8',
	label: 'Сплиттер 1:8 SC/APC',
	typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_8,
	connectorType: 'SC_APC',
	fiberLength: 2
};

const SCENARIO_BUILDING_CABLE: PassiveComponent = {
	id: 'scenario_building_cable',
	icon: '/images/scheme/optic-fiber-50m.png',
	type: 'FIBER_COIL',
	label: 'Внутридомовой оптический кабель G.652 (50 м)',
	typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
	connectorType: 'SC_APC',
	fiberLength: 50
};

const SCENARIO_SUBSCRIBER_CORD: PassiveComponent = {
	id: 'scenario_subscriber_cord',
	icon: '/images/scheme/sc-apc-g-652.png',
	type: 'OPTICAL_CABLE',
	label: 'Абонентский оптический шнур SC/APC (5 м)',
	typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
	connectorType: 'SC_APC',
	fiberLength: 5
};

const PROVIDER_SCENARIO: ComplexScenario = {
	id: 'provider_scenario',
	label: 'Комбинация элементов',
	description:
		'Магистральный кабель (10 км) → Сплиттер 1:8 → Внутридомовой кабель (50 м) → Абонентский шнур (5 м)',
	chain: [
		SCENARIO_MAGISTRAL,
		SCENARIO_SPLITTER,
		SCENARIO_BUILDING_CABLE,
		SCENARIO_SUBSCRIBER_CORD
	]
};

const complexScenarios: ComplexScenario[] = [PROVIDER_SCENARIO];

export function LabWork() {
	const { student, setStudent } = useRegistration();
	const studentRef = useRef(student);
	studentRef.current = student;

	const [currentStage, setCurrentStage] = useState<LabStage>('INTRODUCTION');
	const [selectedComponent, setSelectedComponent] = useState<PassiveComponent>(
		availableComponents[0]
	);
	const [activeScenario, setActiveScenario] = useState<ComplexScenario | null>(
		null
	);
	const [connectionScheme, setConnectionScheme] = useState<ConnectionScheme>({
		sequence: [],
		correctSequence: buildSingleComponentSequence(availableComponents[0])
	});

	const [deviceState, setDeviceState] =
		useState<DeviceState>(initialDeviceState);

	// ============================================================
	// СИСТЕМА ОЦЕНИВАНИЯ
	// ============================================================

	const [score, setScore] = useState(100);

	const handlePenalty = useCallback((_amount: number, _reason: string) => {
		setScore((prev) => Math.max(0, prev - _amount));
	}, []);

	const {
		state: resultsTableState,
		createTableForComponent,
		addDeviceMeasurement,
		enterStudentValue,
		enterFaultyChoice,
		saveFormulaInput,
		autoFillCurrentPending,
		isCellEditable,
		canProceedToNextMeasurement
	} = useResultsTable({ onPenalty: handlePenalty });

	// Все компоненты и сценарии завершены?
	const allComponentsMeasured = useMemo(() => {
		for (const component of availableComponents) {
			if (isSplitterType(component.type)) {
				const count = getSplitterOutputCount(component.type);
				for (let i = 1; i <= count; i++) {
					if (
						!resultsTableState.tables[`${component.id}_output_${i}`]
							?.isCompleted
					)
						return false;
				}
			} else {
				if (!resultsTableState.tables[component.id]?.isCompleted) return false;
			}
		}
		for (const scenario of complexScenarios) {
			const splitter = scenario.chain.find((c) => isSplitterType(c.type));
			if (splitter) {
				const count = getSplitterOutputCount(splitter.type);
				for (let i = 1; i <= count; i++) {
					if (
						!resultsTableState.tables[`${splitter.id}_output_${i}`]?.isCompleted
					)
						return false;
				}
			}
		}
		return Object.keys(resultsTableState.tables).length > 0;
	}, [resultsTableState.tables]);

	// Сохраняем результат лабораторной работы при завершении всех измерений
	useEffect(() => {
		if (!allComponentsMeasured) return;
		const digit = getGrade(score).digit;
		const updatedStudent = {
			...studentRef.current,
			labWorkResult: { score, grade: digit }
		};
		setStudent(updatedStudent);
		storage.saveStudent(updatedStudent);
	}, [allComponentsMeasured, score, setStudent]);

	// Обновляем correctSequence при смене компонента или сценария
	useEffect(() => {
		if (activeScenario) {
			// Комплексный сценарий: компоненты цепи с адаптерами между каждым
			setConnectionScheme((prev) => ({
				...prev,
				sequence: [],
				correctSequence: buildScenarioSequence(activeScenario.chain)
			}));
		} else {
			// Одиночный компонент: с адаптерами на обоих концах
			setConnectionScheme((prev) => ({
				...prev,
				sequence: [],
				correctSequence: buildSingleComponentSequence(selectedComponent)
			}));
		}
	}, [selectedComponent, activeScenario]);

	const deviceDispatchRef = useRef<Dispatch<DeviceAction> | null>(null);

	const handleCleanPorts = useCallback(() => {
		if (deviceDispatchRef.current) {
			deviceDispatchRef.current({ type: 'COMPLETE_PORT_CLEANING' });
		}
	}, []);

	// Текущий выбранный выход сплиттера (из схемы)
	const currentSplitterOutput = useMemo(() => {
		const schemeElement = connectionScheme.sequence.find(
			(el) => el.id === selectedComponent.id
		);
		return schemeElement?.splitterOutput ?? 1;
	}, [connectionScheme.sequence, selectedComponent.id]);

	// Эффективный ID таблицы: для сплиттеров — с суффиксом выхода
	const effectiveComponentId = useMemo(() => {
		if (isSplitterType(selectedComponent.type)) {
			return `${selectedComponent.id}_output_${currentSplitterOutput}`;
		}
		return selectedComponent.id;
	}, [selectedComponent.id, selectedComponent.type, currentSplitterOutput]);

	// Номера выходов сплиттера, по которым измерение завершено
	const measuredSplitterOutputs = useMemo(() => {
		if (!isSplitterType(selectedComponent.type)) return [];
		const count = getSplitterOutputCount(selectedComponent.type);
		return Array.from({ length: count }, (_, i) => i + 1).filter(
			(i) =>
				resultsTableState.tables[`${selectedComponent.id}_output_${i}`]
					?.isCompleted
		);
	}, [selectedComponent, resultsTableState.tables]);

	const lastProcessedResultRef = useRef<{
		componentId: string;
		timestamp: number;
	} | null>(null);

	// Отслеживание завершения FASTEST измерения
	// biome-ignore lint: Сложная логика обработки результатов из прибора, которая может быть трудно читаемой, но необходимой для корректной работы
	useEffect(() => {
		if (
			deviceState.screen === 'FASTEST_RESULTS' &&
			deviceState.currentFiberResult &&
			selectedComponent
		) {
			const resultTimestamp = deviceState.currentFiberResult.timestamp;

			const isAlreadyProcessed =
				lastProcessedResultRef.current?.timestamp === resultTimestamp;

			if (isAlreadyProcessed) {
				return;
			}

			// Для сплиттеров — создаём «виртуальный» компонент под конкретный выход.
			// При комплексном сценарии используем суммарную длину цепи, чтобы
			// таблица отображала колонку километрического затухания.
			const tableComponent: PassiveComponent = isSplitterType(
				selectedComponent.type
			)
				? {
						...selectedComponent,
						id: effectiveComponentId,
						fiberLength: activeScenario
							? activeScenario.chain.reduce((sum, c) => sum + c.fiberLength, 0)
							: selectedComponent.fiberLength,
						label: activeScenario
							? `${activeScenario.label} — вых. ${currentSplitterOutput} (${activeScenario.description})`
							: `${selectedComponent.label} (Выход ${currentSplitterOutput})`
					}
				: selectedComponent;

			const existingTable = resultsTableState.tables[effectiveComponentId];

			if (!existingTable) {
				const isActuallyFaulty =
					selectedComponent.faulty === true ||
					(selectedComponent.faultyPort !== undefined &&
						selectedComponent.faultyPort === currentSplitterOutput);

				createTableForComponent(
					tableComponent,
					deviceState.preparation.fastestSettings.lossWavelengths,
					isActuallyFaulty
				);
			}

			addDeviceMeasurement(
				effectiveComponentId,
				1,
				deviceState.currentFiberResult
			);

			lastProcessedResultRef.current = {
				componentId: effectiveComponentId,
				timestamp: resultTimestamp
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		createTableForComponent,
		deviceState.preparation.fastestSettings.lossWavelengths,
		deviceState.screen,
		deviceState.currentFiberResult,
		selectedComponent,
		addDeviceMeasurement,
		effectiveComponentId,
		currentSplitterOutput,
		activeScenario
	]);

	const canStartNextMeasurement = useMemo(() => {
		const table = resultsTableState.tables[effectiveComponentId];
		if (!table) return true;
		return canProceedToNextMeasurement(effectiveComponentId);
	}, [
		effectiveComponentId,
		resultsTableState.tables,
		canProceedToNextMeasurement
	]);

	const handleValueChange = useCallback(
		(
			componentId: string,
			wavelength: Wavelength,
			field: 'measurement' | 'average' | 'kilometricAttenuation',
			measurementIndex: number | null,
			value: number
		) => {
			enterStudentValue(
				componentId,
				wavelength,
				field,
				measurementIndex,
				value
			);
		},
		[enterStudentValue]
	);

	const handleSelectComponent = useCallback((component: PassiveComponent) => {
		setSelectedComponent(component);
		setActiveScenario(null);
	}, []);

	const handleSelectScenario = useCallback((scenario: ComplexScenario) => {
		setActiveScenario(scenario);
		// selectedComponent становится сплиттером сценария для отслеживания выходов
		const splitter = scenario.chain.find((c) => isSplitterType(c.type));
		if (splitter) setSelectedComponent(splitter);
	}, []);

	const handleStageChange = (stage: LabStage) => {
		setCurrentStage(stage);
	};

	const grade = getGrade(score);

	return (
		<div className="h-full overflow-auto bg-gray-50">
			<div className="mx-auto py-6 space-y-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Выполнение лабораторной работы
							</h1>
							<p className="mt-2 text-gray-600">
								Измерения оптическим тестером FOT-930
							</p>
						</div>

						{/* Блок баллов — виден на всех этапах */}
						<div className="flex items-center gap-4">
							<div className="text-right">
								<div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
									Баллы
								</div>
								<div className={`text-3xl font-bold ${scoreColor(score)}`}>
									{score}
									<span className="text-lg font-normal text-gray-400">
										{' '}
										/ 100
									</span>
								</div>
							</div>

							{allComponentsMeasured && (
								<div
									className={`px-4 py-2 rounded-lg text-center ${gradeBadgeStyle(score)}`}
								>
									<div className="text-xs uppercase tracking-wide mb-0.5 opacity-70">
										Оценка
									</div>
									<div className="text-2xl font-bold leading-none">
										{grade.digit}
									</div>
									<div className="text-xs mt-0.5">{grade.label}</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="flex gap-2 overflow-x-auto items-center">
						<StageButton
							stage="INTRODUCTION"
							label="Введение"
							active={currentStage === 'INTRODUCTION'}
							onClick={() => handleStageChange('INTRODUCTION')}
						/>
						<StageButton
							stage="PREPARATION"
							label="Подготовка"
							active={currentStage === 'PREPARATION'}
							onClick={() => handleStageChange('PREPARATION')}
						/>
						<StageButton
							stage="CONNECTION_SCHEME"
							label="Сборка схемы"
							active={currentStage === 'CONNECTION_SCHEME'}
							onClick={() => handleStageChange('CONNECTION_SCHEME')}
						/>
						<StageButton
							stage="RESULTS_ANALYSIS"
							label="Анализ результатов"
							active={currentStage === 'RESULTS_ANALYSIS'}
							onClick={() => handleStageChange('RESULTS_ANALYSIS')}
						/>
						{/* TODO: Вернуть условие с разработкой */}
						{/* {import.meta.env.DEV && */}
						{!deviceState.preparation.isReadyForMeasurements && (
							<button
								type="button"
								className="ml-auto shrink-0 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 cursor-pointer"
								onClick={() => {
									if (deviceDispatchRef.current) {
										deviceDispatchRef.current({ type: 'SKIP_PREPARATION' });
									}
									handleStageChange('CONNECTION_SCHEME');
								}}
							>
								Пропустить подготовку
							</button>
						)}
					</div>
				</div>

				{currentStage === 'INTRODUCTION' && <IntroductionStage />}

				{/* Двухколоночный блок: прибор + контент этапа */}
				<div
					className={
						currentStage === 'INTRODUCTION'
							? 'hidden'
							: 'flex flex-wrap xl:flex-nowrap gap-6'
					}
				>
					<div className="w-full xl:w-auto">
						<Device
							onDeviceStateChange={setDeviceState}
							onDispatchReady={(dispatch) => {
								deviceDispatchRef.current = dispatch;
							}}
							selectedComponent={selectedComponent}
							connectionScheme={connectionScheme}
							chainComponents={activeScenario?.chain}
							measurementHistoryKey={effectiveComponentId}
							splitterOutput={currentSplitterOutput}
						/>
					</div>

					<div className="space-y-6 grow min-w-0">
						{currentStage === 'PREPARATION' && (
							<PreparationStage
								deviceState={deviceState}
								onCleanPorts={handleCleanPorts}
							/>
						)}

						{currentStage === 'CONNECTION_SCHEME' && (
							<PassiveMeasurementsStage
								components={availableComponents}
								selectedComponent={selectedComponent}
								activeScenario={activeScenario}
								complexScenarios={complexScenarios}
								resultsTableState={resultsTableState}
								canStartNextMeasurement={canStartNextMeasurement}
								onSelectComponent={handleSelectComponent}
								onSelectScenario={handleSelectScenario}
							/>
						)}

						{currentStage === 'RESULTS_ANALYSIS' && (
							<ResultsStage
								resultsTableState={resultsTableState}
								selectedComponent={selectedComponent}
								onValueChange={handleValueChange}
								isCellEditable={(
									componentId,
									wavelength,
									field,
									measurementIndex
								) =>
									isCellEditable(
										componentId,
										wavelength,
										field,
										measurementIndex
									)
								}
								chainComponents={activeScenario?.chain}
								onFaultyChoiceChange={enterFaultyChoice}
								onSaveFormulaRow={(componentId, wavelength, value, correct) =>
									saveFormulaInput(componentId, wavelength, value, correct)
								}
								onAutoFill={autoFillCurrentPending}
							/>
						)}

						{currentStage !== 'PREPARATION' && (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<h3 className="font-semibold text-blue-900 mb-2">
									{getStageTitle(currentStage)}
								</h3>
								<p className="text-sm text-blue-800">
									{getStageInstructions(currentStage)}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Сборка схемы — на всю ширину, под двухколоночным блоком */}
				{currentStage === 'CONNECTION_SCHEME' && (
					<ConnectionSchemeStage
						scheme={connectionScheme}
						currentComponent={selectedComponent}
						onSchemeChange={setConnectionScheme}
						measuredSplitterOutputs={measuredSplitterOutputs}
						scenarioChain={activeScenario?.chain}
						onSchemeError={() =>
							handlePenalty(10, 'Ошибка при сборке схемы подключения')
						}
					/>
				)}
			</div>
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getGrade(score: number): { digit: number; label: string } {
	if (score >= 90) return { digit: 5, label: 'отлично' };
	if (score >= 70) return { digit: 4, label: 'хорошо' };
	if (score >= 55) return { digit: 3, label: 'удовлетворительно' };
	return { digit: 2, label: 'неудовлетворительно' };
}

function scoreColor(s: number): string {
	if (s >= 90) return 'text-green-600';
	if (s >= 70) return 'text-blue-600';
	if (s >= 55) return 'text-yellow-600';
	return 'text-red-600';
}

function gradeBadgeStyle(s: number): string {
	if (s >= 90) return 'bg-green-100 text-green-800';
	if (s >= 70) return 'bg-blue-100 text-blue-800';
	if (s >= 55) return 'bg-yellow-100 text-yellow-800';
	return 'bg-red-100 text-red-800';
}

function getStageTitle(stage: LabStage): string {
	const titles: Record<LabStage, string> = {
		INTRODUCTION: '',
		PREPARATION: '',
		CONNECTION_SCHEME: 'Сборка измерительной схемы',
		COMPLEX_SCHEMES: 'Сложные измерительные схемы',
		RESULTS_ANALYSIS: 'Анализ результатов'
	};
	return titles[stage];
}

/**
 * Строит correctSequence для одиночного компонента с адаптерами:
 * tester → ref_cord_1 → adapter_1 → component → adapter_2 → ref_cord_2 → tester_2
 */
function buildSingleComponentSequence(component: PassiveComponent): string[] {
	const isApc = component.connectorType === 'SC_APC';
	return [
		'tester',
		isApc ? 'connector_apc_1' : 'connector_upc_1',
		isApc ? 'adapter_apc_1' : 'adapter_upc_1',
		component.id,
		isApc ? 'adapter_apc_2' : 'adapter_upc_2',
		isApc ? 'connector_apc_2' : 'connector_upc_2',
		'tester_2'
	];
}

/**
 * Строит correctSequence для сценария с адаптерами между каждым компонентом:
 * tester → ref_1 → adapter_1 → c1 → adapter_2 → c2 → ... → adapter_N+1 → ref_2 → tester_2
 */
function buildScenarioSequence(chain: PassiveComponent[]): string[] {
	const result: string[] = ['tester', 'connector_apc_1'];
	for (let i = 0; i < chain.length; i++) {
		result.push(`adapter_apc_${i + 1}`);
		result.push(chain[i].id);
	}
	result.push(`adapter_apc_${chain.length + 1}`);
	result.push('connector_apc_2');
	result.push('tester_2');
	return result;
}

function getStageInstructions(stage: LabStage): string {
	const instructions: Record<LabStage, string> = {
		INTRODUCTION: '',
		PREPARATION: '',
		CONNECTION_SCHEME:
			'Выберите компонент или комплексную схему для измерения. Соберите схему подключения, перетаскивая элементы мышью. Для сплиттеров выполните измерение каждого выхода — нажимайте на точки элемента в схеме для переключения выходов.',
		COMPLEX_SCHEMES:
			'Выполните измерения для сложных схем с последовательным соединением нескольких компонентов.',
		RESULTS_ANALYSIS:
			'Просмотрите и проанализируйте результаты всех выполненных измерений. Сравните средние значения с типичными характеристиками компонентов.'
	};
	return instructions[stage];
}
