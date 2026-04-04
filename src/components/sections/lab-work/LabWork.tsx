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
import type {
	ConnectionScheme,
	DeviceAction,
	DeviceState,
	LabStage,
	PassiveComponent,
	Wavelength
} from '../../../types/fot930';
import { Device } from '../../fot930';
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
		label: 'Оптический шнур simplex SC/APC G.652 (2 м)',
		typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
		connectorType: 'SC_APC',
		fiberLength: 2
	},
	{
		id: 'optical_cable_2',
		icon: '/images/scheme/sc-upc-g-657.jpg',
		type: 'OPTICAL_CABLE',
		label: 'Оптический шнур simplex SC/UPC G.657 (3 м)',
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
	id: 'scenario_magistral_10km',
	icon: '/images/scheme/optic-fiber-coil.png',
	type: 'FIBER_COIL',
	label: 'Магистральный кабель ОКСН-G.652D (10 км)',
	typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
	connectorType: 'SC_APC',
	fiberLength: 10000
};

const SCENARIO_SPLITTER: PassiveComponent = {
	id: 'scenario_splitter_1_8',
	icon: '/images/scheme/splitter-sc-upc-1-8.png',
	type: 'SPLITTER_1_8',
	label: 'Сплиттер 1:8 SC/APC (распределительный)',
	typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_8,
	connectorType: 'SC_APC',
	fiberLength: 2
};

const SCENARIO_SUBSCRIBER: PassiveComponent = {
	id: 'scenario_subscriber_2km',
	icon: '/images/scheme/optic-fiber-coil.png',
	type: 'FIBER_COIL',
	label: 'Абонентский кабель ОККС-G.652D (2 км)',
	typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
	connectorType: 'SC_APC',
	fiberLength: 2000
};

const PROVIDER_SCENARIO: ComplexScenario = {
	id: 'provider_scenario',
	label: 'Комбинация элементов',
	description:
		'Магистральный кабель (10 км) → Сплиттер 1:8 → Абонентский кабель (2 км)',
	chain: [SCENARIO_MAGISTRAL, SCENARIO_SPLITTER, SCENARIO_SUBSCRIBER]
};

const complexScenarios: ComplexScenario[] = [PROVIDER_SCENARIO];

export function LabWork() {
	const [currentStage, setCurrentStage] = useState<LabStage>('INTRODUCTION');
	const [selectedComponent, setSelectedComponent] = useState<PassiveComponent>(
		availableComponents[0]
	);
	const [activeScenario, setActiveScenario] = useState<ComplexScenario | null>(
		null
	);
	const [connectionScheme, setConnectionScheme] = useState<ConnectionScheme>({
		sequence: [],
		correctSequence: [
			'tester',
			selectedComponent.connectorType === 'SC_APC'
				? 'connector_apc_1'
				: 'connector_upc_1',
			selectedComponent.id,
			selectedComponent.connectorType === 'SC_APC'
				? 'connector_apc_2'
				: 'connector_upc_2',
			'tester_2'
		]
	});

	const [deviceState, setDeviceState] =
		useState<DeviceState>(initialDeviceState);

	const {
		state: resultsTableState,
		createTableForComponent,
		addDeviceMeasurement,
		enterStudentValue,
		enterFaultyChoice,
		isCellEditable,
		canProceedToNextMeasurement
	} = useResultsTable();

	// Обновляем correctSequence при смене компонента или сценария
	useEffect(() => {
		if (activeScenario) {
			// Комплексный сценарий: все компоненты цепи в схеме
			setConnectionScheme((prev) => ({
				...prev,
				sequence: [],
				correctSequence: [
					'tester',
					'connector_apc_1',
					...activeScenario.chain.map((c) => c.id),
					'connector_apc_2',
					'tester_2'
				]
			}));
		} else {
			// Одиночный компонент
			setConnectionScheme((prev) => ({
				...prev,
				sequence: [],
				correctSequence: [
					'tester',
					selectedComponent.connectorType === 'SC_APC'
						? 'connector_apc_1'
						: 'connector_upc_1',
					selectedComponent.id,
					selectedComponent.connectorType === 'SC_APC'
						? 'connector_apc_2'
						: 'connector_upc_2',
					'tester_2'
				]
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

	return (
		<div className="h-full overflow-auto bg-gray-50">
			<div className="mx-auto py-6 space-y-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Выполнение лабораторной работы
					</h1>
					<p className="mt-2 text-gray-600">
						Измерения оптическим тестером FOT-930
					</p>
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
							label="Результаты"
							active={currentStage === 'RESULTS_ANALYSIS'}
							onClick={() => handleStageChange('RESULTS_ANALYSIS')}
						/>
						{import.meta.env.DEV &&
							!deviceState.preparation.isReadyForMeasurements && (
								<button
									type="button"
									className="ml-auto shrink-0 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
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
								onFaultyChoiceChange={enterFaultyChoice}
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
					/>
				)}
			</div>
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

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
