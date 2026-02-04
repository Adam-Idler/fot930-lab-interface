import type {
	ConnectionScheme,
	PassiveComponent
} from '../../../../types/fot930';
import { ConnectionBuilder } from '../../../fot930';

interface ConnectionSchemeStageProps {
	scheme: ConnectionScheme;
	currentComponent: PassiveComponent | null;
	onSchemeChange: (scheme: ConnectionScheme) => void;
	attemptCount: number;
}

// TODO: Перемешивать доступные элементы
export function ConnectionSchemeStage({
	scheme,
	currentComponent,
	onSchemeChange,
	attemptCount
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
		{
			type: 'COMPONENT' as const,
			id: currentComponent?.id || 'optical_cable_1',
			label: currentComponent?.label || 'Optical Cable'
		},
		{ type: 'TESTER' as const, id: 'tester_2', label: 'Тестер FOT-930 2' }
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">
				Этап 3. Сборка схемы подключения
			</h2>

			<div className="bg-gray-50 p-3 rounded mb-4">
				<div className="text-sm">
					<span className="font-medium">Номер измерения:</span>{' '}
					{attemptCount} из 3
				</div>
				 
				{attemptCount === 3 && (
					<div className="mt-2 text-xs text-gray-600">
						Выполнены все 3 измерения. Выберите другую сторону или
						компонент.
					</div>
				)}
			</div>

			<ConnectionBuilder
				scheme={scheme}
				onChange={onSchemeChange}
				availableElements={availableElements}
			/>
		</div>
	);
}
