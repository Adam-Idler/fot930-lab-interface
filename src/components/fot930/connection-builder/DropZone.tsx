import { useState } from 'react';

interface DropZoneProps {
	onDrop: () => void;
}

export function DropZone({ onDrop }: DropZoneProps) {
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
