import clsx from 'clsx';
import type { Dispatch, SetStateAction } from 'react';
import type { AnswerMap, TestQuestion } from './types';

interface QuestionProps {
	current: TestQuestion;
	answers: AnswerMap;
	setAnswers: Dispatch<SetStateAction<AnswerMap>>;
	evaluations: Record<TestQuestion['id'], boolean | 'unknown'>;
	isReview?: boolean;
}

export function Question({
	current,
	answers,
	setAnswers,
	evaluations,
	isReview = false
}: QuestionProps) {
	const isAnswered =
		evaluations[current.id] !== undefined &&
		evaluations[current.id] !== 'unknown';

	function setAnswer(value: number | number[] | string) {
		setAnswers((prev) => ({ ...prev, [current.id]: value }));
	}

	if (current.type === 'single') {
		return (
			<div className="space-y-3">
				{current.answers.map((a) => {
					const isSelected = answers[current.id] === a.text;
					const showReview = isReview && isAnswered;

					return (
						<label
							key={a.text}
							className={clsx(
								'flex items-start gap-2 p-2 border rounded',
								showReview
									? a.isCorrect
										? 'bg-green-50 border-green-400'
										: isSelected
											? 'bg-red-50 border-red-400'
											: 'bg-white border-slate-200'
									: isReview
										? 'bg-white border-slate-200'
										: 'bg-white hover:cursor-pointer'
							)}
						>
							<input
								type="radio"
								disabled={isAnswered || isReview}
								name={`q_${current.id}`}
								className="my-auto hover:cursor-pointer"
								checked={isSelected}
								onChange={() => setAnswer(a.text)}
							/>
							<span className="leading-relaxed">{a.text}</span>
							{showReview && a.isCorrect && (
								<span className="ml-auto text-xs text-green-700 self-center shrink-0">
									✓ правильный ответ
								</span>
							)}
						</label>
					);
				})}
			</div>
		);
	}

	if (current.type === 'multiple') {
		const selected = new Set<number>((answers[current.id] as number[]) ?? []);

		return (
			<div className="space-y-3">
				{current.answers.map((a, idx) => {
					const checked = selected.has(idx);
					const showReview = isReview && isAnswered;

					return (
						<label
							key={a.text}
							className={clsx(
								'flex items-start gap-2 p-2 border rounded',
								showReview
									? a.isCorrect
										? 'bg-green-50 border-green-400'
										: checked
											? 'bg-red-50 border-red-400'
											: 'bg-white border-slate-200'
									: isReview
										? 'bg-white border-slate-200'
										: 'bg-white hover:cursor-pointer'
							)}
						>
							<input
								type="checkbox"
								className="my-auto hover:cursor-pointer"
								checked={checked}
								disabled={isAnswered || isReview}
								onChange={() => {
									const next = new Set(selected);
									if (next.has(idx)) next.delete(idx);
									else next.add(idx);
									setAnswer([...next]);
								}}
							/>
							<span className="leading-relaxed">{a.text}</span>
							{showReview && a.isCorrect && (
								<span className="ml-auto text-xs text-green-700 self-center shrink-0">
									✓ правильный ответ
								</span>
							)}
						</label>
					);
				})}
			</div>
		);
	}

	const currentAnswer = answers[current.id];
	const showReview = isReview && isAnswered;

	// text
	return (
		<div className="space-y-2">
			<input
				className={clsx(
					'w-full min-h-10 p-2 border rounded',
					showReview
						? evaluations[current.id] === true
							? 'bg-green-50 border-green-400 text-gray-700'
							: 'bg-red-50 border-red-400 text-gray-700'
						: isReview
							? 'bg-slate-50 border-slate-300 text-gray-500'
							: 'bg-white disabled:bg-slate-100 disabled:text-gray-500'
				)}
				value={typeof currentAnswer === 'string' ? currentAnswer : ''}
				disabled={isAnswered || isReview}
				onChange={(e) => {
					setAnswer(e.target.value);
				}}
				placeholder="Введите ответ..."
			/>
		</div>
	);
}
