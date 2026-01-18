/**
 * Главный компонент раздела "Выполнение лабораторной работы"
 * Координирует работу всех этапов лабораторной работы
 */

import { useState, useCallback } from 'react';
import type {
	LabStage,
	PassiveComponent,
	CompletedMeasurement,
	ConnectionScheme,
	MeasurementMode,
	Wavelength
} from '../../../types/fot930';
import { Device, ConnectionBuilder, MeasurementTable } from '../../fot930';
import {
	generateSingleComponentMeasurement,
	generateComplexSchemeMeasurement,
	COMPONENT_LOSS_DB
} from '../../../lib/fot930/measurementEngine';

export function LabWork() {
	const [currentStage, setCurrentStage] = useState<LabStage>('PREPARATION');
	const [selectedComponent, setSelectedComponent] = useState<PassiveComponent | null>(null);
	const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');
	const [attemptCount, setAttemptCount] = useState(1);
	const [measurements, setMeasurements] = useState<CompletedMeasurement[]>([]);
	const [connectionScheme, setConnectionScheme] = useState<ConnectionScheme>({
		sequence: [],
		correctSequence: [
			'tester',
			'connector_apc_1',
			'splitter_1_4',
			'connector_apc_2',
			'tester_2'
		]
	});

	// Текущие настройки прибора (из Device component)
	const [currentMode, setCurrentMode] = useState<MeasurementMode | null>(null);
	const [currentWavelength, setCurrentWavelength] = useState<Wavelength | null>(null);

	// Доступные компоненты для измерений
	const availableComponents: PassiveComponent[] = [
		{
			id: 'optical_cable_1',
			type: 'OPTICAL_CABLE',
			label: 'Оптический шнур 1',
			typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
			connectorA: 'SC_APC',
			connectorType: 'SC_APC'
		},
		{
			id: 'fiber_coil_1',
			type: 'FIBER_COIL',
			label: 'Катушка ОВ (500м)',
			typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
			connectorA: 'SC_UPC',
			connectorType: 'SC_UPC'
		},
		{
			id: 'splitter_1_2',
			type: 'SPLITTER_1_2',
			label: 'Сплиттер 1:2',
			typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_2,
			connectorA: 'SC_APC',
			connectorType: 'SC_APC'
		},
		{
			id: 'splitter_1_4',
			type: 'SPLITTER_1_4',
			label: 'Сплиттер 1:4',
			typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_4,
			connectorA: 'SC_APC',
			connectorType: 'SC_APC'
		},
		{
			id: 'splitter_1_8',
			type: 'SPLITTER_1_8',
			label: 'Сплиттер 1:8',
			typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_8,
			connectorA: 'SC_UPC',
			connectorType: 'SC_UPC'
		}
	];

	// Обработчик измерения
	const handleMeasure = useCallback(async (): Promise<
		{ value: number; unit: 'dBm' | 'dB' } | { error: string }
	> => {
		if (!selectedComponent || !currentMode || !currentWavelength) {
			return { error: 'Выберите компонент и настройте прибор' };
		}

		// Имитация задержки измерения
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Генерируем результат измерения
		const result = generateSingleComponentMeasurement(
			selectedComponent,
			currentMode,
			currentWavelength
		);

		if ('error' in result) {
			return result;
		}

		// Сохраняем измерение
		const completedMeasurement: CompletedMeasurement = {
			componentId: selectedComponent.id,
			componentLabel: selectedComponent.label,
			wavelength: currentWavelength,
			side: currentSide,
			attemptNumber: attemptCount,
			result: {
				value: result.value,
				unit: result.unit,
				mode: currentMode,
				wavelength: currentWavelength,
				timestamp: Date.now()
			}
		};

		setMeasurements((prev) => [...prev, completedMeasurement]);

		// Увеличиваем счётчик попыток
		if (attemptCount < 3) {
			setAttemptCount((prev) => prev + 1);
		}

		return result;
	}, [selectedComponent, currentMode, currentWavelength, currentSide, attemptCount]);

	// Переключение между этапами
	const handleStageChange = (stage: LabStage) => {
		setCurrentStage(stage);
	};

	return (
		<div className="h-full overflow-auto bg-gray-50">
			<div className="max-w-7xl mx-auto p-6 space-y-6">
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
							stage="SINGLE_MEASUREMENTS"
							label="Измерения"
							active={currentStage === 'SINGLE_MEASUREMENTS'}
							onClick={() => handleStageChange('SINGLE_MEASUREMENTS')}
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
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Левая колонка: Прибор */}
					<div className="space-y-6">
						<Device onMeasure={handleMeasure} />

						{/* Инструкции по текущему этапу */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h3 className="font-semibold text-blue-900 mb-2">
								{getStageTitle(currentStage)}
							</h3>
							<p className="text-sm text-blue-800">
								{getStageInstructions(currentStage)}
							</p>
						</div>
					</div>

					{/* Правая колонка: Контент этапа */}
					<div className="space-y-6">
						{currentStage === 'PREPARATION' && (
							<PreparationStage />
						)}

						{currentStage === 'SINGLE_MEASUREMENTS' && (
							<SingleMeasurementsStage
								components={availableComponents}
								selectedComponent={selectedComponent}
								onSelectComponent={setSelectedComponent}
								currentSide={currentSide}
								onChangeSide={setCurrentSide}
								attemptCount={attemptCount}
								onResetAttempts={() => setAttemptCount(1)}
							/>
						)}

						{currentStage === 'CONNECTION_SCHEME' && (
							<ConnectionSchemeStage
								scheme={connectionScheme}
								onSchemeChange={setConnectionScheme}
							/>
						)}

						{currentStage === 'RESULTS_ANALYSIS' && (
							<ResultsStage
								measurements={measurements}
								components={availableComponents}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================

interface StageButtonProps {
	stage: LabStage;
	label: string;
	active: boolean;
	onClick: () => void;
}

function StageButton({ label, active, onClick }: StageButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
				active
					? 'bg-blue-600 text-white shadow-lg'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
			}`}
		>
			{label}
		</button>
	);
}

function PreparationStage() {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 space-y-4">
			<h2 className="text-xl font-semibold">Этап 1. Подготовка прибора</h2>

			<div className="space-y-3 text-sm">
				<div className="flex items-start gap-2">
					<span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
						1
					</span>
					<p>Нажмите кнопку <strong>POWER</strong> для включения прибора</p>
				</div>

				<div className="flex items-start gap-2">
					<span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
						2
					</span>
					<p>После загрузки нажмите <strong>MENU</strong> для входа в меню</p>
				</div>

				<div className="flex items-start gap-2">
					<span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
						3
					</span>
					<p>
						Используйте кнопки <strong>UP/DOWN</strong> для выбора режима измерения
						(POWER или LOSS)
					</p>
				</div>

				<div className="flex items-start gap-2">
					<span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
						4
					</span>
					<p>Нажмите <strong>ENTER</strong> для подтверждения</p>
				</div>

				<div className="flex items-start gap-2">
					<span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
						5
					</span>
					<p>
						Выберите длину волны (850, 1300, 1310 или 1550 нм) и подтвердите выбор
					</p>
				</div>
			</div>
		</div>
	);
}

interface SingleMeasurementsStageProps {
	components: PassiveComponent[];
	selectedComponent: PassiveComponent | null;
	onSelectComponent: (component: PassiveComponent) => void;
	currentSide: 'A' | 'B';
	onChangeSide: (side: 'A' | 'B') => void;
	attemptCount: number;
	onResetAttempts: () => void;
}

function SingleMeasurementsStage({
	components,
	selectedComponent,
	onSelectComponent,
	currentSide,
	onChangeSide,
	attemptCount,
	onResetAttempts
}: SingleMeasurementsStageProps) {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 2. Измерение одиночных компонентов
				</h2>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Выберите компонент для измерения:
						</label>
						<div className="grid grid-cols-1 gap-2">
							{components.map((component) => (
								<button
									type="button"
									key={component.id}
									onClick={() => {
										onSelectComponent(component);
										onResetAttempts();
									}}
									className={`p-3 rounded-lg border-2 text-left transition ${
										selectedComponent?.id === component.id
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<div className="font-medium">{component.label}</div>
									<div className="text-xs text-gray-500 mt-1">
										Тип: {component.type.replace(/_/g, ' ')}
									</div>
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Сторона измерения:
						</label>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => {
									onChangeSide('A');
									onResetAttempts();
								}}
								className={`flex-1 py-2 rounded-lg border-2 font-medium transition ${
									currentSide === 'A'
										? 'border-blue-600 bg-blue-50 text-blue-900'
										: 'border-gray-200 hover:border-gray-300'
								}`}
							>
								Сторона A
							</button>
							<button
								type="button"
								onClick={() => {
									onChangeSide('B');
									onResetAttempts();
								}}
								className={`flex-1 py-2 rounded-lg border-2 font-medium transition ${
									currentSide === 'B'
										? 'border-blue-600 bg-blue-50 text-blue-900'
										: 'border-gray-200 hover:border-gray-300'
								}`}
							>
								Сторона B
							</button>
						</div>
					</div>

					<div className="bg-gray-50 p-3 rounded">
						<div className="text-sm">
							<span className="font-medium">Текущая попытка:</span> {attemptCount} из 3
						</div>
						{attemptCount === 3 && (
							<div className="mt-2 text-xs text-gray-600">
								Выполнены все 3 измерения. Выберите другую сторону или компонент.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

interface ConnectionSchemeStageProps {
	scheme: ConnectionScheme;
	onSchemeChange: (scheme: ConnectionScheme) => void;
}

function ConnectionSchemeStage({ scheme, onSchemeChange }: ConnectionSchemeStageProps) {
	const availableElements = [
		{ type: 'TESTER' as const, id: 'tester', label: 'Тестер FOT-930' },
		{
			type: 'CONNECTOR' as const,
			id: 'connector_apc_1',
			label: 'SC/APC 1',
			connectorType: 'SC_APC' as const
		},
		{
			type: 'CONNECTOR' as const,
			id: 'connector_apc_2',
			label: 'SC/APC 2',
			connectorType: 'SC_APC' as const
		},
		{ type: 'COMPONENT' as const, id: 'splitter_1_4', label: 'Сплиттер 1:4' },
		{ type: 'TESTER' as const, id: 'tester_2', label: 'Тестер FOT-930 2' }
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Этап 3. Сборка схемы подключения</h2>

			<ConnectionBuilder
				scheme={scheme}
				onChange={onSchemeChange}
				availableElements={availableElements}
			/>
		</div>
	);
}

interface ResultsStageProps {
	measurements: CompletedMeasurement[];
	components: PassiveComponent[];
}

function ResultsStage({ measurements, components }: ResultsStageProps) {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 5. Анализ результатов измерений
				</h2>

				<p className="text-sm text-gray-600 mb-4">
					Всего выполнено измерений: <strong>{measurements.length}</strong>
				</p>
			</div>

			{/* Таблицы результатов для каждого компонента */}
			{components.map((component) => (
				<MeasurementTable
					key={component.id}
					measurements={measurements}
					componentId={component.id}
					componentLabel={component.label}
				/>
			))}

			{measurements.length === 0 && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
					<p className="text-yellow-800">
						Нет выполненных измерений. Перейдите к этапу "Измерения" для выполнения
						измерений.
					</p>
				</div>
			)}
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getStageTitle(stage: LabStage): string {
	const titles: Record<LabStage, string> = {
		PREPARATION: 'Подготовка прибора к работе',
		SINGLE_MEASUREMENTS: 'Выполнение измерений',
		CONNECTION_SCHEME: 'Сборка измерительной схемы',
		COMPLEX_SCHEMES: 'Сложные измерительные схемы',
		RESULTS_ANALYSIS: 'Анализ результатов'
	};
	return titles[stage];
}

function getStageInstructions(stage: LabStage): string {
	const instructions: Record<LabStage, string> = {
		PREPARATION:
			'Включите прибор, выберите режим измерения и длину волны. После настройки прибор будет готов к работе.',
		SINGLE_MEASUREMENTS:
			'Выберите компонент для измерения, укажите сторону (A или B) и нажмите MEASURE на приборе. Выполните 3 измерения для каждой комбинации.',
		CONNECTION_SCHEME:
			'Соберите правильную схему подключения, перетаскивая элементы мышью. Проверьте корректность последовательности перед измерениями.',
		COMPLEX_SCHEMES:
			'Выполните измерения для сложных схем с последовательным соединением нескольких компонентов.',
		RESULTS_ANALYSIS:
			'Просмотрите и проанализируйте результаты всех выполненных измерений. Сравните средние значения с типичными характеристиками компонентов.'
	};
	return instructions[stage];
}
