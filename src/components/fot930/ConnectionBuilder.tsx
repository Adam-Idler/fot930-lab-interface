/**
 * Компонент для сборки схемы подключения
 * Позволяет студенту составить правильную последовательность элементов
 */

import { useEffect, useState } from 'react';
import { validateConnectionScheme } from '../../lib/fot930/measurementEngine';
import type { ConnectionElement, ConnectionScheme } from '../../types/fot930';
import {
	DraggableElement,
	DropZone,
	ElementCard,
	EmptyDropZone
} from './connection-builder';

interface ConnectionBuilderProps {
	/** Схема подключения */
	scheme: ConnectionScheme;
	/** Callback при изменении схемы */
	onChange: (scheme: ConnectionScheme) => void;
	/** Доступные элементы для сборки */
	availableElements: ConnectionElement[];
	/** Измеренные выходы для элементов схемы: ключ — ID элемента, значение — список измеренных выходов */
	elementMeasuredOutputs?: Record<string, number[]>;
	/** Callback при подтверждении неправильно собранной схемы */
	onSchemeError?: () => void;
}

export function ConnectionBuilder({
	scheme,
	onChange,
	availableElements,
	elementMeasuredOutputs = {},
	onSchemeError
}: ConnectionBuilderProps) {
	const [draggedElement, setDraggedElement] =
		useState<ConnectionElement | null>(null);

	// Состояние для временной схемы (до подтверждения)
	const [draftScheme, setDraftScheme] = useState<ConnectionScheme>(scheme);

	const draftSchemeLength = draftScheme.sequence.length;

	// Синхронизируем draftScheme с входящей схемой
	useEffect(() => {
		setDraftScheme(scheme);
	}, [scheme]);

	// Проверяем, есть ли несохраненные изменения
	const hasChanges =
		JSON.stringify(scheme.sequence) !== JSON.stringify(draftScheme.sequence);

	// Фильтруем доступные элементы - исключаем уже добавленные в черновик схемы
	const usedElementIds = new Set(draftScheme.sequence.map((el) => el.id));
	const filteredAvailableElements = availableElements.filter(
		(element) => !usedElementIds.has(element.id)
	);

	// Валидация применяется только к основной схеме
	const validation = validateConnectionScheme(scheme);

	const handleDragStart = (element: ConnectionElement) => {
		setDraggedElement(element);
	};

	const handleDragEnd = () => {
		setDraggedElement(null);
	};

	const handleDrop = (targetIndex: number) => {
		if (!draggedElement) return;

		const newSequence = [...draftScheme.sequence];

		// Находим, был ли элемент уже в схеме
		const existingIndex = newSequence.findIndex(
			(el) => el.id === draggedElement.id
		);

		if (existingIndex !== -1) {
			// Перемещаем существующий элемент
			newSequence.splice(existingIndex, 1);
		}

		newSequence.splice(targetIndex, 0, draggedElement);

		setDraftScheme({
			...draftScheme,
			sequence: newSequence
		});
	};

	const handleAdd = (element: ConnectionElement) => {
		const newSequence = [...draftScheme.sequence, element];
		setDraftScheme({ ...draftScheme, sequence: newSequence });
	};

	const handleRemove = (index: number) => {
		const newSequence = draftScheme.sequence.filter((_, i) => i !== index);
		setDraftScheme({
			...draftScheme,
			sequence: newSequence
		});
	};

	const handleSplitterOutputChange = (elementIndex: number, output: number) => {
		const newSequence = draftScheme.sequence.map((el, i) =>
			i === elementIndex ? { ...el, splitterOutput: output } : el
		);
		const newDraft = { ...draftScheme, sequence: newSequence };
		setDraftScheme(newDraft);
		onChange(newDraft);
	};

	const handleReset = () => {
		setDraftScheme({
			...draftScheme,
			sequence: []
		});
	};

	const handleConfirm = () => {
		// Штрафуем только если схема полностью собрана (все элементы на месте),
		// но порядок неверный. Пустой или частичный черновик ошибкой не считается.
		const isFullyAssembled =
			draftScheme.sequence.length === draftScheme.correctSequence.length;
		if (isFullyAssembled) {
			const validation = validateConnectionScheme(draftScheme);
			if (!validation.valid) {
				onSchemeError?.();
			}
		}
		onChange(draftScheme);
	};

	return (
		<div className="space-y-6">
			{/* Область сборки схемы */}
			<div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
				<h3 className="text-lg font-semibold mb-4">
					Соберите схему подключения
				</h3>

				{draftSchemeLength === 0 ? (
					<EmptyDropZone onDrop={() => handleDrop(0)} />
				) : (
					<div className="min-h-32 bg-white rounded-lg border-2 border-dashed border-gray-400 p-4">
						<div className="flex items-center gap-2 flex-wrap">
							{draftScheme.sequence.map((element, index) => (
								<div
									key={`${element.id}-${index}`}
									className="flex items-center gap-2"
								>
									<ElementCard
										element={element}
										onRemove={() => handleRemove(index)}
										onDrop={() => handleDrop(index)}
										onDragStart={() => handleDragStart(element)}
										onDragEnd={handleDragEnd}
										onSplitterOutputChange={(output) =>
											handleSplitterOutputChange(index, output)
										}
										measuredOutputs={elementMeasuredOutputs[element.id]}
									/>
									{index < draftSchemeLength - 1 && (
										<div className="text-gray-400 text-2xl">→</div>
									)}
								</div>
							))}
							{/* Зона для добавления нового элемента в конец */}
							{draftSchemeLength !== scheme.correctSequence.length && (
								<DropZone onDrop={() => handleDrop(draftSchemeLength)} />
							)}
						</div>
					</div>
				)}

				{/* Валидация - показываем только если схема применена */}
				<div className="mt-4">
					{scheme.sequence.length > 0 && (
						<div
							className={`p-3 rounded ${
								validation.valid
									? 'bg-green-50 text-green-800 border border-green-200'
									: 'bg-red-50 text-red-800 border border-red-200'
							}`}
						>
							{validation.valid ? (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<span className="text-xl">✓</span>
										<span>Схема собрана правильно!</span>
									</div>
									<div className="text-sm text-green-700 border-t border-green-200 pt-2">
										Для выполнения измерения: на приборе перейдите на экран
										измерения FasTest и нажмите кнопку <strong>F2</strong> или{' '}
										<strong>FasTest</strong> на клавиатуре прибора. После
										получения результатов перейдите на вкладку{' '}
										<strong>«Результаты»</strong>.
									</div>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<span className="text-xl">✗</span>
									<span>{validation.error}</span>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="mt-4 flex gap-2">
					<button
						type="button"
						onClick={handleReset}
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 hover:cursor-pointer transition"
					>
						Сбросить схему
					</button>
					{hasChanges && (
						<button
							type="button"
							onClick={handleConfirm}
							className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 hover:cursor-pointer transition"
						>
							Подтвердить
						</button>
					)}
				</div>
			</div>

			{/* Доступные элементы */}
			<div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
				<h3 className="text-lg font-semibold mb-4">Доступные элементы</h3>

				{filteredAvailableElements.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{filteredAvailableElements.map((element) => (
							<DraggableElement
								key={element.id}
								element={element}
								onDragStart={() => handleDragStart(element)}
								onDragEnd={handleDragEnd}
								onAdd={() => handleAdd(element)}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						Все элементы уже добавлены в схему
					</div>
				)}
			</div>
		</div>
	);
}
