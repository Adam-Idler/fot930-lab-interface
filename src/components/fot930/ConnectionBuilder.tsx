/**
 * Компонент для сборки схемы подключения
 * Позволяет студенту составить правильную последовательность элементов
 */

import { useState } from 'react';
import type { ConnectionElement, ConnectionScheme } from '../../types/fot930';
import { validateConnectionScheme } from '../../lib/fot930/measurementEngine';

interface ConnectionBuilderProps {
	/** Схема подключения */
	scheme: ConnectionScheme;
	/** Callback при изменении схемы */
	onChange: (scheme: ConnectionScheme) => void;
	/** Доступные элементы для сборки */
	availableElements: ConnectionElement[];
}

export function ConnectionBuilder({
	scheme,
	onChange,
	availableElements
}: ConnectionBuilderProps) {
	const [draggedElement, setDraggedElement] = useState<ConnectionElement | null>(null);

	const validation = validateConnectionScheme(scheme);

	const handleDragStart = (element: ConnectionElement) => {
		setDraggedElement(element);
	};

	const handleDragEnd = () => {
		setDraggedElement(null);
	};

	const handleDrop = (targetIndex: number) => {
		if (!draggedElement) return;

		const newSequence = [...scheme.sequence];

		// Находим, был ли элемент уже в схеме
		const existingIndex = newSequence.findIndex((el) => el.id === draggedElement.id);

		if (existingIndex !== -1) {
			// Перемещаем существующий элемент
			newSequence.splice(existingIndex, 1);
		}

		newSequence.splice(targetIndex, 0, draggedElement);

		onChange({
			...scheme,
			sequence: newSequence
		});
	};

	const handleRemove = (index: number) => {
		const newSequence = scheme.sequence.filter((_, i) => i !== index);
		onChange({
			...scheme,
			sequence: newSequence
		});
	};

	const handleReset = () => {
		onChange({
			...scheme,
			sequence: []
		});
	};

	return (
		<div className="space-y-6">
			{/* Область сборки схемы */}
			<div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
				<h3 className="text-lg font-semibold mb-4">Соберите схему подключения</h3>

				{scheme.sequence.length === 0 ? (
					<EmptyDropZone onDrop={() => handleDrop(0)} />
				) : (
					<div className="min-h-32 bg-white rounded-lg border-2 border-dashed border-gray-400 p-4">
						<div className="flex items-center gap-2 flex-wrap">
							{scheme.sequence.map((element, index) => (
								<div key={`${element.id}-${index}`} className="flex items-center gap-2">
									<ElementCard
										element={element}
										onRemove={() => handleRemove(index)}
										onDrop={() => handleDrop(index)}
									/>
									{index < scheme.sequence.length - 1 && (
										<div className="text-gray-400 text-2xl">→</div>
									)}
								</div>
							))}
							{/* Зона для добавления нового элемента в конец */}
							<DropZone onDrop={() => handleDrop(scheme.sequence.length)} />
						</div>
					</div>
				)}

				{/* Валидация */}
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
								<div className="flex items-center gap-2">
									<span className="text-xl">✓</span>
									<span>Схема собрана правильно!</span>
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
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
					>
						Сбросить схему
					</button>
				</div>
			</div>

			{/* Доступные элементы */}
			<div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
				<h3 className="text-lg font-semibold mb-4">Доступные элементы</h3>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{availableElements.map((element) => (
						<DraggableElement
							key={element.id}
							element={element}
							onDragStart={() => handleDragStart(element)}
							onDragEnd={handleDragEnd}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================

interface DraggableElementProps {
	element: ConnectionElement;
	onDragStart: () => void;
	onDragEnd: () => void;
}

function DraggableElement({ element, onDragStart, onDragEnd }: DraggableElementProps) {
	return (
		<div
			draggable
			onDragStart={(e) => {
				e.dataTransfer.effectAllowed = 'move';
				onDragStart();
			}}
			onDragEnd={onDragEnd}
			className="bg-white p-4 rounded-lg border-2 border-gray-300 cursor-move hover:border-blue-500 hover:shadow-lg transition select-none"
		>
			<ElementContent element={element} />
		</div>
	);
}

interface ElementCardProps {
	element: ConnectionElement;
	onRemove: () => void;
	onDrop: () => void;
}

function ElementCard({ element, onRemove, onDrop }: ElementCardProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	return (
		<div
			onDragOver={(e) => {
				e.preventDefault();
				setIsDragOver(true);
			}}
			onDragLeave={() => setIsDragOver(false)}
			onDrop={(e) => {
				e.preventDefault();
				setIsDragOver(false);
				onDrop();
			}}
			className={`relative bg-white p-3 rounded-lg border-2 ${
				isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
			} transition group`}
		>
			<ElementContent element={element} />

			<button
				onClick={onRemove}
				className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
			>
				×
			</button>
		</div>
	);
}

function ElementContent({ element }: { element: ConnectionElement }) {
	const getIcon = () => {
		switch (element.type) {
			case 'TESTER':
				return '📟';
			case 'CONNECTOR':
				return element.connectorType === 'SC_APC' ? '🟢' : '🔵';
			case 'COMPONENT':
				return '📦';
			default:
				return '❓';
		}
	};

	const getLabel = () => {
		if (element.label) return element.label;
		if (element.type === 'CONNECTOR') {
			return element.connectorType === 'SC_APC' ? 'SC/APC' : 'SC/UPC';
		}
		return element.type;
	};

	return (
		<div className="flex flex-col items-center gap-1 text-center">
			<span className="text-2xl">{getIcon()}</span>
			<span className="text-xs font-medium">{getLabel()}</span>
		</div>
	);
}

interface DropZoneProps {
	onDrop: () => void;
}

function DropZone({ onDrop }: DropZoneProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	return (
		<div
			onDragOver={(e) => {
				e.preventDefault();
				setIsDragOver(true);
			}}
			onDragLeave={() => setIsDragOver(false)}
			onDrop={(e) => {
				e.preventDefault();
				setIsDragOver(false);
				onDrop();
			}}
			className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center transition ${
				isDragOver
					? 'border-blue-500 bg-blue-50'
					: 'border-gray-300 bg-gray-50 hover:border-gray-400'
			}`}
		>
			<span className="text-2xl text-gray-400">+</span>
		</div>
	);
}

function EmptyDropZone({ onDrop }: DropZoneProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	return (
		<div
			onDragOver={(e) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = 'move';
				setIsDragOver(true);
			}}
			onDragLeave={() => setIsDragOver(false)}
			onDrop={(e) => {
				e.preventDefault();
				setIsDragOver(false);
				onDrop();
			}}
			className={`min-h-32 bg-white rounded-lg border-2 border-dashed p-4 transition ${
				isDragOver
					? 'border-blue-500 bg-blue-50'
					: 'border-gray-400 hover:border-gray-500'
			}`}
		>
			<div className="flex items-center justify-center h-24 text-gray-400">
				{isDragOver ? (
					<span className="text-blue-600 font-medium">Отпустите для добавления</span>
				) : (
					<span>Перетащите элементы сюда для сборки схемы</span>
				)}
			</div>
		</div>
	);
}
