import { publicUrl } from '../../../lib/utils';
import type { ConnectionElement } from '../../../types/fot930';

interface ElementContentProps {
	element: ConnectionElement;
}

export function ElementContent({ element }: ElementContentProps) {
	return (
		<div className="flex flex-col items-center gap-1 text-center select-none">
			<img
				className="h-6 pointer-events-none"
				alt={element.label}
				src={publicUrl(element.icon)}
			/>
			<span className="text-xs font-medium">{element.label}</span>
		</div>
	);
}
