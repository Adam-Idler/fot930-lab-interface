import { useState } from 'react';
import {
	getSplitterOutputCount,
	isSplitterType
} from '../../../lib/fot930/splitter';
import type { ConnectionElement } from '../../../types/fot930';
import { ElementContent } from './ElementContent';

const DOTS_PER_COLUMN = 4;

interface ElementCardProps {
	element: ConnectionElement;
	onRemove: () => void;
	onDrop: () => void;
	onDragStart: () => void;
	onDragEnd: () => void;
	onSplitterOutputChange?: (output: number) => void;
	/** Номера выходов, по которым измерение уже выполнено */
	measuredOutputs?: number[];
}

export function ElementCard({
	element,
	onRemove,
	onDrop,
	onDragStart,
	onDragEnd,
	onSplitterOutputChange,
	measuredOutputs = []
}: ElementCardProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const isSplitter = element.componentType
		? isSplitterType(element.componentType)
		: false;
	const outputCount = element.componentType
		? getSplitterOutputCount(element.componentType)
		: 0;
	const selectedOutput = element.splitterOutput ?? 1;
	const columnCount = Math.ceil(outputCount / DOTS_PER_COLUMN);

	return (
		<div
			draggable
			onDragStart={(e) => {
				e.dataTransfer.effectAllowed = 'move';
				setIsDragging(true);
				onDragStart();
			}}
			onDragEnd={() => {
				setIsDragging(false);
				onDragEnd();
			}}
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
			className={`relative bg-white p-2 rounded-lg border-2 cursor-move ${
				isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
			} ${isDragging ? 'opacity-40' : ''} transition group`}
		>
			<div className="flex items-center gap-1">
				<ElementContent element={element} />

				{isSplitter && outputCount > 0 && (
					<div className="flex flex-col items-center gap-1 pl-1.5 border-l border-gray-200 shrink-0">
						<div className="flex gap-0.5">
							{Array.from({ length: columnCount }).map((_, colIdx) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: Порядок колонок стабилен
									key={colIdx}
									className="flex flex-col gap-0.5"
								>
									{Array.from({
										length: Math.min(
											DOTS_PER_COLUMN,
											outputCount - colIdx * DOTS_PER_COLUMN
										)
									}).map((_, rowIdx) => {
										const outputNum = colIdx * DOTS_PER_COLUMN + rowIdx + 1;
										const isMeasured = measuredOutputs.includes(outputNum);
										const isSelected = selectedOutput === outputNum;

										let dotClass =
											'bg-white border-gray-400 hover:border-fot930-blue hover:bg-blue-100';
										if (isMeasured) {
											dotClass = 'bg-green-500 border-green-500';
										} else if (isSelected) {
											dotClass = 'bg-fot930-blue border-fot930-blue';
										}

										return (
											<button
												key={outputNum}
												type="button"
												title={
													isMeasured
														? `Выход ${outputNum} — измерен`
														: `Выход ${outputNum}`
												}
												onClick={(e) => {
													e.stopPropagation();
													onSplitterOutputChange?.(outputNum);
												}}
												className={`w-2.5 h-2.5 rounded-full border cursor-pointer transition-colors ${dotClass}`}
											/>
										);
									})}
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<button
				type="button"
				onClick={onRemove}
				className="absolute -top-2 -right-2 w-6 h-6 text-sm bg-red-500 text-white rounded-full opacity-0 hover:cursor-pointer group-hover:opacity-100 transition hover:bg-red-600"
			>
				×
			</button>
		</div>
	);
}
