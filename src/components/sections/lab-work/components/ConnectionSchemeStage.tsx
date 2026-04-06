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
	/**
	 * Цепочка компонентов для комплексного сценария.
	 * Если задана — схема строится для всей цепи вместо одиночного currentComponent.
	 */
	scenarioChain?: PassiveComponent[];
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
			label: `Эталонный шнур SC/APC`,
			connectorType: 'SC_APC' as const
		};
	}

	return {
		type: 'CONNECTOR' as const,
		icon: '/images/scheme/reference-sc-upc.png',
		id: `connector_upc_${index}`,
		label: `Эталонный шнур SC/UPC`,
		connectorType: 'SC_UPC' as const
	};
}

function getAdapter(
	connectorType: PassiveComponent['connectorType'],
	index: number
): ConnectionElement {
	if (connectorType === 'SC_APC') {
		return {
			type: 'COMPONENT' as const,
			icon: '/images/scheme/adapter-sc-apc.png',
			id: `adapter_apc_${index}`,
			label: 'Розетка SC/APC',
			componentType: 'ADAPTER' as const,
			connectorType: 'SC_APC' as const
		};
	}

	return {
		type: 'COMPONENT' as const,
		icon: '/images/scheme/adapter-sc-upc.png',
		id: `adapter_upc_${index}`,
		label: 'Розетка SC/UPC',
		componentType: 'ADAPTER' as const,
		connectorType: 'SC_UPC' as const
	};
}

export function ConnectionSchemeStage({
	scheme,
	currentComponent,
	onSchemeChange,
	measuredSplitterOutputs = [],
	scenarioChain
}: ConnectionSchemeStageProps) {
	const isScenario = scenarioChain && scenarioChain.length > 0;

	// Для сплиттера в одиночном режиме
	const isSplitter = !isScenario && isSplitterType(currentComponent.type);
	const splitterOutputCount = isSplitter
		? getSplitterOutputCount(currentComponent.type)
		: 0;

	// Для сплиттера в цепи (сценарий)
	const scenarioSplitter = isScenario
		? scenarioChain.find((c) => isSplitterType(c.type))
		: null;
	const scenarioSplitterOutputCount = scenarioSplitter
		? getSplitterOutputCount(scenarioSplitter.type)
		: 0;

	// Определяем тип коннектора для концов схемы
	const endConnectorType = isScenario
		? (scenarioChain[0]?.connectorType ?? 'SC_APC')
		: currentComponent.connectorType;

	const baseElements: ConnectionElement[] = isScenario
		? [
				{
					type: 'TESTER' as const,
					id: 'tester',
					label: 'Тестер FOT-930 (Блок А)',
					icon: '/images/instruction/fot-930.png'
				},
				getConnector(endConnectorType, 1),
				...scenarioChain.flatMap((c, i) => [
					getAdapter(endConnectorType, i + 1),
					{
						type: 'COMPONENT' as const,
						id: c.id,
						label: c.label,
						icon: c.icon,
						componentType: c.type,
						splitterOutput: isSplitterType(c.type) ? 1 : undefined
					}
				]),
				getAdapter(endConnectorType, scenarioChain.length + 1),
				getConnector(endConnectorType, 2),
				{
					type: 'TESTER' as const,
					id: 'tester_2',
					label: 'Тестер FOT-930 (Блок Б)',
					icon: '/images/instruction/fot-930.png'
				}
			]
		: [
				{
					type: 'TESTER' as const,
					id: 'tester',
					label: 'Тестер FOT-930 (Блок А)',
					icon: '/images/instruction/fot-930.png'
				},
				getConnector(currentComponent.connectorType, 1),
				getAdapter(currentComponent.connectorType, 1),
				{
					type: 'COMPONENT' as const,
					id: currentComponent.id,
					label: currentComponent.label,
					icon: currentComponent.icon,
					componentType: currentComponent.type,
					splitterOutput: isSplitter ? 1 : undefined
				},
				getAdapter(currentComponent.connectorType, 2),
				getConnector(currentComponent.connectorType, 2),
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

	// Перемешивать элементы при изменении currentComponent или scenarioChain
	// biome-ignore lint/correctness/useExhaustiveDependencies(currentComponent): При его изменении необходимо запускать перемешивание
	// biome-ignore lint/correctness/useExhaustiveDependencies(scenarioChain): При его изменении необходимо запускать перемешивание
	// biome-ignore lint/correctness/useExhaustiveDependencies(baseElements): Будет вызывать постоянный ререндер
	useEffect(() => {
		setAvailableElements(shuffleArray(baseElements));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentComponent, scenarioChain]);

	// Сплиттер, для которого показываем elementMeasuredOutputs
	const splitterForOutputs = isScenario ? scenarioSplitter : currentComponent;
	const hasSplitter = isScenario ? !!scenarioSplitter : isSplitter;
	const splitterOutputCountForHint = isScenario
		? scenarioSplitterOutputCount
		: splitterOutputCount;

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">
				Этап 3. Сборка схемы подключения
			</h2>

			{/* Подсказка для сплиттера (одиночный режим) */}
			{hasSplitter && !isScenario && (
				<div className="mb-4 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
					<span className="shrink-0 mt-0.5 text-gray-400">ℹ</span>
					<span>
						Для полного измерения сплиттера 1:{splitterOutputCountForHint}{' '}
						необходимо выполнить измерение каждого из{' '}
						{splitterOutputCountForHint} выходов. Выбирайте активный выход с
						помощью точек на элементе в схеме.
					</span>
				</div>
			)}

			{/* Подсказка для комплексного сценария */}
			{isScenario && (
				<div className="mb-4 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
					<span className="shrink-0 mt-0.5 text-gray-400">ℹ</span>
					<span>
						Соберите цепь из всех {scenarioChain.length} компонентов сценария.
						{hasSplitter && (
							<>
								{' '}
								Для сплиттера 1:{splitterOutputCountForHint} измерьте каждый из{' '}
								{splitterOutputCountForHint} выходов.
							</>
						)}
					</span>
				</div>
			)}

			<ConnectionBuilder
				scheme={scheme}
				onChange={onSchemeChange}
				availableElements={availableElements}
				elementMeasuredOutputs={
					hasSplitter && splitterForOutputs
						? { [splitterForOutputs.id]: measuredSplitterOutputs }
						: {}
				}
			/>
		</div>
	);
}
