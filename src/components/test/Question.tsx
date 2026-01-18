import type { Dispatch, SetStateAction } from 'react';
import type { AnswerMap, TestQuestion } from './types';

interface QuestionProps {
	current: TestQuestion;
	answers: AnswerMap;
	setAnswers: Dispatch<SetStateAction<AnswerMap>>;
	evaluations: Record<TestQuestion['id'], boolean | 'unknown'>;
}

export function Question({
	current,
	answers,
	setAnswers,
	evaluations
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
				{current.answers.map((a) => (
					<label
						key={a.text}
						className="flex items-start hover:cursor-pointer gap-2 p-2 border rounded bg-white"
					>
						<input
							type="radio"
							disabled={isAnswered}
							name={`q_${current.id}`}
							className="my-auto hover:cursor-pointer"
							checked={answers[current.id] === a.text}
							onChange={() => setAnswer(a.text)}
						/>
						<span className="leading-relaxed">{a.text}</span>
					</label>
				))}
			</div>
		);
	}

	if (current.type === 'multiple') {
		const selected = new Set<number>((answers[current.id] as number[]) ?? []);

		return (
			<div className="space-y-3">
				{current.answers.map((a, idx) => {
					const checked = selected.has(idx);

					return (
						<label
							key={a.text}
							className="flex items-start hover:cursor-pointer gap-2 p-2 border rounded bg-white"
						>
							<input
								type="checkbox"
								className="my-auto hover:cursor-pointer"
								checked={checked}
								disabled={isAnswered}
								onChange={() => {
									const next = new Set(selected);
									if (next.has(idx)) next.delete(idx);
									else next.add(idx);
									setAnswer([...next]);
								}}
							/>
							<span className="leading-relaxed">{a.text}</span>
						</label>
					);
				})}
			</div>
		);
	}

	const currentAnswer = answers[current.id];

	// text
	return (
		<div className="space-y-2">
			<input
				className="w-full min-h-10 p-2 border rounded bg-white disabled:bg-slate-100 disabled:text-gray-500"
				value={typeof currentAnswer === 'string' ? currentAnswer : ''}
				disabled={isAnswered}
				onChange={(e) => {
					setAnswer(e.target.value);
				}}
				placeholder="Введите ответ..."
			/>
		</div>
	);
}
