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
	PassiveMeasurementsStage,
	PreparationStage,
	ResultsStage,
	StageButton
} from './components';

// Доступные компоненты для измерений
const availableComponents: PassiveComponent[] = [
	{
		id: 'optical_cable_1',
		icon: '/images/icons/coil.png',
		type: 'OPTICAL_CABLE',
		label: 'Оптический шнур 1',
		typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
		connectorType: 'SC_APC',
		fiberLength: 2
	},
	{
		id: 'fiber_coil_1',
		icon: '/images/icons/cable-reel.png',
		type: 'FIBER_COIL',
		label: 'Катушка ОВ (500м)',
		typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
		connectorType: 'SC_UPC',
		fiberLength: 500
	},
	{
		id: 'splitter_1_2',
		icon: '/images/icons/splitter.png',
		type: 'SPLITTER_1_2',
		label: 'Сплиттер 1:2',
		typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_2,
		connectorType: 'SC_APC',
		fiberLength: 1
	},
	{
		id: 'splitter_1_4',
		icon: '/images/icons/splitter.png',
		type: 'SPLITTER_1_4',
		label: 'Сплиттер 1:4',
		typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_4,
		connectorType: 'SC_APC',
		fiberLength: 1
	},
	{
		id: 'splitter_1_8',
		icon: '/images/icons/splitter.png',
		type: 'SPLITTER_1_8',
		label: 'Сплиттер 1:8',
		typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_8,
		connectorType: 'SC_UPC',
		fiberLength: 2
	}
];

