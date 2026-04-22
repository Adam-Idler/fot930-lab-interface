/**
 * Этап анализа результатов с интерактивными таблицами
 */

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useEffect, useRef, useState } from 'react';
import {
	computeExpectedLineLoss,
	computeExpectedLineLossForComponents,
	getFormulaLatex,
	getFormulaLatexForComponents
} from '../../../../lib/fot930/measurementEngine';
import {
	getSplitterOutputCount,
	isSplitterType
} from '../../../../lib/fot930/splitter';
import type {
	PassiveComponent,
	ResultsTableState,
	Wavelength
} from '../../../../types/fot930';
import { InteractiveMeasurementTable } from './InteractiveMeasurementTable';

function InlineMath({ tex }: { tex: string }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		try {
			katex.render(tex, ref.current, { throwOnError: false });
		} catch {
			if (ref.current) ref.current.textContent = tex;
		}
	}, [tex]);

	return <span ref={ref} />;
}

interface ResultsStageProps {
	/** Состояние таблиц результатов */
	resultsTableState: ResultsTableState;

	/** Выбранный компонент */
	selectedComponent: PassiveComponent;

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

	/** Callback при выборе студентом варианта исправности компонента */
	onFaultyChoiceChange: (
		componentId: string,
		studentThinksFaulty: boolean
	) => void;

	/** Callback при изменении строки расчёта потерь по формуле */
	onSaveFormulaRow: (
		componentId: string,
		wavelength: number,
		value: string,
		correct: boolean
	) => void;

	/** Цепочка компонентов для комплексного сценария (если применимо) */
	chainComponents?: PassiveComponent[];

	/** Автоматически заполнить текущий уровень таблицы для указанного компонента */
	onAutoFill: (componentId: string) => void;
}

