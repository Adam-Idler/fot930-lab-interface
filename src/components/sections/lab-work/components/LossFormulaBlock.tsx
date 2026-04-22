/**
 * Блок расчёта ожидаемых суммарных потерь линии.
 * Отображает формулу (KaTeX) и принимает ответ студента по каждой длине волны.
 * Разблокирует вывод об исправности только после верного расчёта для всех λ.
 * Введённые значения сохраняются в родительском состоянии (initialInputs).
 */

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useEffect, useRef, useState } from 'react';
import { SHOW_DEV_BUTTONS } from '../../../../lib/devFlags';

export interface WavelengthCorrectValue {
	wavelength: number;
	value: number;
}

export interface FormulaRowState {
	value: string;
	correct: boolean;
}

interface LossFormulaBlockProps {
	/** Символическая LaTeX-строка формулы */
	formulaLatex: string;
	/** Правильные значения по длинам волн */
	correctValues: WavelengthCorrectValue[];
	/**
	 * Ранее сохранённые ответы студента (для восстановления при возврате).
	 * Ключ — длина волны (нм).
	 */
	initialInputs?: Record<number, FormulaRowState>;
	/**
	 * Вызывается при каждой проверке строки (верно или нет).
	 * Родитель сохраняет это в персистентном состоянии.
	 */
	onSaveRow: (wavelength: number, value: string, correct: boolean) => void;
}

const TOLERANCE = 0.05;

export function LossFormulaBlock({
	formulaLatex,
	correctValues,
	initialInputs = {},
	onSaveRow
}: LossFormulaBlockProps) {
	const formulaRef = useRef<HTMLDivElement>(null);

	// Локальное состояние: введённые строки и результаты проверки.
	// Инициализируется из initialInputs, чтобы восстановить состояние при возврате.
	const [inputs, setInputs] = useState<Record<number, string>>(() =>
		Object.fromEntries(
			correctValues.map((cv) => [
				cv.wavelength,
				initialInputs[cv.wavelength]?.value ?? ''
			])
		)
	);
	const [rowsCorrect, setRowsCorrect] = useState<Record<number, boolean>>(() =>
		Object.fromEntries(
			correctValues.map((cv) => [
				cv.wavelength,
				initialInputs[cv.wavelength]?.correct ?? false
			])
		)
	);
	const [rowsChecked, setRowsChecked] = useState<Record<number, boolean>>(() =>
		Object.fromEntries(
			correctValues.map((cv) => [cv.wavelength, cv.wavelength in initialInputs])
		)
	);

	// Все строки верны — блок завершён
	const allDone = correctValues.every(
		(cv) => rowsCorrect[cv.wavelength] === true
	);

	// Рендер формулы через KaTeX
	useEffect(() => {
		if (!formulaRef.current) return;
		try {
			katex.render(formulaLatex, formulaRef.current, {
				throwOnError: false,
				displayMode: true
			});
		} catch {
			if (formulaRef.current) formulaRef.current.textContent = formulaLatex;
		}
	}, [formulaLatex]);

	const checkRow = (wavelength: number) => {
		const cv = correctValues.find((c) => c.wavelength === wavelength);
		if (!cv) return;

		const raw = inputs[wavelength] ?? '';
		const parsed = Number.parseFloat(raw.replace(',', '.'));
		const correct =
			!Number.isNaN(parsed) && Math.abs(parsed - cv.value) <= TOLERANCE;

		setRowsCorrect((prev) => ({ ...prev, [wavelength]: correct }));
		setRowsChecked((prev) => ({ ...prev, [wavelength]: true }));
		onSaveRow(wavelength, raw, correct);
	};

	const handleKeyDown =
		(wavelength: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') checkRow(wavelength);
		};

	return (
		<div className="border border-gray-200 rounded-lg bg-gray-50 p-4 space-y-3">
			{/* Заголовок */}
			<div className="flex items-center gap-2">
				<span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
					Расчёт ожидаемых потерь линии
				</span>
				{allDone && (
					<span className="ml-auto text-sm font-semibold text-green-700">
						✓ Расчёт выполнен верно
					</span>
				)}
			</div>

			{/* Формула (только символьная запись) */}
			<div className="flex justify-center py-2 px-4 rounded bg-white border border-gray-200 overflow-x-auto">
				<div ref={formulaRef} />
			</div>

			{/* Подсказка */}
			<p className="text-xs text-gray-500 leading-relaxed">
				Для расчёта используйте максимально допустимые значения потерь
				компонентов из таблиц теоретической части. Введите значение для каждой
				длины волны (допустимая погрешность ±0.01 дБ).
			</p>

			{/* Строки по длинам волн */}
			<div className="flex flex-wrap justify-between gap-4">
				{correctValues.map((cv) => {
					const isCorrect = rowsCorrect[cv.wavelength] === true;
					const wasChecked = rowsChecked[cv.wavelength] === true;
					const isError = wasChecked && !isCorrect;

					return (
						<div
							key={cv.wavelength}
							className="flex flex-col flex-wrap items-center gap-2"
						>
							<div className="flex items-center gap-2">
								{/* Метка длины волны */}
								<span className="text-sm font-medium text-gray-700 w-16 shrink-0">
									{cv.wavelength} нм:
								</span>

								{/* Поле ввода — read-only после верного ответа, значение сохраняется */}
								<input
									type="number"
									step="0.01"
									min="0"
									value={inputs[cv.wavelength] ?? ''}
									readOnly={isCorrect}
									onChange={(e) => {
										if (isCorrect) return;
										setInputs((prev) => ({
											...prev,
											[cv.wavelength]: e.target.value
										}));
										// Сбрасываем ошибку при новом вводе
										if (isError) {
											setRowsChecked((prev) => ({
												...prev,
												[cv.wavelength]: false
											}));
										}
									}}
									onKeyDown={handleKeyDown(cv.wavelength)}
									className={[
										'w-28 px-3 py-1.5 text-sm border rounded-md outline-none transition-colors',
										isCorrect
											? 'border-green-400 bg-green-50 text-green-800 cursor-default'
											: isError
												? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400'
												: 'border-gray-300 bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-300'
									].join(' ')}
									placeholder="0.00"
								/>

								<span className="text-xs text-gray-500">дБ</span>

								{/* Кнопка проверки — скрыта после верного ответа */}
								{!isCorrect && (
									<button
										type="button"
										onClick={() => checkRow(cv.wavelength)}
										className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
									>
										Проверить
									</button>
								)}

								{isCorrect && (
									<span className="text-sm font-semibold text-green-700">
										✓
									</span>
								)}
								{SHOW_DEV_BUTTONS && (
									<span className="text-xs text-gray-300 ml-1 select-none">
										({cv.value.toFixed(2)} дБ)
									</span>
								)}
							</div>
							{isError && (
								<span className="text-sm text-red-600">
									✗ Неверно. Проверьте расчёт.
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
