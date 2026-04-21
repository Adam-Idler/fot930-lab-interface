import clsx from 'clsx';
import type React from 'react';

const DEFECT_TYPE_OPTIONS = [
	'Загрязнение (пыль/пятно)',
	'Царапина',
	'Скол',
	'Дефект отсутствует'
] as const;

interface FipStep {
	id: string;
	title: string;
	description: string;
}

const FIP_STEPS: FipStep[] = [
	{
		id: 'connect_fip',
		title: 'Подключение FIP',
		description:
			'Подключите видеомикроскоп (FIP) к коннектору выбранного выхода. Перетащите конец провода к порту в нижней части прибора VFL на схеме.'
	},
	{
		id: 'fip_adjust_focus',
		title: 'Настройка изображения на приборе',
		description:
			'На приборе откройте меню «Источник/VFL/Видеомикроскоп», выберите «Видеомикроскоп». Стрелками вверх/вниз настройте яркость, влево/вправо — контраст, пока изображение торца коннектора не станет чётким.'
	},
	{
		id: 'identify_defect',
		title: 'Определение дефекта',
		description: ''
	}
];

interface DefectTypeQuestionProps {
	selectedIdx: number | null;
	isAnswerLocked: boolean;
	onSelect: (idx: number) => void;
}

function DefectTypeQuestion({
	selectedIdx,
	isAnswerLocked,
	onSelect
}: DefectTypeQuestionProps) {
	return (
		<div className="space-y-2 mt-1">
			<p className="text-sm text-gray-700 font-medium">
				Определите тип дефекта на торце коннектора
			</p>
			<div className="space-y-2">
				{DEFECT_TYPE_OPTIONS.map((option, idx) => {
					const isSelected = selectedIdx === idx;
					if (isAnswerLocked && !isSelected) return null;
					return (
						<button
							key={option}
							type="button"
							disabled={isAnswerLocked}
							onClick={() => onSelect(idx)}
							className={clsx(
								'w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors',
								{
									'bg-green-100 border-green-500 text-green-800 cursor-default':
										isSelected && isAnswerLocked,
									'bg-red-100 border-red-400 text-red-800 cursor-pointer':
										isSelected && !isAnswerLocked,
									'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer':
										!isSelected && !isAnswerLocked
								}
							)}
						>
							{idx + 1}. {option}
						</button>
					);
				})}
			</div>
			{isAnswerLocked && (
				<p className="text-sm font-medium text-green-700">✓ Верно!</p>
			)}
			{selectedIdx !== null && !isAnswerLocked && (
				<p className="text-sm text-red-600">Неверно. Попробуйте ещё раз.</p>
			)}
		</div>
	);
}

function renderStepContent(
	step: FipStep,
	isLocked: boolean,
	isComplete: boolean,
	defectTypeAnswer: number | null,
	isIdentifyAnswerLocked: boolean,
	onDefectTypeAnswer: (idx: number) => void
): React.ReactNode {
	if (isLocked) {
		return (
			<p className="text-xs text-gray-500 italic">
				Сначала выполните предыдущие шаги
			</p>
		);
	}
	if (step.id === 'identify_defect') {
		return (
			<DefectTypeQuestion
				selectedIdx={defectTypeAnswer}
				isAnswerLocked={isIdentifyAnswerLocked}
				onSelect={onDefectTypeAnswer}
			/>
		);
	}
	if (isComplete) {
		return (
			<div className="bg-green-100 border border-green-300 rounded p-2">
				<p className="text-xs text-green-800">✓ Выполнено</p>
			</div>
		);
	}
	return <p className="text-sm text-gray-600">{step.description}</p>;
}

interface FipAnalysisProps {
	completedStepIds: string[];
	defectTypeAnswer: number | null;
	onDefectTypeAnswer: (idx: number) => void;
}

export function FipAnalysis({
	completedStepIds,
	defectTypeAnswer,
	onDefectTypeAnswer
}: FipAnalysisProps) {
	const completedSet = new Set(completedStepIds);
	const allComplete = FIP_STEPS.every((s) => completedSet.has(s.id));

	if (allComplete) {
		return (
			<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
				<div className="shrink-0 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
					✓
				</div>
				<span className="font-medium text-green-800">
					Анализ коннектора завершён
				</span>
			</div>
		);
	}

	const activeIndex = FIP_STEPS.findIndex((s) => !completedSet.has(s.id));
	const isIdentifyAnswerLocked = completedSet.has('identify_defect');

	return (
		<div className="space-y-3">
			<div className="space-y-1">
				<h2 className="text-base font-semibold text-gray-800">
					Анализ коннектора (FIP)
				</h2>
				<p className="text-sm text-gray-500">
					VFL показал наличие потерь на выбранном выходе. Используйте FIP для
					определения причины дефекта.
				</p>
			</div>
			{FIP_STEPS.map((step, index) => {
				const isComplete = completedSet.has(step.id);
				const isActive = index === activeIndex;
				const isLocked = !isComplete && !isActive;

				return (
					<div
						key={step.id}
						className={clsx('border-2 rounded-lg p-4 transition-all', {
							'border-green-500 bg-green-50': isComplete,
							'border-blue-300 bg-blue-50': isActive,
							'border-gray-300 bg-gray-50 opacity-60': isLocked
						})}
					>
						<div className="flex items-start gap-3">
							<div
								className={clsx(
									'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
									{
										'bg-green-500 text-white': isComplete,
										'bg-blue-500 text-white': isActive,
										'bg-gray-300 text-gray-700': isLocked
									}
								)}
							>
								{isComplete ? '✓' : index + 1}
							</div>
							<div className="flex-1">
								<h4 className="font-semibold text-gray-900 mb-1">
									{step.title}
								</h4>
								{renderStepContent(
									step,
									isLocked,
									isComplete,
									defectTypeAnswer,
									isIdentifyAnswerLocked,
									onDefectTypeAnswer
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
