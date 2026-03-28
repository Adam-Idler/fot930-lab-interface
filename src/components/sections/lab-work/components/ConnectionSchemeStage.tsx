import { useEffect, useState } from 'react';
import {
	getSplitterOutputCount,
	isSplitterType
} from '../../../../lib/fot930/splitter';
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
	/** Номера выходов сплиттера, по которым измерение завершено */
	measuredSplitterOutputs?: number[];
}

function getConnector(
	connectorType: PassiveComponent['connectorType'],
	index: number
): ConnectionElement {
	if (connectorType === 'SC_APC') {
		return {
			type: 'CONNECTOR' as const,
			icon: '/images/scheme/reference-sc-apc.png',
			id: `connector_apc_${index}`,
			label: `Эталонный SC/APC ${index}`,
			connectorType: 'SC_APC' as const
		};
	}

	return {
		type: 'CONNECTOR' as const,
		icon: '/images/scheme/reference-sc-upc.png',
		id: `connector_upc_${index}`,
		label: `Эталонный SC/UPC ${index}`,
		connectorType: 'SC_UPC' as const
	};
}

export function ConnectionSchemeStage({
	scheme,
	currentComponent,
	onSchemeChange,
	measuredSplitterOutputs = []
}: ConnectionSchemeStageProps) {
	const isSplitter = isSplitterType(currentComponent.type);
	const splitterOutputCount = isSplitter
		? getSplitterOutputCount(currentComponent.type)
		: 0;

	const baseElements = [
		{
			type: 'TESTER' as const,
			id: 'tester',
			label: 'Тестер FOT-930 (Блок А)',
			icon: '/images/instruction/fot-930.png'
		},
		getConnector(currentComponent.connectorType, 1),
		getConnector(currentComponent.connectorType, 2),
		{
			type: 'COMPONENT' as const,
			id: currentComponent.id,
			label: currentComponent.label,
			icon: currentComponent.icon,
			componentType: currentComponent.type,
			splitterOutput: isSplitter ? 1 : undefined
		},
		{
			type: 'TESTER' as const,
			id: 'tester_2',
			label: 'Тестер FOT-930 (Блок Б)',
			icon: '/images/instruction/fot-930.png'
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

			{/* Подсказка для сплиттера */}
			{isSplitter && (
				<div className="mb-4 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
					<span className="shrink-0 mt-0.5 text-gray-400">ℹ</span>
					<span>
						Для полного измерения сплиттера 1:{splitterOutputCount} необходимо
						выполнить измерение каждого из {splitterOutputCount} выходов.
						Выбирайте активный выход с помощью точек на элементе в схеме.
					</span>
				</div>
			)}

			<ConnectionBuilder
				scheme={scheme}
				onChange={onSchemeChange}
				availableElements={availableElements}
				elementMeasuredOutputs={
					isSplitter ? { [currentComponent.id]: measuredSplitterOutputs } : {}
				}
			/>
		</div>
	);
}
