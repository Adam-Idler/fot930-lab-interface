/**
 * Компонент для отображения таблицы результатов измерений
 */

import type { CompletedMeasurement } from '../../types/fot930';

interface MeasurementTableProps {
	measurements: CompletedMeasurement[];
	componentId: string;
	componentLabel: string;
}

export function MeasurementTable({
	measurements,
	componentId,
	componentLabel
}: MeasurementTableProps) {
	// Фильтруем измерения для конкретного компонента
	const componentMeasurements = measurements.filter(
		(m) => m.componentId === componentId
	);

	if (componentMeasurements.length === 0) {
		return null;
	}

	// Группируем по длине волны и стороне
	const grouped = groupMeasurements(componentMeasurements);

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="bg-blue-600 text-white px-4 py-3">
				<h3 className="font-semibold">{componentLabel}</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left font-semibold">
								Длина волны (нм)
							</th>
							<th className="px-4 py-3 text-center font-semibold">
								Измерение 1
							</th>
							<th className="px-4 py-3 text-center font-semibold">
								Измерение 2
							</th>
							<th className="px-4 py-3 text-center font-semibold">
								Измерение 3
							</th>
							<th className="px-4 py-3 text-center font-semibold bg-blue-50">
								Среднее
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{Object.entries(grouped).map(([wavelength, data]) => {
							const average = calculateAverage(data.measurements);

							return (
								<tr key={wavelength} className="hover:bg-gray-50">
									<td className="px-4 py-3">{wavelength}</td>
									<td className="px-4 py-3 text-center font-mono">
										{formatValue(data.measurements[0])}
									</td>
									<td className="px-4 py-3 text-center font-mono">
										{formatValue(data.measurements[1])}
									</td>
									<td className="px-4 py-3 text-center font-mono">
										{formatValue(data.measurements[2])}
									</td>
									<td className="px-4 py-3 text-center font-mono font-semibold bg-blue-50">
										{average !== null
											? `${average.toFixed(2)} ${data.unit}`
											: '—'}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

/**
 * Группирует измерения по длине волны и стороне
 */
function groupMeasurements(measurements: CompletedMeasurement[]) {
	const grouped: Record<
		string,
		{
			measurements: (CompletedMeasurement | null)[];
			unit: string;
		}
	> = {};

	for (const measurement of measurements) {
		const key = measurement.wavelength;

		if (!grouped[key]) {
			grouped[key] = {
				measurements: [null, null, null],
				unit: measurement.result.unit
			};
		}

		const attemptIndex = measurement.attemptNumber - 1;
		if (attemptIndex >= 0 && attemptIndex < 3) {
			grouped[key].measurements[attemptIndex] = measurement;
		}
	}

	return grouped;
}

/**
 * Форматирует значение измерения
 */
function formatValue(measurement: CompletedMeasurement | null): string {
	if (!measurement) return '—';
	return `${measurement.result.value.toFixed(2)} ${measurement.result.unit}`;
}

/**
 * Вычисляет среднее значение
 */
function calculateAverage(
	measurements: (CompletedMeasurement | null)[]
): number | null {
	const values = measurements
		.filter((m): m is CompletedMeasurement => m !== null)
		.map((m) => m.result.value);

	if (values.length === 0) return null;

	const sum = values.reduce((acc, val) => acc + val, 0);
	return sum / values.length;
}
