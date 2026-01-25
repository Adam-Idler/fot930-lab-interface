import clsx from 'clsx';
import type { Dispatch, SetStateAction } from 'react';
import type { TestQuestion } from './types';

interface ProgressProps {
	questions: TestQuestion[];
	index: number;
	evaluations: Record<TestQuestion['id'], boolean | 'unknown'>;
	setIndex: Dispatch<SetStateAction<number>>;
	total: number;
}

export function Progress({
	questions,
	index,
	evaluations,
	setIndex,
	total
}: ProgressProps) {
	return (
		<div className="flex gap-1 flex-wrap justify-center mb-4">
			{questions.map((q, i) => {
				const state = evaluations[q.id];
				const isCurrent = i === index;

				let mark = '•';
				if (state === true) mark = '✓';
				if (state === false) mark = '✗';
				if (!Object.hasOwn(evaluations, q.id) && i < index) mark = '•';

				return (
					<button
						type="button"
						key={q.id}
						className={clsx(
							'w-5 h-5 rounded border flex hover:cursor-pointer items-center justify-center text-sm select-none',
							isCurrent
								? 'bg-slate-100 border-slate-500'
								: 'bg-white border-slate-400',
							{
								'text-green-400': state === true,
								'text-red-400': state === false
							}
						)}
						title={`Вопрос ${i + 1} / ${total}`}
						onClick={() => setIndex(i)}
					>
						{mark}
					</button>
				);
			})}
		</div>
	);
}
