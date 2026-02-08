/**
 * Хук для управления состоянием интерактивных таблиц результатов измерений
 * Обрабатывает ввод студентов, валидацию и переходы между измерениями
 */

import { useCallback, useState } from 'react';
import type {
	ComponentResultsTable,
	FiberMeasurementResult,
	PassiveComponent,
	ResultsTableState,
	StudentMeasurementEntry,
	Wavelength,
	WavelengthTableRow
} from '../../../types/fot930';
import { MIN_FIBER_LENGTH_FOR_KM_ATTENUATION } from './constants';
import {
	checkCanProceedToNextMeasurement,
	checkIfTableCompleted
} from './utils';
import {
	validateAverage,
	validateKilometricAttenuation,
	validateMeasurement
} from './validation';

/**
 * Хук для управления интерактивными таблицами результатов
 */
export function useResultsTable() {
	const [state, setState] = useState<ResultsTableState>({
		tables: {},
		pendingInputComponentId: null
	});

	/**
	 * Создает новую таблицу результатов для компонента после первого измерения
	 */
	const createTableForComponent = useCallback(
		(component: PassiveComponent, wavelengths: Wavelength[]) => {
			setState((prev) => {
				// Проверяем, не существует ли уже таблица для этого компонента
				if (prev.tables[component.id]) {
					return prev;
				}

				// Создаем строки для каждой длины волны
				const rows: WavelengthTableRow[] = wavelengths.map((wavelength) => ({
					wavelength,
					measurements: [null, null, null],
					average: null,
					kilometricAttenuation: null
				}));

				// Создаем новую таблицу
				const newTable: ComponentResultsTable = {
					componentId: component.id,
					componentLabel: component.label,
					fiberLength: component.fiberLength,
					rows,
					currentMeasurementNumber: 1,
					isCompleted: false
				};

				return {
					...prev,
					tables: {
						...prev.tables,
						[component.id]: newTable
					},
					pendingInputComponentId: component.id
				};
			});
		},
		[]
	);

	/**
	 * Добавляет результат измерения из прибора в таблицу
	 * Сохраняет фактические значения для последующей валидации
	 */
	const addDeviceMeasurement = useCallback(
		(
			componentId: string,
			_measurementNumber: number,
			result: FiberMeasurementResult
		) => {
			setState((prev) => {
				const table = prev.tables[componentId];
				if (!table) {
					return prev;
				}

				// Проверяем текущее измерение на основе внутреннего состояния таблицы
				const currentIndex = table.currentMeasurementNumber - 1;

				// Проверяем, заполнено ли текущее измерение (нужно ли переходить к следующему)
				const currentMeasurementFilled = table.rows.every((row) => {
					const entry = row.measurements[currentIndex];
					return (
						entry !== null && entry.value !== null && entry.status === 'valid'
					);
				});

				// Если текущее измерение заполнено и мы не на последнем, переходим к следующему
				const shouldAdvance =
					currentMeasurementFilled && table.currentMeasurementNumber < 3;

				const targetMeasurementNumber = shouldAdvance
					? table.currentMeasurementNumber + 1
					: table.currentMeasurementNumber;

				// Проверяем, не добавлено ли уже это измерение (дедупликация)
				// Достаточно проверить, существует ли entry в целевом индексе
				const targetIndex = targetMeasurementNumber - 1;
				const measurementAlreadyAdded = table.rows.every((row) => {
					const entry = row.measurements[targetIndex];
					return entry !== null; // Если entry существует, измерение уже добавлено
				});

				// Если измерение уже добавлено, не добавляем повторно
				if (measurementAlreadyAdded) {
					return prev;
				}

				// Обновляем строки таблицы с фактическими значениями
				const updatedRows = table.rows.map((row) => {
					// Находим результат для этой длины волны
					const wavelengthResult = result.wavelengths.find(
						(wl) => wl.wavelength === row.wavelength
					);

					if (!wavelengthResult) {
						return row;
					}

					// Создаем entry с фактическим значением (пока пустой, студент должен ввести)
					const measurementEntry: StudentMeasurementEntry = {
						value: null,
						actualValue: wavelengthResult.average, // Среднее значение из прибора
						status: 'empty',
						errorMessage: undefined
					};

					// Обновляем соответствующий индекс измерения
					const updatedMeasurements = [...row.measurements];
					updatedMeasurements[targetMeasurementNumber - 1] = measurementEntry;

					return {
						...row,
						measurements: updatedMeasurements as [
							StudentMeasurementEntry | null,
							StudentMeasurementEntry | null,
							StudentMeasurementEntry | null
						]
					};
				});

				return {
					...prev,
					tables: {
						...prev.tables,
						[componentId]: {
							...table,
							rows: updatedRows,
							currentMeasurementNumber: targetMeasurementNumber
						}
					},
					pendingInputComponentId: componentId
				};
			});
		},
		[]
	);

	/**
	 * Вводит значение студентом и валидирует его
	 */
	const enterStudentValue = useCallback(
		(
			componentId: string,
			wavelength: Wavelength,
			field: 'measurement' | 'average' | 'kilometricAttenuation',
			measurementIndex: number | null,
			value: number
		): void => {
			setState((prev) => {
				const table = prev.tables[componentId];
				if (!table) {
					return prev;
				}

				// Находим строку для этой длины волны
				const rowIndex = table.rows.findIndex(
					(r) => r.wavelength === wavelength
				);
				if (rowIndex === -1) {
					return prev;
				}

				const row = table.rows[rowIndex];
				let updatedRow: WavelengthTableRow;

				// Валидация в зависимости от типа поля
				if (field === 'measurement') {
					if (
						measurementIndex === null ||
						measurementIndex < 0 ||
						measurementIndex > 2
					) {
						return prev;
					}

					const entry = row.measurements[measurementIndex];
					if (!entry) {
						return prev;
					}

					({ updatedRow } = validateMeasurement(row, measurementIndex, value));
				} else if (field === 'average') {
					({ updatedRow } = validateAverage(row, value));
				} else if (field === 'kilometricAttenuation') {
					({ updatedRow } = validateKilometricAttenuation(row, table, value));
				} else {
					return prev;
				}

				// Обновляем строку в таблице
				const updatedRows = [...table.rows];
				updatedRows[rowIndex] = updatedRow;

				// Проверяем, завершена ли таблица
				const isCompleted = checkIfTableCompleted({
					...table,
					rows: updatedRows
				});

				// Обновляем состояние таблицы
				const updatedTable: ComponentResultsTable = {
					...table,
					rows: updatedRows,
					isCompleted
				};

				// Проверяем, можно ли перейти к следующему измерению
				const canProceed = checkCanProceedToNextMeasurement(updatedTable);

				return {
					...prev,
					tables: {
						...prev.tables,
						[componentId]: updatedTable
					},
					// Убираем pending если текущее измерение завершено
					pendingInputComponentId: canProceed
						? null
						: prev.pendingInputComponentId
				};
			});
		},
		[]
	);

	/**
	 * Проверяет, доступна ли ячейка для ввода
	 */
	const isCellEditable = useCallback(
		(
			componentId: string,
			wavelength: Wavelength,
			field: 'measurement' | 'average' | 'kilometricAttenuation',
			measurementIndex: number | null
		): boolean => {
			const table = state.tables[componentId];
			if (!table) {
				return false;
			}

			const row = table.rows.find((r) => r.wavelength === wavelength);
			if (!row) {
				return false;
			}

			if (field === 'measurement') {
				if (
					measurementIndex === null ||
					measurementIndex < 0 ||
					measurementIndex > 2
				) {
					return false;
				}

				const entry = row.measurements[measurementIndex];

				// Если entry не существует, не можем редактировать
				if (entry === null) {
					return false;
				}

				// Если ячейка уже валидна, блокируем редактирование
				if (entry.status === 'valid') {
					return false;
				}

				// Если все три измерения уже введены и валидны, блокируем редактирование
				const allMeasurementsComplete = row.measurements.every(
					(m) => m !== null && m.value !== null && m.status === 'valid'
				);
				if (allMeasurementsComplete) {
					return false; // Все измерения завершены, переходим к среднему
				}

				// Можно редактировать только ячейку текущего измерения
				const isCurrent =
					measurementIndex === table.currentMeasurementNumber - 1;

				return isCurrent;
			}

			if (field === 'average') {
				// Если среднее уже введено и валидно, блокируем редактирование
				const averageAlreadyValid =
					row.average !== null &&
					row.average.value !== null &&
					row.average.status === 'valid';
				if (averageAlreadyValid) {
					return false; // Среднее уже введено, переходим к км. затуханию
				}

				// Среднее доступно только после всех трех измерений
				const allMeasurementsValid = row.measurements.every(
					(m) => m !== null && m.value !== null && m.status === 'valid'
				);
				return allMeasurementsValid;
			}

			if (field === 'kilometricAttenuation') {
				// Если км. затухание уже введено и валидно, блокируем редактирование
				const kmAttenuationAlreadyValid =
					row.kilometricAttenuation !== null &&
					row.kilometricAttenuation.value !== null &&
					row.kilometricAttenuation.status === 'valid';
				if (kmAttenuationAlreadyValid) {
					return false; // Км. затухание уже введено
				}

				// Км. затухание доступно только для длинных волокон и после ввода среднего
				const requiresKmAttenuation =
					table.fiberLength >= MIN_FIBER_LENGTH_FOR_KM_ATTENUATION;
				const averageValid =
					row.average !== null &&
					row.average.value !== null &&
					row.average.status === 'valid';
				return requiresKmAttenuation && averageValid;
			}

			return false;
		},
		[state.tables]
	);

	/**
	 * Проверяет, готов ли компонент к следующему измерению
	 * (все поля текущего измерения заполнены и валидны)
	 */
	const canProceedToNextMeasurement = useCallback(
		(componentId: string): boolean => {
			const table = state.tables[componentId];
			if (!table) {
				return false;
			}

			return checkCanProceedToNextMeasurement(table);
		},
		[state.tables]
	);

	return {
		state,
		createTableForComponent,
		addDeviceMeasurement,
		enterStudentValue,
		isCellEditable,
		canProceedToNextMeasurement
	};
}
