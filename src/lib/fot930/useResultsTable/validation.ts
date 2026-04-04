/**
 * Функции валидации для разных типов полей таблицы результатов
 */

import type {
	ComponentResultsTable,
	StudentMeasurementEntry,
	WavelengthTableRow
} from '../../../types/fot930';
import { CALCULATION_TOLERANCE, MEASUREMENT_TOLERANCE } from './constants';

export interface ValidationResult {
	updatedRow: WavelengthTableRow;
	isValid: boolean;
	errorMessage?: string;
}

/**
 * Валидирует измерение (одно из трех)
 */
export function validateMeasurement(
	row: WavelengthTableRow,
	measurementIndex: number,
	value: number
): ValidationResult {
	const entry = row.measurements[measurementIndex];
	if (!entry) {
		throw new Error('Measurement entry not found');
	}

	// Валидация измерения
	const diff = Math.abs(value - entry.actualValue);
	const isValid = diff <= MEASUREMENT_TOLERANCE;

	const errorMessage = isValid ? undefined : 'Невереное значение измерения';

	// Обновляем entry
	const updatedMeasurements = [...row.measurements];
	updatedMeasurements[measurementIndex] = {
		...entry,
		value: value,
		status: isValid ? 'valid' : 'error',
		errorMessage
	};

	const updatedRow = {
		...row,
		measurements: updatedMeasurements as [
			StudentMeasurementEntry | null,
			StudentMeasurementEntry | null,
			StudentMeasurementEntry | null
		]
	};

	return { updatedRow, isValid, errorMessage };
}

/**
 * Валидирует среднее значение
 */
export function validateAverage(
	row: WavelengthTableRow,
	value: number
): ValidationResult {
	// Вычисляем фактическое среднее из введенных измерений
	const validMeasurements = row.measurements.filter(
		(m): m is StudentMeasurementEntry =>
			m !== null && m.value !== null && m.status === 'valid'
	);

	let calculatedAverage = 0;
	let isValid = false;
	let errorMessage: string | undefined;

	if (validMeasurements.length !== 3) {
		// Не все измерения введены
		errorMessage = 'Сначала заполните все три измерения';
		isValid = false;
	} else {
		calculatedAverage =
			validMeasurements.reduce((sum, m) => sum + (m.value ?? 0), 0) / 3;

		// Валидация среднего
		const diff = Math.abs(value - calculatedAverage);
		isValid = diff <= CALCULATION_TOLERANCE;

		if (!isValid) {
			errorMessage = `Неверное среднее значение`;
		}
	}

	// Обновляем среднее
	const updatedRow = {
		...row,
		average: {
			value: value,
			actualValue: calculatedAverage,
			status: isValid ? ('valid' as const) : ('error' as const),
			errorMessage: isValid ? undefined : errorMessage
		}
	};

	return { updatedRow, isValid, errorMessage };
}

/**
 * Валидирует километрическое затухание
 */
export function validateKilometricAttenuation(
	row: WavelengthTableRow,
	table: ComponentResultsTable,
	value: number
): ValidationResult {
	let isValid = false;
	let errorMessage: string | undefined;
	let updatedRow: WavelengthTableRow;

	// Проверяем, введено ли среднее
	if (
		!row.average ||
		row.average.value === null ||
		row.average.status !== 'valid'
	) {
		errorMessage = 'Сначала введите среднее значение';
		isValid = false;

		updatedRow = {
			...row,
			kilometricAttenuation: {
				value: value,
				actualValue: 0,
				status: 'error',
				errorMessage: errorMessage
			}
		};
	} else {
		// Вычисляем фактическое километрическое затухание
		const fiberLengthKm = table.fiberLength / 1000;
		const calculatedKmAttenuation = row.average.value / fiberLengthKm;

		// Валидация
		const diff = Math.abs(value - calculatedKmAttenuation);
		isValid = diff <= CALCULATION_TOLERANCE;

		if (!isValid) {
			errorMessage = `Неверное километрическое затухание`;
		}

		updatedRow = {
			...row,
			kilometricAttenuation: {
				value: value,
				actualValue: calculatedKmAttenuation,
				status: isValid ? 'valid' : 'error',
				errorMessage: isValid ? undefined : errorMessage
			}
		};
	}

	return { updatedRow, isValid, errorMessage };
}
