import type { ConnectionElement } from '../../../types/fot930';

interface ElementContentProps {
	element: ConnectionElement;
}

export function ElementContent({ element }: ElementContentProps) {
	return (
		<div className="flex flex-col items-center gap-1 text-center">
			<img className="h-6" alt={element.label} src={element.icon} />
			<span className="text-xs font-medium">{element.label}</span>
		</div>
	);
}
