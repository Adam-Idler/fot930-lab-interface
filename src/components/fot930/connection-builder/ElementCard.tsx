import { useState } from 'react';
import type { ConnectionElement } from '../../../types/fot930';
import { ElementContent } from './ElementContent';

interface ElementCardProps {
	element: ConnectionElement;
	onRemove: () => void;
	onDrop: () => void;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function ElementCard({
	element,
	onRemove,
	onDrop,
	onDragStart,
	onDragEnd
}: ElementCardProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

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
			<ElementContent element={element} />

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
