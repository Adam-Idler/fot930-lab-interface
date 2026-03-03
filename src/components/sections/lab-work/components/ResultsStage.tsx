/**
 * Этап анализа результатов с интерактивными таблицами
 * Позволяет студенту вводить результаты измерений и валидирует их
 */

import type { ResultsTableState, Wavelength } from '../../../../types/fot930';
import { InteractiveMeasurementTable } from './InteractiveMeasurementTable';

interface ResultsStageProps {
	/** Состояние таблиц результатов */
	resultsTableState: ResultsTableState;

	/** ID текущего выбранного компонента */
	selectedComponentId: string;

	/** Callback при изменении значения */
	onValueChange: (
		componentId: string,
		wavelength: Wavelength,
		field: 'measurement' | 'average' | 'kilometricAttenuation',
		measurementIndex: number | null,
		value: number
	) => void;

	/** Функция проверки доступности ячейки */
	isCellEditable: (
		componentId: string,
		wavelength: Wavelength,
		field: 'measurement' | 'average' | 'kilometricAttenuation',
		measurementIndex: number | null
	) => boolean;
}

export function ResultsStage({
	resultsTableState,
	selectedComponentId,
	onValueChange,
	isCellEditable
}: ResultsStageProps) {
	const { tables, pendingInputComponentId } = resultsTableState;

	// Показываем только таблицу для текущего выбранного компонента
	const currentTable = tables[selectedComponentId];
	const pendingTable = pendingInputComponentId
		? tables[pendingInputComponentId]
		: null;

	return (
		<div className="space-y-6">
			{/* Заголовок */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 5. Ведение таблицы результатов и анализ
				</h2>
				<p className="text-gray-600 text-sm">
					Внесите результаты измерений из прибора в таблицу. После каждого
					измерения записывайте средние значения потерь для каждой длины волны.
				</p>
			</div>

			{/* Уведомление о необходимости ввода */}
			{pendingTable && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-md animate-pulse">
					<div className="flex items-start gap-3">
						<span className="text-3xl">⚠️</span>
						<div>
							<p className="font-semibold text-yellow-900 text-lg">
								Требуется ввод результатов
							</p>
							<p className="text-sm text-yellow-800 mt-1">
								Внесите средние значения из прибора для компонента "
								<strong>{pendingTable.componentLabel}</strong>" в таблицу ниже.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Таблица результатов текущего компонента */}
			{currentTable && (
				<InteractiveMeasurementTable
					key={currentTable.componentId}
					table={currentTable}
					onValueChange={(wavelength, field, measurementIndex, value) =>
						onValueChange(
							currentTable.componentId,
							wavelength,
							field,
							measurementIndex,
							value
						)
					}
					isCellEditable={(wavelength, field, measurementIndex) =>
						isCellEditable(
							currentTable.componentId,
							wavelength,
							field,
							measurementIndex
						)
					}
				/>
			)}

			{/* Пустое состояние */}
			{!currentTable && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
					<div className="text-blue-600 text-4xl mb-3">📊</div>
					<p className="text-blue-900 font-medium text-lg mb-2">
						Нет выполненных измерений
					</p>
					<p className="text-blue-800 text-sm">
						Перейдите к этапу "Сборка схемы", выберите компонент и выполните
						измерение.
					</p>
				</div>
			)}

			{/* Информация */}
			{currentTable && (
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<h3 className="font-semibold text-gray-900 mb-2">
						ℹ️ Информация
					</h3>
					<ul className="text-sm marker:• text-gray-700 space-y-1">
						<li>
							• <strong>Измерения:</strong> Значение должно точно совпадать с
							прибором
						</li>
						<li>
							• <strong>Среднее:</strong> Рассчитывается как (Изм.1 + Изм.2 +
							Изм.3) / 3, допустимая погрешность ±0.01 dB
						</li>
						<li>
							• <strong>Км. затухание:</strong> Рассчитывается как Среднее /
							(Длина в км), доступно только для волокон ≥500 м
						</li>
						<li>
							•{' '}
							<span className="inline-block w-3 h-3 bg-green-50 border border-green-500 rounded mr-1" />
							Зеленый фон - значение корректно
						</li>
						<li>
							•{' '}
							<span className="inline-block w-3 h-3 bg-red-50 border border-red-500 rounded mr-1" />
							Красный фон - ошибка
						</li>
						<li>
							•{' '}
							<span className="inline-block w-3 h-3 bg-yellow-50 border border-yellow-500 rounded mr-1" />
							Желтый фон - требуется ввод
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
