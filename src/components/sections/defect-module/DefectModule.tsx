import { useMemo } from 'react';
import type { DeviceState } from '../../../types/fot930';
import { FAULTY_COMPONENTS } from './constants';
import { DefectComponentSelector } from './DefectComponentSelector';
import { DefectScene } from './DefectScene';
import type { DefectModuleState } from './defectModuleState';
import { VflPreparation } from './VflPreparation';

interface DefectModuleProps {
	deviceState?: DeviceState;
	state: DefectModuleState;
	onStateChange: (state: DefectModuleState) => void;
}

export function DefectModule({
	deviceState,
	state,
	onStateChange
}: DefectModuleProps) {
	const selectedComponent =
		FAULTY_COMPONENTS.find((c) => c.id === state.selectedComponentId) ?? null;

	const handleSelect = (id: string) => {
		onStateChange({
			...state,
			selectedComponentId: id,
			confirmReset: false,
			completedVflStepIds: []
		});
	};

	const handleResetRequest = () => {
		onStateChange({ ...state, confirmReset: true });
	};

	const handleResetCancel = () => {
		onStateChange({ ...state, confirmReset: false });
	};

	const handleResetConfirm = () => {
		onStateChange({
			...state,
			selectedComponentId: null,
			confirmReset: false,
			completedVflStepIds: []
		});
	};

	const handleConfirmComponent = () => {
		if (!state.selectedComponentId) return;
		onStateChange({
			selectedComponentId: null,
			confirmReset: false,
			completedVflStepIds: [],
			completedComponentIds: state.completedComponentIds.includes(
				state.selectedComponentId
			)
				? state.completedComponentIds
				: [...state.completedComponentIds, state.selectedComponentId]
		});
	};

	const handleVflStepComplete = (stepId: string) => {
		if (state.completedVflStepIds.includes(stepId)) return;
		onStateChange({
			...state,
			completedVflStepIds: [...state.completedVflStepIds, stepId]
		});
	};

	const deviceVflSteps = useMemo(() => {
		if (!deviceState) return [];
		const steps: string[] = [];
		const onVflScreen = deviceState.screen === 'VFL_SCREEN';
		const onVflMenu = deviceState.screen === 'SOURCE_VFL_MENU';
		if (onVflMenu || onVflScreen || deviceState.vflEnabled)
			steps.push('open_menu');
		if (onVflScreen || deviceState.vflEnabled) steps.push('select_vfl_mode');
		if (deviceState.vflEnabled) steps.push('enable_vfl');
		if (deviceState.vflEnabled && deviceState.vflModulationMode === 'MODULATED')
			steps.push('select_emission_mode');
		return steps;
	}, [deviceState]);

	const allCompletedVflStepIds = useMemo(() => {
		const merged = new Set([...state.completedVflStepIds, ...deviceVflSteps]);
		return Array.from(merged);
	}, [state.completedVflStepIds, deviceVflSteps]);

	const isSplitterSelected = state.selectedComponentId === 'splitter_1_2';
	const isAllStepsComplete =
		state.completedVflStepIds.includes('find_defect') &&
		state.completedVflStepIds.includes('characterize_vfl') &&
		(!isSplitterSelected || state.completedVflStepIds.includes('connect_fip'));

	return (
		<div className="space-y-4">
			{/* Блок выбора / выбранного компонента */}
			<div className="bg-white rounded-lg shadow-md p-4">
				{selectedComponent === null ? (
					<div className="space-y-3">
						<h2 className="text-base font-semibold text-gray-800">
							Выбор компонента для диагностики
						</h2>
						<p className="text-sm text-gray-500">
							В ходе предыдущего этапа обнаружены следующие неисправные
							элементы:
						</p>
						<DefectComponentSelector
							selectedId={state.selectedComponentId}
							onSelect={handleSelect}
							completedIds={state.completedComponentIds}
						/>
					</div>
				) : (
					<div className="flex items-center gap-3 flex-wrap min-h-10">
						<span className="text-sm text-gray-500 shrink-0">
							Выбран компонент:
						</span>
						<span className="font-medium text-gray-900 grow text-sm">
							{selectedComponent.label}
						</span>

						{state.confirmReset ? (
							<div className="flex items-center gap-2 shrink-0">
								<span className="text-sm text-gray-600">
									Сбросить прогресс?
								</span>
								<button
									type="button"
									onClick={handleResetCancel}
									className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
								>
									Отмена
								</button>
								<button
									type="button"
									onClick={handleResetConfirm}
									className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors"
								>
									Сбросить
								</button>
							</div>
						) : (
							<div className="flex items-center gap-2 shrink-0">
								<button
									type="button"
									onClick={handleResetRequest}
									className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
								>
									Сбросить
								</button>
								{isAllStepsComplete && (
									<button
										type="button"
										onClick={handleConfirmComponent}
										className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer transition-colors"
									>
										Подтвердить выполнение
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Подготовка VFL */}
			{selectedComponent !== null && (
				<div className="bg-white rounded-lg shadow-md p-4">
					<VflPreparation completedStepIds={allCompletedVflStepIds} />
				</div>
			)}

			{/* Визуализация выбранного компонента */}
			{selectedComponent !== null && (
				<div className="bg-white rounded-lg shadow-md p-4">
					<DefectScene
						key={selectedComponent.id}
						componentId={selectedComponent.id}
						onStepComplete={handleVflStepComplete}
						completedStepIds={state.completedVflStepIds}
						vflEnabled={deviceState?.vflEnabled ?? false}
						vflMode={
							deviceState?.vflModulationMode === 'MODULATED'
								? 'MODULATED'
								: 'CW'
						}
					/>
				</div>
			)}

			{/* Анализ коннектора (FIP) — только для сплиттера */}
			{selectedComponent !== null &&
				isSplitterSelected &&
				state.completedVflStepIds.includes('find_defect') &&
				state.completedVflStepIds.includes('characterize_vfl') && (
					<div className="bg-white rounded-lg shadow-md p-4 space-y-3">
						<h2 className="text-base font-semibold text-gray-800">
							Анализ коннектора (FIP)
						</h2>
						<div className="border border-gray-200 rounded-lg p-3 space-y-3">
							<div className="flex items-center gap-2">
								<span
									className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
										state.completedVflStepIds.includes('connect_fip')
											? 'bg-green-500 text-white'
											: 'bg-blue-600 text-white'
									}`}
								>
									{state.completedVflStepIds.includes('connect_fip')
										? '✓'
										: '1'}
								</span>
								<span className="text-sm font-medium text-gray-700">
									Подключение FIP
								</span>
							</div>
							<p className="text-sm text-gray-600 pl-7">
								Подключите видеомикроскоп (FIP) к коннектору выбранного выхода.
								Перетащите конец провода к порту в нижней части прибора VFL на
								схеме.
							</p>
						</div>
					</div>
				)}

			{/* Итог: дефект найден */}
			{selectedComponent !== null &&
				state.completedVflStepIds.includes('find_defect') &&
				state.completedVflStepIds.includes('characterize_vfl') && (
					<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
						<div className="shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
							✓
						</div>
						<div>
							<p className="font-semibold text-green-800">
								Дефект успешно локализован
							</p>
							<p className="text-sm text-green-700">
								Неисправность обнаружена в компоненте «{selectedComponent.label}
								».
							</p>
						</div>
					</div>
				)}
		</div>
	);
}
