import clsx from 'clsx';

const ACTION_OPTIONS = [
	'Заменить элемент',
	'Почистить коннектор',
	'Ничего не делать'
] as const;

interface ActionQuestionProps {
	correctIdx: number;
	answer: number | null;
	onAnswer: (idx: number) => void;
}

export function ActionQuestion({
	correctIdx,
	answer,
	onAnswer
}: ActionQuestionProps) {
	const isLocked = answer === correctIdx;

	return (
		<div className="space-y-2">
			<p className="text-sm text-gray-700 font-medium">
				Что необходимо сделать с компонентом?
			</p>
			<div className="space-y-2">
				{ACTION_OPTIONS.map((option, idx) => {
					const isSelected = answer === idx;
					if (isLocked && !isSelected) return null;
					return (
						<button
							key={option}
							type="button"
							disabled={isLocked}
							onClick={() => onAnswer(idx)}
							className={clsx(
								'w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors',
								{
									'bg-green-100 border-green-500 text-green-800 cursor-default':
										isSelected && isLocked,
									'bg-red-100 border-red-400 text-red-800 cursor-pointer':
										isSelected && !isLocked,
									'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer':
										!isSelected && !isLocked
								}
							)}
						>
							{idx + 1}. {option}
						</button>
					);
				})}
			</div>
			{isLocked && (
				<p className="text-sm font-medium text-green-700">✓ Верно!</p>
			)}
			{answer !== null && !isLocked && (
				<p className="text-sm text-red-600">Неверно. Попробуйте ещё раз.</p>
			)}
		</div>
	);
}
