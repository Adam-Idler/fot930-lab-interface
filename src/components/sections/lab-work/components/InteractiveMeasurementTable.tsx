/**
 * Интерактивная таблица результатов измерений для одного компонента
 * Позволяет студенту вводить значения и валидирует их
 */

import clsx from 'clsx';
import type {
	ComponentResultsTable,
	Wavelength
} from '../../../../types/fot930';
import { EditableCell } from './EditableCell';

interface InteractiveMeasurementTableProps {
	/** Таблица результатов для компонента */
	table: ComponentResultsTable;

	/** Callback при изменении значения */
	onValueChange: (
		wavelength: Wavelength,
		field: 'measurement' | 'average' | 'kilometricAttenuation',
		measurementIndex: number | null,
		value: number
	) => void;

	/** Функция проверки доступности ячейки */
	isCellEditable: (
		wavelength: Wavelength,
		field: 'measurement' | 'average' | 'kilometricAttenuation',
		measurementIndex: number | null
	) => boolean;

	/** Callback при выборе студентом варианта исправности */
	onFaultyChoiceChange: (studentThinksFaulty: boolean) => void;
}

export function InteractiveMeasurementTable({
	table,
	onValueChange,
	isCellEditable,
	onFaultyChoiceChange
}: InteractiveMeasurementTableProps) {
	const requiresKilometricAttenuation = table.fiberLength >= 500;

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			{/* Заголовок таблицы */}
			<div className="bg-blue-600 text-white px-4 py-3">
				<h3 className="font-semibold text-lg">{table.componentLabel}</h3>
				<div className="flex items-center justify-between mt-1">
					<p className="text-sm opacity-90">
						Измерение {table.currentMeasurementNumber} из 3
					</p>
					{table.isCompleted && (
						<span className="text-sm bg-green-500 px-2 py-1 rounded">
							✓ Завершено
						</span>
					)}
				</div>
			</div>

			{/* Таблица */}
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left font-semibold border-b">
								Длина волны
							</th>
							<th className="px-4 py-3 text-center font-semibold border-b">
								Изм. 1 (dB)
							</th>
							<th className="px-4 py-3 text-center font-semibold border-b">
								Изм. 2 (dB)
							</th>
							<th className="px-4 py-3 text-center font-semibold border-b">
								Изм. 3 (dB)
							</th>
							<th className="px-4 py-3 text-center font-semibold border-b bg-blue-50">
								Среднее (dB)
							</th>
							{requiresKilometricAttenuation && (
								<th className="px-4 py-3 text-center font-semibold border-b bg-purple-50">
									Км. затухание (dB/км)
								</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{table.rows.map((row) => (
							<tr key={row.wavelength} className="hover:bg-gray-50">
								<td className="px-4 py-3 font-medium whitespace-nowrap">
									{row.wavelength} нм
								</td>

								{row.measurements.map((entry, idx) => (
									<EditableCell
										key={`${idx}-${row.wavelength}`}
										value={entry?.value ?? null}
										actualValue={entry?.actualValue ?? 0}
										status={entry?.status ?? 'empty'}
										isEditable={isCellEditable(
											row.wavelength,
											'measurement',
											idx
										)}
										onValueChange={(value) =>
											onValueChange(row.wavelength, 'measurement', idx, value)
										}
										errorMessage={entry?.errorMessage}
									/>
								))}

								<EditableCell
									value={row.average?.value ?? null}
									actualValue={row.average?.actualValue ?? 0}
									status={row.average?.status ?? 'empty'}
									isEditable={isCellEditable(row.wavelength, 'average', null)}
									onValueChange={(value) =>
										onValueChange(row.wavelength, 'average', null, value)
									}
									errorMessage={row.average?.errorMessage}
								/>

								{requiresKilometricAttenuation && (
									<EditableCell
										value={row.kilometricAttenuation?.value ?? null}
										actualValue={row.kilometricAttenuation?.actualValue ?? 0}
										status={row.kilometricAttenuation?.status ?? 'empty'}
										isEditable={isCellEditable(
											row.wavelength,
											'kilometricAttenuation',
											null
										)}
										onValueChange={(value) =>
											onValueChange(
												row.wavelength,
												'kilometricAttenuation',
												null,
												value
											)
										}
										errorMessage={row.kilometricAttenuation?.errorMessage}
									/>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Вывод об исправности компонента */}
			<div className="px-4 py-3 border-t bg-gray-50">
				<div className="flex flex-wrap items-center gap-3">
					<span
						className={clsx(
							'text-sm font-semibold',
							table.measurementsCompleted ? 'text-gray-700' : 'text-gray-400'
						)}
					>
						Исправен ли компонент?
					</span>
					<button
						type="button"
						disabled={
							!table.measurementsCompleted || table.studentFaultyChoice !== null
						}
						onClick={() => onFaultyChoiceChange(false)}
						className={clsx(
							'px-4 py-1.5 text-sm rounded-md border-2 font-medium transition-colors',
							!table.measurementsCompleted ||
								(table.studentFaultyChoice !== null &&
									table.studentFaultyChoice !== false)
								? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
								: table.studentFaultyChoice === false
									? table.faultyChoiceIsCorrect === true
										? 'bg-green-100 border-green-500 text-green-800'
										: 'bg-red-100 border-red-500 text-red-800'
									: 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
						)}
					>
						Да, исправен
					</button>
					<button
						type="button"
						disabled={
							!table.measurementsCompleted || table.studentFaultyChoice !== null
						}
						onClick={() => onFaultyChoiceChange(true)}
						className={clsx(
							'px-4 py-1.5 text-sm rounded-md border-2 font-medium transition-colors',
							!table.measurementsCompleted ||
								(table.studentFaultyChoice !== null &&
									table.studentFaultyChoice !== true)
								? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
								: table.studentFaultyChoice === true
									? table.faultyChoiceIsCorrect === true
										? 'bg-green-100 border-green-500 text-green-800'
										: 'bg-red-100 border-red-500 text-red-800'
									: 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
						)}
					>
						Нет, неисправен
					</button>
					{!table.measurementsCompleted && (
						<span className="text-xs text-gray-400 italic">
							Доступно после заполнения таблицы
						</span>
					)}
					{table.faultyChoiceIsCorrect !== null && (
						<span
							className={clsx(
								'text-sm font-semibold',
								table.faultyChoiceIsCorrect ? 'text-green-700' : 'text-red-700'
							)}
						>
							{table.faultyChoiceIsCorrect ? '✓ Правильно!' : '✗ Неверно'}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
