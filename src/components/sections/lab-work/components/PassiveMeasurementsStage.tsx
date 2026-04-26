import clsx from 'clsx';
import {
	getSplitterOutputCount,
	isSplitterType
} from '../../../../lib/fot930/splitter';
import type {
	PassiveComponent,
	ResultsTableState
} from '../../../../types/fot930';

/** Описание комплексного сценария измерения */
export interface ComplexScenario {
	id: string;
	label: string;
	description: string;
	chain: PassiveComponent[];
}

interface PassiveMeasurementsStageProps {
	components: PassiveComponent[];
	selectedComponent: PassiveComponent | null;
	activeScenario: ComplexScenario | null;
	complexScenarios: ComplexScenario[];
	resultsTableState: ResultsTableState;
	canStartNextMeasurement: boolean;
	onSelectComponent: (component: PassiveComponent) => void;
	onSelectScenario: (scenario: ComplexScenario) => void;
}

interface MeasurementStatus {
	count: number;
	total: number;
	isMeasured: boolean;
	/** Числа заполнены, но вывод об исправности ещё не сделан */
	needsFaultyChoice: boolean;
}

/** Возвращает статус измерений для одиночного компонента */
function getMeasurementStatus(
	component: PassiveComponent,
	tables: ResultsTableState['tables']
): MeasurementStatus {
	if (isSplitterType(component.type)) {
		const outputCount = getSplitterOutputCount(component.type);
		const outputStatuses = Array.from({ length: outputCount }, (_, i) => {
			const t = tables[`${component.id}_output_${i + 1}`];
			return {
				isCompleted: t?.isCompleted ?? false,
				measurementsCompleted: t?.measurementsCompleted ?? false
			};
		});
		const completedOutputs = outputStatuses.filter((s) => s.isCompleted).length;
		const needsFaultyChoice =
			completedOutputs < outputCount &&
			outputStatuses.some((s) => s.measurementsCompleted && !s.isCompleted);
		return {
			count: completedOutputs,
			total: outputCount,
			isMeasured: completedOutputs === outputCount && outputCount > 0,
			needsFaultyChoice
		};
	}

	const table = tables[component.id];
	const isMeasured = table?.isCompleted ?? false;
	const measurementsCompleted = table?.measurementsCompleted ?? false;
	const needsFaultyChoice = measurementsCompleted && !isMeasured;

	const count = table
		? Math.max(
				Math.min(
					table.currentMeasurementNumber - (measurementsCompleted ? 0 : 1),
					3
				),
				0
			)
		: 0;
	return { count, total: 3, isMeasured, needsFaultyChoice };
}

/** Возвращает статус измерений для комплексного сценария (по его сплиттеру) */
function getScenarioMeasurementStatus(
	scenario: ComplexScenario,
	tables: ResultsTableState['tables']
): MeasurementStatus {
	const splitter = scenario.chain.find((c) => isSplitterType(c.type));
	if (!splitter) {
		return { count: 0, total: 1, isMeasured: false, needsFaultyChoice: false };
	}
	return getMeasurementStatus(splitter, tables);
}

export function PassiveMeasurementsStage({
	components,
	selectedComponent,
	activeScenario,
	complexScenarios,
	resultsTableState,
	canStartNextMeasurement,
	onSelectComponent,
	onSelectScenario
}: PassiveMeasurementsStageProps) {
	return (
		<div className="space-y-4">
			<div className="bg-white rounded-lg shadow-md p-6 h-full">
				<h2 className="text-xl font-semibold mb-4">
					Этап 2. Выбор объекта измерения
				</h2>

				<div className="text-sm font-medium mb-2">
					Выберите компонент для измерения:
				</div>

				<div className="flex flex-col gap-2">
					{/* Одиночные компоненты */}
					{components.map((component) => {
						const { count, total, isMeasured, needsFaultyChoice } =
							getMeasurementStatus(component, resultsTableState.tables);
						const isSplitter = isSplitterType(component.type);
						const isSelected =
							!activeScenario && selectedComponent?.id === component.id;

						return (
							<button
								type="button"
								key={component.id}
								onClick={() => onSelectComponent(component)}
								className={clsx(
									'w-full p-3 rounded-lg border-2 text-left transition',
									isSelected
										? 'border-blue-600 bg-blue-50'
										: isMeasured
											? 'border-green-500 bg-green-50 hover:border-green-600 hover:cursor-pointer'
											: needsFaultyChoice
												? 'border-yellow-400 bg-yellow-50 hover:border-yellow-500 hover:cursor-pointer'
												: 'border-gray-200 hover:border-gray-300 hover:cursor-pointer'
								)}
							>
								<div className="font-medium text-sm">{component.label}</div>
								<div
									className={clsx(
										'text-xs mt-1 font-medium',
										isMeasured
											? 'text-green-600'
											: needsFaultyChoice
												? 'text-yellow-700'
												: 'text-gray-500'
									)}
								>
									{isMeasured
										? isSplitter
											? `Все ${total} выхода измерены`
											: 'Измерение выполнено'
										: needsFaultyChoice
											? isSplitter
												? 'Требуется вывод об исправности выходов'
												: 'Требуется вывод об исправности'
											: count === 0
												? 'Измерение не выполнено'
												: isSplitter
													? `Измерено ${count} из ${total} выходов`
													: `Выполнено ${count} из ${total} измерений`}
								</div>
							</button>
						);
					})}

					{/* Комплексные сценарии */}
					{complexScenarios.map((scenario) => {
						const { count, total, isMeasured, needsFaultyChoice } =
							getScenarioMeasurementStatus(scenario, resultsTableState.tables);
						const isSelected = activeScenario?.id === scenario.id;

						return (
							<button
								type="button"
								key={scenario.id}
								onClick={() => onSelectScenario(scenario)}
								className={clsx(
									'w-full p-3 rounded-lg border-2 text-left transition',
									isSelected
										? 'border-blue-600 bg-blue-50'
										: isMeasured
											? 'border-green-500 bg-green-50 hover:border-green-600 hover:cursor-pointer'
											: needsFaultyChoice
												? 'border-yellow-400 bg-yellow-50 hover:border-yellow-500 hover:cursor-pointer'
												: 'border-gray-200 hover:border-gray-300 hover:cursor-pointer'
								)}
							>
								<div className="font-medium text-sm">{scenario.label}</div>
								<div className="text-xs text-gray-400 mt-0.5">
									{scenario.description}
								</div>
								<div
									className={clsx(
										'text-xs mt-1 font-medium',
										isMeasured
											? 'text-green-600'
											: needsFaultyChoice
												? 'text-yellow-700'
												: 'text-gray-500'
									)}
								>
									{isMeasured
										? `Все ${total} выхода сплиттера измерены`
										: needsFaultyChoice
											? 'Требуется вывод об исправности'
											: count === 0
												? 'Измерение не выполнено'
												: `Измерено ${count} из ${total} выходов сплиттера`}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{!canStartNextMeasurement && (selectedComponent || activeScenario) && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-md">
					<div className="flex items-start gap-3">
						<span className="text-2xl">⚠️</span>
						<div>
							<p className="font-semibold text-yellow-900 text-base">
								Требуется ввод результатов
							</p>
							<p className="text-sm text-yellow-800 mt-1">
								Перед выполнением следующего измерения необходимо внести
								результаты предыдущего измерения в таблицу на вкладке "Анализ
								результатов".
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
