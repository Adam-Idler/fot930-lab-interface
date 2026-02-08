/**
 * Интерактивная таблица результатов измерений для одного компонента
 * Позволяет студенту вводить значения и валидирует их
 */

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
}

export function InteractiveMeasurementTable({
	table,
	onValueChange,
	isCellEditable
}: InteractiveMeasurementTableProps) {
	// Проверяем, требуется ли километрическое затухание
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
								{/* Длина волны */}
								<td className="px-4 py-3 font-medium whitespace-nowrap">
									{row.wavelength} нм
								</td>

								{/* Три измерения */}
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

								{/* Среднее */}
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

								{/* Километрическое затухание (если требуется) */}
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
		</div>
	);
}
