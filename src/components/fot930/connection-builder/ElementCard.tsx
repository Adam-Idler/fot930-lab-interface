import { useState } from 'react';
import type { ConnectionElement } from '../../../types/fot930';
import { ElementContent } from './ElementContent';

interface ElementCardProps {
	element: ConnectionElement;
	onRemove: () => void;
	onDrop: () => void;
}

export function ElementCard({ element, onRemove, onDrop }: ElementCardProps) {
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
				type="button"
				onClick={onRemove}
				className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
			>
				×
			</button>
		</div>
	);
}
