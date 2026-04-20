import clsx from 'clsx';
import { VFL_CHARACTER_OPTIONS } from './constants';

interface VflCharQuestionProps {
	currentAnswer: { idx: number; locked: boolean } | undefined;
	onAnswer: (idx: number) => void;
}

export function VflCharQuestion({
	currentAnswer,
	onAnswer
}: VflCharQuestionProps) {
	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
			<p className="text-lg font-semibold text-gray-800 mb-4">
				Какой характер повреждения наблюдается по результатам VFL?
			</p>
			<div className="space-y-3">
				{VFL_CHARACTER_OPTIONS.map((option, idx) => {
					const isSelected = currentAnswer?.idx === idx;
					const isLocked = currentAnswer?.locked ?? false;

					return (
						<button
							key={option}
							type="button"
							disabled={isLocked}
							onClick={() => onAnswer(idx)}
							className={clsx(
								'w-full text-left px-4 py-3 rounded-lg text-base border transition-colors',
								isSelected &&
									isLocked &&
									'bg-green-100 border-green-500 text-green-800 cursor-default',
								isSelected &&
									!isLocked &&
									'bg-red-100 border-red-400 text-red-800 cursor-pointer',
								!isSelected &&
									!isLocked &&
									'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer',
								!isSelected &&
									isLocked &&
									'bg-white border-gray-200 text-gray-400 cursor-default'
							)}
						>
							{idx + 1}. {option}
						</button>
					);
				})}
			</div>
			{currentAnswer?.locked && (
				<p className="mt-3 text-base font-medium text-green-700">✓ Верно!</p>
			)}
			{currentAnswer && !currentAnswer.locked && (
				<p className="mt-3 text-base text-red-600">
					Неверно. Попробуйте ещё раз.
				</p>
			)}
		</div>
	);
}
