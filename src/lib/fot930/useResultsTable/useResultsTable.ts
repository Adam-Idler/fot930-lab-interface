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
		(
			component: PassiveComponent,
			wavelengths: Wavelength[],
			isActuallyFaulty: boolean
		) => {
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
					measurementsCompleted: false,
					isCompleted: false,
					isActuallyFaulty,
					studentFaultyChoice: null,
					faultyChoiceIsCorrect: null
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
				const targetIndex = targetMeasurementNumber - 1;
				const measurementAlreadyAdded = table.rows.every((row) => {
					const entry = row.measurements[targetIndex];
					return entry !== null;
				});

				if (measurementAlreadyAdded) {
					return prev;
				}

				// Обновляем строки таблицы с фактическими значениями
				const updatedRows = table.rows.map((row) => {
					const wavelengthResult = result.wavelengths.find(
						(wl) => wl.wavelength === row.wavelength
					);

					if (!wavelengthResult) {
						return row;
					}

					const measurementEntry: StudentMeasurementEntry = {
						value: null,
						actualValue: wavelengthResult.average,
						status: 'empty',
						errorMessage: undefined
					};

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

				const rowIndex = table.rows.findIndex(
					(r) => r.wavelength === wavelength
				);
				if (rowIndex === -1) {
					return prev;
				}

				const row = table.rows[rowIndex];
				let updatedRow: WavelengthTableRow;

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

				const updatedRows = [...table.rows];
				updatedRows[rowIndex] = updatedRow;

				// Проверяем, заполнены ли все числовые ячейки
				const measurementsCompleted = checkIfTableCompleted({
					...table,
					rows: updatedRows
				});

				// Полностью завершено только когда числа заполнены И сделан вывод об исправности
				const isCompleted =
					measurementsCompleted && table.studentFaultyChoice !== null;

				const updatedTable: ComponentResultsTable = {
					...table,
					rows: updatedRows,
					measurementsCompleted,
					isCompleted
				};

				const canProceed = checkCanProceedToNextMeasurement(updatedTable);

				return {
					...prev,
					tables: {
						...prev.tables,
						[componentId]: updatedTable
					},
					pendingInputComponentId: canProceed
						? null
						: prev.pendingInputComponentId
				};
			});
		},
		[]
	);

	/**
	 * Фиксирует выбор студента об исправности компонента.
	 * Доступно только после заполнения всех числовых ячеек.
	 * После первого выбора изменение заблокировано.
	 */
	const enterFaultyChoice = useCallback(
		(componentId: string, studentThinksFaulty: boolean): void => {
			setState((prev) => {
				const table = prev.tables[componentId];
				if (!table) {
					return prev;
				}

				// Блокируем: числа не заполнены или выбор уже зафиксирован
				if (!table.measurementsCompleted || table.studentFaultyChoice !== null) {
					return prev;
				}

				const faultyChoiceIsCorrect =
					studentThinksFaulty === table.isActuallyFaulty;

				return {
					...prev,
					tables: {
						...prev.tables,
						[componentId]: {
							...table,
							studentFaultyChoice: studentThinksFaulty,
							faultyChoiceIsCorrect,
							isCompleted: true
						}
					}
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

				if (entry === null) {
					return false;
				}

				if (entry.status === 'valid') {
					return false;
				}

				const allMeasurementsComplete = row.measurements.every(
					(m) => m !== null && m.value !== null && m.status === 'valid'
				);
				if (allMeasurementsComplete) {
					return false;
				}

				const isCurrent =
					measurementIndex === table.currentMeasurementNumber - 1;

				return isCurrent;
			}

			if (field === 'average') {
				const averageAlreadyValid =
					row.average !== null &&
					row.average.value !== null &&
					row.average.status === 'valid';
				if (averageAlreadyValid) {
					return false;
				}

				const allMeasurementsValid = row.measurements.every(
					(m) => m !== null && m.value !== null && m.status === 'valid'
				);
				return allMeasurementsValid;
			}

			if (field === 'kilometricAttenuation') {
				const kmAttenuationAlreadyValid =
					row.kilometricAttenuation !== null &&
					row.kilometricAttenuation.value !== null &&
					row.kilometricAttenuation.status === 'valid';
				if (kmAttenuationAlreadyValid) {
					return false;
				}

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
		enterFaultyChoice,
		isCellEditable,
		canProceedToNextMeasurement
	};
}
