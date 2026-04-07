import type { ConnectionElement } from '../../../types/fot930';
import { ElementContent } from './ElementContent';

interface DraggableElementProps {
	element: ConnectionElement;
	onDragStart: () => void;
	onDragEnd: () => void;
	onAdd: () => void;
}

export function DraggableElement({
	element,
	onDragStart,
	onDragEnd,
	onAdd
}: DraggableElementProps) {
	return (
		<div
			draggable
			onDragStart={(e) => {
				e.dataTransfer.effectAllowed = 'move';
				onDragStart();
			}}
			onDragEnd={onDragEnd}
			className="relative bg-white p-4 rounded-lg border-2 border-gray-300 cursor-move hover:border-blue-500 hover:shadow-lg transition select-none group"
		>
			<ElementContent element={element} />
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onAdd();
				}}
				className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-bold leading-none opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
				title="Добавить в схему"
			>
				+
			</button>
		</div>
	);
}
