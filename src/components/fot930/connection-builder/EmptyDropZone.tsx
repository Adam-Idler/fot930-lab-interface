import { useState } from 'react';

interface EmptyDropZoneProps {
	onDrop: () => void;
}

export function EmptyDropZone({ onDrop }: EmptyDropZoneProps) {
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
					<span className="text-blue-600 font-medium">
						Отпустите для добавления
					</span>
				) : (
					<span>Перетащите элементы сюда для сборки схемы</span>
				)}
			</div>
		</div>
	);
}
