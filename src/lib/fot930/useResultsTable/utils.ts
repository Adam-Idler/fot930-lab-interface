/**
 * Вспомогательные функции для работы с таблицами результатов
 */

import type { ComponentResultsTable } from '../../../types/fot930';
import { MIN_FIBER_LENGTH_FOR_KM_ATTENUATION } from './constants';

/**
 * Проверяет, завершена ли таблица полностью
 * (все измерения, среднее и км. затухание (если требуется) заполнены и валидны)
 */
export function checkIfTableCompleted(table: ComponentResultsTable): boolean {
	const requiresKmAttenuation =
		table.fiberLength >= MIN_FIBER_LENGTH_FOR_KM_ATTENUATION;

	return table.rows.every((row) => {
		// Все три измерения должны быть валидны
		const measurementsValid = row.measurements.every(
			(m) => m !== null && m.value !== null && m.status === 'valid'
		);

		// Среднее должно быть валидно
		const averageValid =
			row.average !== null &&
			row.average.value !== null &&
			row.average.status === 'valid';

		// Км. затухание должно быть валидно (если требуется)
		const kmAttenuationValid = requiresKmAttenuation
			? row.kilometricAttenuation !== null &&
				row.kilometricAttenuation.value !== null &&
				row.kilometricAttenuation.status === 'valid'
			: true; // Не требуется - считаем валидным

		return measurementsValid && averageValid && kmAttenuationValid;
	});
}

/**
 * Проверяет, можно ли перейти к следующему измерению
 * (все значения для текущего измерения введены и валидны)
 */
export function checkCanProceedToNextMeasurement(
	table: ComponentResultsTable
): boolean {
	const currentIndex = table.currentMeasurementNumber - 1;

	return table.rows.every((row) => {
		const entry = row.measurements[currentIndex];
		return entry !== null && entry.value !== null && entry.status === 'valid';
	});
}
