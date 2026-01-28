import type { ConnectionElement } from '../../../types/fot930';
import { ElementContent } from './ElementContent';

interface DraggableElementProps {
	element: ConnectionElement;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export function DraggableElement({
	element,
	onDragStart,
	onDragEnd
}: DraggableElementProps) {
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
