import type { ConnectionScheme } from '../../../../types/fot930';
import { ConnectionBuilder } from '../../../fot930';

interface ConnectionSchemeStageProps {
	scheme: ConnectionScheme;
	onSchemeChange: (scheme: ConnectionScheme) => void;
}

export function ConnectionSchemeStage({
	scheme,
	onSchemeChange
}: ConnectionSchemeStageProps) {
	const availableElements = [
		{ type: 'TESTER' as const, id: 'tester', label: 'Тестер FOT-930' },
		{
			type: 'CONNECTOR' as const,
			id: 'connector_apc_1',
			label: 'SC/APC 1',
			connectorType: 'SC_APC' as const
		},
		{
			type: 'CONNECTOR' as const,
			id: 'connector_apc_2',
			label: 'SC/APC 2',
			connectorType: 'SC_APC' as const
		},
		{ type: 'COMPONENT' as const, id: 'splitter_1_4', label: 'Сплиттер 1:4' },
		{ type: 'TESTER' as const, id: 'tester_2', label: 'Тестер FOT-930 2' }
	];

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
