import { useEffect, useState } from 'react';
import { shuffleArray } from '../../../../lib/utils';
import type {
	ConnectionElement,
	ConnectionScheme,
	PassiveComponent
} from '../../../../types/fot930';
import { ConnectionBuilder } from '../../../fot930';

interface ConnectionSchemeStageProps {
	scheme: ConnectionScheme;
	currentComponent: PassiveComponent;
	onSchemeChange: (scheme: ConnectionScheme) => void;
}

function getConnector(
	connectorType: PassiveComponent['connectorType'],
	index: number
): ConnectionElement {
	if (connectorType === 'SC_APC') {
		return {
			type: 'CONNECTOR' as const,
			icon: '/images/icons/green-connector.svg',
			id: `connector_apc_${index}`,
			label: `SC/APC ${index}`,
			connectorType: 'SC_APC' as const
		};
	}

	return {
		type: 'CONNECTOR' as const,
		icon: '/images/icons/blue-connector.svg',
		id: `connector_upc_${index}`,
		label: `SC/UPC ${index}`,
		connectorType: 'SC_UPC' as const
	};
}

export function ConnectionSchemeStage({
	scheme,
	currentComponent,
	onSchemeChange
}: ConnectionSchemeStageProps) {
	const baseElements = [
		{
			type: 'TESTER' as const,
			id: 'tester',
			label: 'Тестер FOT-930 (Блок А)',
			icon: '/images/icons/tester.svg'
		},
		getConnector(currentComponent.connectorType, 1),
		getConnector(currentComponent.connectorType, 2),
		{
			type: 'COMPONENT' as const,
			id: currentComponent.id,
			label: currentComponent.label,
			icon: currentComponent.icon
		},
		{
			type: 'TESTER' as const,
			id: 'tester_2',
			label: 'Тестер FOT-930 (Блок Б)',
			icon: '/images/icons/tester.svg'
		}
	];

	const [availableElements, setAvailableElements] = useState(() =>
		shuffleArray(baseElements)
	);

	// Перемешивать элементы при изменении currentComponent
	// biome-ignore lint/correctness/useExhaustiveDependencies(currentComponent): При его изменении необходимо запускать перемешивание
	// biome-ignore lint/correctness/useExhaustiveDependencies(baseElements): Будет вызывать постоянный ререндер
	useEffect(() => {
		setAvailableElements(shuffleArray(baseElements));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentComponent]);

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">
				Этап 3. Сборка схемы подключения
			</h2>

			<ConnectionBuilder
				scheme={scheme}
				onChange={onSchemeChange}
				availableElements={availableElements}
			/>
		</div>
	);
}
