import type { ConnectionElement } from '../../../types/fot930';

interface ElementContentProps {
	element: ConnectionElement;
}

export function ElementContent({ element }: ElementContentProps) {
	const getIcon = () => {
		switch (element.type) {
			case 'TESTER':
				return '📟';
			case 'CONNECTOR':
				return element.connectorType === 'SC_APC' ? '🟢' : '🔵';
			case 'COMPONENT':
				return '📦';
			default:
				return '❓';
		}
	};

	const getLabel = () => {
		if (element.label) return element.label;
		if (element.type === 'CONNECTOR') {
			return element.connectorType === 'SC_APC' ? 'SC/APC' : 'SC/UPC';
		}
		return element.type;
	};

	return (
		<div className="flex flex-col items-center gap-1 text-center">
			<span className="text-2xl">{getIcon()}</span>
			<span className="text-xs font-medium">{getLabel()}</span>
		</div>
	);
}
