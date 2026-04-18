import { useState } from 'react';
import { DefectComponentSelector } from './DefectComponentSelector';

type DefectModuleState = {
	selectedComponentId: string | null;
};

export function DefectModule() {
	const [state, setState] = useState<DefectModuleState>({
		selectedComponentId: null
	});

	const handleSelect = (id: string) => {
		setState({ selectedComponentId: id });
	};

	return (
		<div className="py-6 space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Определение дефектов
				</h1>
				<p className="mt-2 text-gray-600">
					Диагностика неисправных оптических компонентов
				</p>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6 space-y-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Выбор компонента для диагностики
				</h2>
				<p className="text-sm text-gray-500">
					В ходе предыдущего этапа обнаружены следующие неисправные элементы:
				</p>
				<DefectComponentSelector
					selectedId={state.selectedComponentId}
					onSelect={handleSelect}
				/>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6">
				{state.selectedComponentId === null ? (
					<p className="text-gray-500 text-sm">
						Выберите компонент для начала диагностики
					</p>
				) : (
					<p className="text-blue-700 text-sm font-medium">
						Диагностика компонента будет доступна на следующем этапе
					</p>
				)}
			</div>
		</div>
	);
}
