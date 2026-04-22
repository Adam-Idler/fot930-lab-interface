import { useCallback, useMemo, useRef, useState } from 'react';
import type { DeviceState } from '../../../types/fot930';
import { ActionQuestion } from './ActionQuestion';
import { FAULTY_COMPONENTS } from './constants';
import { DefectComponentSelector } from './DefectComponentSelector';
import { type ActiveVflQuestion, DefectScene } from './DefectScene';
import { VflCharQuestion } from './defect-scene/VflCharQuestion';
import type { DefectModuleState } from './defectModuleState';
import { FipAnalysis } from './FipAnalysis';
import { VflPreparation } from './VflPreparation';

interface DefectModuleProps {
	deviceState?: DeviceState;
	state: DefectModuleState;
	onStateChange: (state: DefectModuleState) => void;
	onPenalty?: (amount: number, reason: string) => void;
	onSplitterOutputChange?: (idx: 0 | 1 | null) => void;
	onVflDisable?: () => void;
}

export function DefectModule({
	deviceState,
	state,
	onStateChange,
	onPenalty,
	onSplitterOutputChange,
	onVflDisable
}: DefectModuleProps) {
	const [activeVflQuestion, setActiveVflQuestion] =
		useState<ActiveVflQuestion | null>(null);
	const [activeSplOutput, setActiveSplOutput] = useState<0 | 1 | null>(null);
	const penalizedRef = useRef<Set<string>>(new Set());

	const handleSplitterOutput = useCallback(
		(idx: 0 | 1 | null) => {
			setActiveSplOutput(idx);
			onSplitterOutputChange?.(idx);
		},
		[onSplitterOutputChange]
	);

	const selectedComponent =
		FAULTY_COMPONENTS.find((c) => c.id === state.selectedComponentId) ?? null;

	const handleSelect = (id: string) => {
		penalizedRef.current.clear();
		onVflDisable?.();
		onStateChange({
			...state,
			selectedComponentId: id,
			confirmReset: false,
			completedVflStepIds: [],
			fipDefectTypeAnswer: null,
			actionAnswer: null,
			actionAnswerGoodInput: null,
			vflCharAnswers: {}
		});
	};

	const handleResetRequest = () => {
		onStateChange({ ...state, confirmReset: true });
	};

	const handleResetCancel = () => {
		onStateChange({ ...state, confirmReset: false });
	};

	const handleResetConfirm = () => {
		penalizedRef.current.clear();
		onVflDisable?.();
		onStateChange({
			...state,
			selectedComponentId: null,
			confirmReset: false,
			completedVflStepIds: [],
			fipDefectTypeAnswer: null,
			actionAnswer: null,
			actionAnswerGoodInput: null,
			vflCharAnswers: {}
		});
	};

	const handleConfirmComponent = () => {
		if (!state.selectedComponentId) return;
		onStateChange({
			selectedComponentId: null,
			confirmReset: false,
			completedVflStepIds: [],
			fipDefectTypeAnswer: null,
			actionAnswer: null,
			actionAnswerGoodInput: null,
			vflCharAnswers: {},
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

	const handleFipDefectTypeAnswer = (idx: number) => {
		const alreadyDone = state.completedVflStepIds.includes('identify_defect');
		let newCompletedIds = state.completedVflStepIds;
		if (idx === 0 && !alreadyDone) {
			newCompletedIds = [...state.completedVflStepIds, 'identify_defect'];
		}
		if (idx !== 0 && !penalizedRef.current.has('fip_defect')) {
			penalizedRef.current.add('fip_defect');
			onPenalty?.(5, 'Неверное определение типа дефекта FIP');
		}
		onStateChange({
			...state,
			fipDefectTypeAnswer: idx,
			completedVflStepIds: newCompletedIds
		});
	};

	const handleVflCharAnswer = (key: string, idx: number) => {
		if (state.vflCharAnswers[key]?.locked) return;
		const correctIdx =
			activeVflQuestion?.key === key ? activeVflQuestion.correctIdx : -1;
		const locked = idx === correctIdx;
		if (!locked && correctIdx !== -1) {
			const penaltyKey = `vfl_char_${key}`;
			if (!penalizedRef.current.has(penaltyKey)) {
				penalizedRef.current.add(penaltyKey);
				onPenalty?.(5, 'Неверный ответ о характере повреждения VFL');
			}
		}
		const newAnswers = { ...state.vflCharAnswers, [key]: { idx, locked } };
		let newCompletedIds = state.completedVflStepIds;
		if (locked) {
			if (
				activeVflQuestion?.isCompletion &&
				!newCompletedIds.includes('characterize_vfl')
			) {
				newCompletedIds = [...newCompletedIds, 'characterize_vfl'];
			}
			if (
				key === 'spl_good' &&
				!newCompletedIds.includes('characterize_vfl_good')
			) {
				newCompletedIds = [...newCompletedIds, 'characterize_vfl_good'];
			}
		}
		onStateChange({
			...state,
			vflCharAnswers: newAnswers,
			completedVflStepIds: newCompletedIds
		});
	};

	const handleActionAnswer = (idx: number) => {
		const correctIdx = state.selectedComponentId === 'splitter_1_2' ? 1 : 0;
		if (idx !== correctIdx) {
			const penaltyKey = `action_main_${state.selectedComponentId}`;
			if (!penalizedRef.current.has(penaltyKey)) {
				penalizedRef.current.add(penaltyKey);
				onPenalty?.(5, 'Неверный ответ о действии с компонентом');
			}
		}
		onStateChange({ ...state, actionAnswer: idx });
	};

	const handleActionAnswerGoodInput = (idx: number) => {
		if (idx !== 2) {
			const penaltyKey = `action_good_${state.selectedComponentId}`;
			if (!penalizedRef.current.has(penaltyKey)) {
				penalizedRef.current.add(penaltyKey);
				onPenalty?.(5, 'Неверный ответ о действии с компонентом');
			}
		}
		onStateChange({ ...state, actionAnswerGoodInput: idx });
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
	const fipStepsDone =
		state.completedVflStepIds.includes('connect_fip') &&
		state.completedVflStepIds.includes('fip_adjust_focus') &&
		state.completedVflStepIds.includes('identify_defect');
	const isAllStepsComplete =
		state.completedVflStepIds.includes('find_defect') &&
		state.completedVflStepIds.includes('characterize_vfl') &&
		(!isSplitterSelected || fipStepsDone) &&
		(isSplitterSelected || state.actionAnswer === 0) &&
		(!isSplitterSelected || state.actionAnswerGoodInput === 2) &&
		(!isSplitterSelected || state.actionAnswer === 1);

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
						onActiveQuestionChange={setActiveVflQuestion}
						onSplitterOutputChange={handleSplitterOutput}
					/>
				</div>
			)}

			{/* Вопрос о характере повреждения (VFL) */}
			{selectedComponent !== null && activeVflQuestion !== null && (
				<div className="bg-white rounded-lg shadow-md p-4">
					<VflCharQuestion
						currentAnswer={state.vflCharAnswers[activeVflQuestion.key]}
						onAnswer={(idx) => handleVflCharAnswer(activeVflQuestion.key, idx)}
					/>
				</div>
			)}

			{/* Действие после VFL — шнур */}
			{selectedComponent !== null &&
				!isSplitterSelected &&
				state.completedVflStepIds.includes('characterize_vfl') && (
					<div className="bg-white rounded-lg shadow-md p-4">
						<ActionQuestion
							correctIdx={0}
							answer={state.actionAnswer}
							onAnswer={handleActionAnswer}
						/>
					</div>
				)}

			{/* Действие после VFL — сплиттер, исправный вход */}
			{selectedComponent !== null &&
				isSplitterSelected &&
				activeSplOutput === 0 &&
				state.completedVflStepIds.includes('characterize_vfl_good') && (
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="space-y-1 mb-3">
							<p className="text-sm font-medium text-gray-700">
								Выход 1 (исправный)
							</p>
						</div>
						<ActionQuestion
							correctIdx={2}
							answer={state.actionAnswerGoodInput}
							onAnswer={handleActionAnswerGoodInput}
						/>
					</div>
				)}

			{/* Анализ коннектора (FIP) — только для сплиттера, выход 2 */}
			{selectedComponent !== null &&
				isSplitterSelected &&
				activeSplOutput === 1 &&
				state.completedVflStepIds.includes('find_defect') &&
				state.completedVflStepIds.includes('characterize_vfl') && (
					<div className="bg-white rounded-lg shadow-md p-4">
						<FipAnalysis
							completedStepIds={state.completedVflStepIds}
							defectTypeAnswer={state.fipDefectTypeAnswer}
							onDefectTypeAnswer={handleFipDefectTypeAnswer}
						/>
					</div>
				)}

			{/* Действие после FIP — сплиттер, дефектный вход */}
			{selectedComponent !== null && isSplitterSelected && fipStepsDone && (
				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="space-y-1 mb-3">
						<p className="text-sm font-medium text-gray-700">
							Выход 2 (дефектный)
						</p>
					</div>
					<ActionQuestion
						correctIdx={1}
						answer={state.actionAnswer}
						onAnswer={handleActionAnswer}
					/>
				</div>
			)}
		</div>
	);
}
