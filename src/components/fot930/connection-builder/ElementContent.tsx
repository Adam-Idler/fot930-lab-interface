import { publicUrl } from '../../../lib/utils';
import type { ConnectionElement } from '../../../types/fot930';

interface ElementContentProps {
	element: ConnectionElement;
}

export function ElementContent({ element }: ElementContentProps) {
	return (
		<div className="flex flex-col items-center gap-2 text-center select-none">
			<div className="flex items-center justify-center w-full h-16">
				<img
					className="max-h-full max-w-full object-contain pointer-events-none"
					alt={element.label}
					src={publicUrl(element.icon)}
				/>
			</div>
			<span className="text-xs font-medium leading-tight">{element.label}</span>
		</div>
	);
}