export function ResultsStage({
	resultsTableState,
	selectedComponent,
	chainComponents,
	onValueChange,
	isCellEditable,
	onFaultyChoiceChange,
	onSaveFormulaRow,
	onAutoFill
}: ResultsStageProps) {
	const { tables, pendingInputComponentId } = resultsTableState;

	const isSplitter = isSplitterType(selectedComponent.type);
	const splitterOutputCount = isSplitter
		? getSplitterOutputCount(selectedComponent.type)
		: 0;

	const pendingTable = pendingInputComponentId
		? tables[pendingInputComponentId]
		: null;

	// Для обычных компонентов — одна таблица, для сплиттеров — по одной на каждый выход
	const tablesToShow = isSplitter
		? Array.from({ length: splitterOutputCount }, (_, i) => ({
				key: `${selectedComponent.id}_output_${i + 1}`,
				outputNum: i + 1,
				table: tables[`${selectedComponent.id}_output_${i + 1}`] ?? null
			}))
		: [
				{
					key: selectedComponent.id,
					outputNum: null,
					table: tables[selectedComponent.id] ?? null
				}
			];

	// При монтировании сразу сворачивает уже завершённые таблицы сплиттеров
	const [collapsedTables, setCollapsedTables] = useState<Set<string>>(
		() =>
			new Set(
				isSplitter
					? tablesToShow.filter((t) => t.table?.isCompleted).map((t) => t.key)
					: []
			)
	);

	const toggleCollapsed = (key: string) => {
		setCollapsedTables((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	};

	const hasAnyTable = tablesToShow.some((t) => t.table !== null);

	// Для комплексного сценария используем формулу и потери по всей цепи
	const formulaLatex = chainComponents
		? getFormulaLatexForComponents(chainComponents)
		: getFormulaLatex(selectedComponent);

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 5. Ведение таблицы результатов и анализ
				</h2>
				<p className="text-gray-600 text-sm">
					Внесите результаты измерений из прибора в таблицу. После каждого
					измерения записывайте средние значения потерь для каждой длины волны.
				</p>
			</div>

			{pendingTable && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-md animate-pulse">
					<div className="flex items-start gap-3">
						<span className="text-3xl">⚠️</span>
						<div>
							<p className="font-semibold text-yellow-900 text-lg">
								Требуется ввод результатов
							</p>
							<p className="text-sm text-yellow-800 mt-1">
								{pendingTable.componentLabel.startsWith(
									'Комбинация элементов'
								) ? (
									'Внесите средние значения из прибора для комплексной схемы в таблицу ниже.'
								) : (
									<>
										Внесите средние значения из прибора для компонента "
										<strong>{pendingTable.componentLabel}</strong>" в таблицу
										ниже.
									</>
								)}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Таблицы результатов */}
			{hasAnyTable ? (
				<div className="space-y-4">
					{tablesToShow.map(({ key, outputNum, table }) => {
						// Правильные значения для каждой длины волны из строк таблицы
						const correctValues = (table?.rows ?? []).map((row) => ({
							wavelength: row.wavelength,
							value: chainComponents
								? computeExpectedLineLossForComponents(
										chainComponents,
										row.wavelength as Wavelength
									)
								: computeExpectedLineLoss(
										selectedComponent,
										row.wavelength as Wavelength
									)
						}));

						return (
							<div key={key}>
								{isSplitter && (
									<div className="flex items-center gap-2 mb-2">
										{table?.isCompleted ? (
											<button
												type="button"
												onClick={() => toggleCollapsed(key)}
												className="text-sm font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
											>
												Выход {outputNum} из {splitterOutputCount} ✓
												<span className="ml-1 text-xs">
													{collapsedTables.has(key) ? '▲' : '▼'}
												</span>
											</button>
										) : (
											<span className="text-sm font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
												Выход {outputNum} из {splitterOutputCount}
											</span>
										)}
									</div>
								)}

								{!collapsedTables.has(key) &&
									(table ? (
										<InteractiveMeasurementTable
											key={table.componentId}
											table={table}
											formulaLatex={formulaLatex}
											correctValues={correctValues}
											onSaveFormulaRow={(wavelength, value, correct) =>
												onSaveFormulaRow(
													table.componentId,
													wavelength,
													value,
													correct
												)
											}
											onValueChange={(
												wavelength,
												field,
												measurementIndex,
												value
											) =>
												onValueChange(
													table.componentId,
													wavelength,
													field,
													measurementIndex,
													value
												)
											}
											isCellEditable={(wavelength, field, measurementIndex) =>
												isCellEditable(
													table.componentId,
													wavelength,
													field,
													measurementIndex
												)
											}
											onFaultyChoiceChange={(studentThinksFaulty) =>
												onFaultyChoiceChange(
													table.componentId,
													studentThinksFaulty
												)
											}
											onAutoFill={() => onAutoFill(table.componentId)}
										/>
									) : (
										<div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500">
											Измерение для этого выхода ещё не выполнено
										</div>
									))}
							</div>
						);
					})}
				</div>
			) : (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
					<p className="text-blue-900 font-medium text-lg mb-2">
						Нет выполненных измерений
					</p>
					<p className="text-blue-800 text-sm">
						Перейдите к этапу "Сборка схемы", выберите компонент и выполните
						измерение.
					</p>
				</div>
			)}

			{hasAnyTable && (
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<h3 className="font-semibold text-gray-900 mb-2">ℹ️ Информация</h3>
					<ul className="text-sm text-gray-700 space-y-2">
						<li>
							• <strong>Измерения:</strong> Значение должно точно совпадать с
							прибором
						</li>
						<li className="flex items-baseline gap-2 flex-wrap">
							• <strong>Среднее:</strong>
							<InlineMath tex="\bar{A} = \dfrac{A_1 + A_2 + A_3}{3}" />
							<span className="text-gray-500">(погрешность ±0.01 дБ)</span>
						</li>
						<li className="flex items-baseline gap-2 flex-wrap">
							• <strong>Км. затухание:</strong>
							<InlineMath tex="a_\text{км} = \dfrac{\bar{A}}{L\,[\text{км}]}" />
							<span className="text-gray-500">только для волокон ≥1 км</span>
						</li>
						<li>
							• <strong>Расчёт потерь:</strong> После заполнения таблицы
							рассчитайте ожидаемые суммарные потери линии по формуле, используя
							максимально допустимые значения из теоретической части.
						</li>
						<li className="flex items-center gap-1.5">
							•{' '}
							<span className="inline-block w-3 h-3 bg-green-50 border border-green-500 rounded shrink-0" />
							Зеленый фон — значение корректно
						</li>
						<li className="flex items-center gap-1.5">
							•{' '}
							<span className="inline-block w-3 h-3 bg-red-50 border border-red-500 rounded shrink-0" />
							Красный фон — ошибка
						</li>
						<li className="flex items-center gap-1.5">
							•{' '}
							<span className="inline-block w-3 h-3 bg-yellow-50 border border-yellow-500 rounded shrink-0" />
							Желтый фон — требуется ввод
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
