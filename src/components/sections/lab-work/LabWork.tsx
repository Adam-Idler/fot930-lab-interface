/**
 * Главный компонент раздела "Выполнение лабораторной работы"
 * Координирует работу всех этапов лабораторной работы
 */

import { type Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { initialDeviceState } from '../../../lib/fot930/deviceReducer';
import { COMPONENT_LOSS_DB } from '../../../lib/fot930/measurementEngine';
import type {
	CompletedMeasurement,
	ConnectionScheme,
	DeviceAction,
	DeviceState,
	LabStage,
	PassiveComponent
} from '../../../types/fot930';
import { Device } from '../../fot930';
import {
	ConnectionSchemeStage,
	PassiveMeasurementsStage,
	PreparationStage,
	ResultsStage,
	StageButton
} from './components';

// Добавить завершение лабораторной работы после всех измерений
export function LabWork() {
	const [currentStage, setCurrentStage] = useState<LabStage>('PREPARATION');
	const [selectedComponent, setSelectedComponent] =
		useState<PassiveComponent | null>(null);
	// TODO: Восстановить при повторном подходе к реализации измерений
	const [_attemptCount, setAttemptCount] = useState(1);
	const [measurements, _setMeasurements] = useState<CompletedMeasurement[]>([]);
	const [connectionScheme, setConnectionScheme] = useState<ConnectionScheme>({
		sequence: [],
		correctSequence: [
			'tester',
			'connector_apc_1',
			selectedComponent?.id || 'optical_cable_1',
			'connector_apc_2',
			'tester_2'
		]
	});

	useEffect(() => {
		// Сбросить измерения при смене выбранного компонента
		setConnectionScheme((prev) => ({
			...prev,
			correctSequence: [
				'tester',
				'connector_apc_1',
				selectedComponent?.id || 'optical_cable_1',
				'connector_apc_2',
				'tester_2'
			]
		}));
	}, [selectedComponent]);

	const [deviceState, setDeviceState] =
		useState<DeviceState>(initialDeviceState);

	// Ссылка на dispatch для отправки действий в Device
	const deviceDispatchRef = useRef<Dispatch<DeviceAction> | null>(null);

	// Доступные компоненты для измерений
	const availableComponents: PassiveComponent[] = [
		{
			id: 'optical_cable_1',
			type: 'OPTICAL_CABLE',
			label: 'Оптический шнур 1',
			typicalLoss: COMPONENT_LOSS_DB.OPTICAL_CABLE,
			connectorType: 'SC_APC',
			fiberLength: 2
		},
		{
			id: 'fiber_coil_1',
			type: 'FIBER_COIL',
			label: 'Катушка ОВ (500м)',
			typicalLoss: COMPONENT_LOSS_DB.FIBER_COIL,
			connectorType: 'SC_UPC',
			fiberLength: 500
		},
		{
			id: 'splitter_1_2',
			type: 'SPLITTER_1_2',
			label: 'Сплиттер 1:2',
			typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_2,
			connectorType: 'SC_APC',
			fiberLength: 1
		},
		{
			id: 'splitter_1_4',
			type: 'SPLITTER_1_4',
			label: 'Сплиттер 1:4',
			typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_4,
			connectorType: 'SC_APC',
			fiberLength: 1
		},
		{
			id: 'splitter_1_8',
			type: 'SPLITTER_1_8',
			label: 'Сплиттер 1:8',
			typicalLoss: COMPONENT_LOSS_DB.SPLITTER_1_8,
			connectorType: 'SC_UPC',
			fiberLength: 2
		}
	];

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
									measurements={measurements}
									onSelectComponent={setSelectedComponent}
									onResetAttempts={() => setAttemptCount(1)}
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
								measurements={measurements}
								components={availableComponents}
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