// TODO: Добавить завершение лабораторной работы после всех измерений
export function LabWork() {
	const [currentStage, setCurrentStage] = useState<LabStage>('PREPARATION');
	const [selectedComponent, setSelectedComponent] = useState<PassiveComponent>(
		availableComponents[0]
	);
	const [connectionScheme, setConnectionScheme] = useState<ConnectionScheme>({
		sequence: [],
		correctSequence: [
			'tester',
			selectedComponent.connectorType === 'SC_APC' ? 'connector_apc_1' : 'connector_upc_1',
			selectedComponent.id,
			selectedComponent.connectorType === 'SC_APC' ? 'connector_apc_2' : 'connector_upc_2',
			'tester_2'
		]
	});

	const [deviceState, setDeviceState] =
		useState<DeviceState>(initialDeviceState);

	// Хук управления таблицами результатов
	const {
		state: resultsTableState,
		createTableForComponent,
		addDeviceMeasurement,
		enterStudentValue,
		isCellEditable,
		canProceedToNextMeasurement
	} = useResultsTable();

	useEffect(() => {
		setConnectionScheme((prev) => ({
			...prev,
			correctSequence: [
				'tester',
				selectedComponent.connectorType === 'SC_APC' ? 'connector_apc_1' : 'connector_upc_1',
				selectedComponent.id,
				selectedComponent.connectorType === 'SC_APC' ? 'connector_apc_2' : 'connector_upc_2',
				'tester_2'
			]
		}));
	}, [selectedComponent]);

	// Ссылка на dispatch для отправки действий в Device
	const deviceDispatchRef = useRef<Dispatch<DeviceAction> | null>(null);

	// Обработчик очистки портов
	const handleCleanPorts = useCallback(() => {
		if (deviceDispatchRef.current) {
			// Отправляем действие очистки портов в Device
			deviceDispatchRef.current({ type: 'CLEAN_PORTS' });

			// Через 3 секунды завершаем очистку
			setTimeout(() => {
				if (deviceDispatchRef.current) {
					deviceDispatchRef.current({ type: 'COMPLETE_PORT_CLEANING' });
				}
			}, 3000);
		}
	}, []);

	// Ссылка для отслеживания последнего обработанного результата
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
			const componentId = selectedComponent.id;
			const resultTimestamp = deviceState.currentFiberResult.timestamp;

			// Проверяем, был ли этот результат уже обработан
			// Если timestamp совпадает, это старый результат (не важно для какого компонента)
			const isAlreadyProcessed =
				lastProcessedResultRef.current?.timestamp === resultTimestamp;

			if (isAlreadyProcessed) {
				return; // Результат уже обработан, пропускаем
			}

			const existingTable = resultsTableState.tables[componentId];

			// Таблица должна существовать (создается при выборе компонента)
			if (!existingTable) {
				createTableForComponent(
					selectedComponent,
					deviceState.preparation.fastestSettings.lossWavelengths
				);
			}

			// Добавляем результат измерения
			addDeviceMeasurement(
				componentId,
				1, // Этот параметр игнорируется, хук использует внутреннее состояние
				deviceState.currentFiberResult
			);

			// Запоминаем, что обработали этот результат
			lastProcessedResultRef.current = {
				componentId,
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
		addDeviceMeasurement
	]);

	// Вывод предупреждения при попытке начать следующее измерение без ввода данных текущего
	const canStartNextMeasurement = useMemo(() => {
		if (!selectedComponent) return false;

		const table = resultsTableState.tables[selectedComponent.id];
		if (!table) return true; // Первое измерение всегда доступно

		// Проверяем, можно ли начать следующее измерение
		// (все данные текущего измерения введены)
		return canProceedToNextMeasurement(selectedComponent.id);
	}, [
		selectedComponent,
		resultsTableState.tables,
		canProceedToNextMeasurement
	]);

	// Обработчик ввода значений
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

	// Переключение между этапами
	const handleStageChange = (stage: LabStage) => {
		setCurrentStage(stage);
	};

	return (
		<div className="h-full overflow-auto bg-gray-50">
			<div className="mx-auto py-6 space-y-6">
				{/* Заголовок */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Выполнение лабораторной работы
					</h1>
					<p className="mt-2 text-gray-600">
						Измерения оптическим тестером FOT-930
					</p>
				</div>

				{/* Навигация по этапам */}
				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="flex gap-2 overflow-x-auto">
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
					</div>
				</div>

				{/* Содержимое этапа */}
				<div className="flex flex-wrap xl:flex-nowrap gap-6">
					{/* Левая колонка: Прибор */}
					<div className="w-full xl:w-auto">
						<Device
							onDeviceStateChange={setDeviceState}
							onDispatchReady={(dispatch) => {
								deviceDispatchRef.current = dispatch;
							}}
							selectedComponent={selectedComponent}
							connectionScheme={connectionScheme}
						/>
					</div>

					{/* Правая колонка: Контент этапа */}
					<div className="space-y-6 grow">
						{currentStage === 'PREPARATION' && (
							<PreparationStage
								deviceState={deviceState}
								onCleanPorts={handleCleanPorts}
							/>
						)}

						{currentStage === 'CONNECTION_SCHEME' && (
							<>
								<PassiveMeasurementsStage
									components={availableComponents}
									selectedComponent={selectedComponent}
									resultsTableState={resultsTableState}
									canStartNextMeasurement={canStartNextMeasurement}
									onSelectComponent={setSelectedComponent}
								/>

								<ConnectionSchemeStage
									scheme={connectionScheme}
									currentComponent={selectedComponent}
									onSchemeChange={setConnectionScheme}
								/>
							</>
						)}

						{currentStage === 'RESULTS_ANALYSIS' && (
							<ResultsStage
								resultsTableState={resultsTableState}
								selectedComponentId={selectedComponent.id}
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
							/>
						)}

						{/* Инструкции по текущему этапу */}
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
			</div>
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getStageTitle(stage: LabStage): string {
	const titles: Record<LabStage, string> = {
		PREPARATION: '',
		CONNECTION_SCHEME: 'Сборка измерительной схемы',
		COMPLEX_SCHEMES: 'Сложные измерительные схемы',
		RESULTS_ANALYSIS: 'Анализ результатов'
	};
	return titles[stage];
}

function getStageInstructions(stage: LabStage): string {
	const instructions: Record<LabStage, string> = {
		PREPARATION: '',
		CONNECTION_SCHEME:
			'Выберите компонент для измерения и соберите правильную схему подключения, перетаскивая элементы мышью. Проверьте корректность последовательности перед измерениями. Выполните 3 измерения для каждого компонента.',
		COMPLEX_SCHEMES:
			'Выполните измерения для сложных схем с последовательным соединением нескольких компонентов.',
		RESULTS_ANALYSIS:
			'Просмотрите и проанализируйте результаты всех выполненных измерений. Сравните средние значения с типичными характеристиками компонентов.'
	};
	return instructions[stage];
}
