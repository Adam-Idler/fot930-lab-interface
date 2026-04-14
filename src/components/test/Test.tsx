import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../../lib/storage';
import { useRegistration } from '../registration-form';
import { Progress } from './Progress';
import { Question } from './Question';
import type { AnswerMap, TestQuestion, TextQuestion } from './types';

type TestProps = {
	questions: TestQuestion[];
	testID: 'admissionTest' | 'finalTest';
	onRestart?: () => void;
};

function isTextQuestion(q: TestQuestion): q is TextQuestion {
	return q.type === 'text';
}

function normalizeText(s: string) {
	return s.trim();
}

function calculateGrade(correctCount: number, total: number) {
	const percent = (correctCount / total) * 100;
	if (percent === 100) return 5;
	if (percent >= 85) return 4;
	if (percent >= 70) return 3;
	return 2;
}

function gradeLabel(grade: number): string {
	if (grade >= 5) return 'отлично';
	if (grade >= 4) return 'хорошо';
	if (grade >= 3) return 'удовлетворительно';
	return 'неудовлетворительно';
}

function gradeTextColor(grade: number): string {
	if (grade >= 5) return 'text-green-600';
	if (grade >= 4) return 'text-blue-600';
	if (grade >= 3) return 'text-yellow-600';
	return 'text-red-600';
}

function gradeBadgeStyle(grade: number): string {
	if (grade >= 5) return 'bg-green-100 text-green-800';
	if (grade >= 4) return 'bg-blue-100 text-blue-800';
	if (grade >= 3) return 'bg-yellow-100 text-yellow-800';
	return 'bg-red-100 text-red-800';
}

export function Test({ questions, testID, onRestart }: TestProps) {
	const total = questions.length;

	const { student, setStudent } = useRegistration();

	const studentTestResultKey: 'admissionTestResult' | 'finalTestResult' =
		`${testID}Result`;
	const studentTestResult = student[studentTestResultKey];

	const testTitle =
		testID === 'admissionTest' ? 'Входной контроль знаний' : 'Итоговый тест';

	const [grade, setGrade] = useState<number | undefined>(
		studentTestResult?.grade
	);
	const [isEnd, setIsEnd] = useState(studentTestResult !== undefined);

	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<AnswerMap>({});
	const [evaluations, setEvaluations] = useState<
		Record<TestQuestion['id'], boolean | 'unknown'>
	>({});

	const current = questions[index];

	const isReviewMode = isEnd;

	// Правильных ответов и оценка для отображения
	const displayCorrectCount = isReviewMode
		? Object.values(evaluations).filter((v) => v === true).length
		: (studentTestResult?.correctAnswers ?? 0);
	const displayGrade = isReviewMode
		? (grade ?? 2)
		: (studentTestResult?.grade ?? 2);

	// Проверка валидности ответа (для кнопки Next)
	const isAnswerReady = useMemo(() => {
		const currentAnswer = answers[current.id];

		if (current.type === 'single') {
			return typeof currentAnswer === 'string';
		}

		if (current.type === 'multiple') {
			const arr = (currentAnswer ?? []) as number[];
			return Array.isArray(arr) && arr.length > 0;
		}
		const text = typeof currentAnswer === 'string' ? currentAnswer : '';

		if (isTextQuestion(current) && !normalizeText(text).length) {
			return false;
		}

		return true;
	}, [answers, current]);

	// Оценка правильности (для прогресс-бара)
	const computeEvaluation = useCallback(
		(q: TestQuestion, ans: unknown): boolean | 'unknown' => {
			if (q.type === 'text') {
				return !!q.validator?.(
					typeof ans === 'string' ? normalizeText(ans) : ''
				);
			}

			const correctAnswers = q.answers.filter((ans) => ans.isCorrect);

			if (q.type === 'multiple') {
				return (
					Array.isArray(ans) &&
					correctAnswers.length === ans.length &&
					ans.every((idx) => {
						return q.answers[idx].isCorrect;
					})
				);
			}

			return typeof ans === 'string' && correctAnswers[0].text === ans;
		},
		[]
	);

	const commitCurrentAndNext = useCallback(() => {
		const nextAnswers: AnswerMap = { ...answers };

		const evalValue = computeEvaluation(current, nextAnswers[current.id]);
		setEvaluations((prev) => ({ ...prev, [current.id]: evalValue }));

		if (index + 1 === total) {
			setIsEnd(true);

			const testResult = Object.values({
				...evaluations,
				[current.id]: evalValue
			}).filter((v) => v === true).length;
			const testGrade = calculateGrade(testResult, total);

			setGrade(testGrade);

			const updatedStudent = {
				...student,
				[studentTestResultKey]: {
					correctAnswers: testResult,
					totalQuestions: total,
					grade: testGrade
				}
			};

			setStudent(updatedStudent);
			storage.saveStudent(updatedStudent);

			return;
		}

		setIndex((i) => i + 1);
	}, [
		computeEvaluation,
		answers,
		current,
		evaluations,
		index,
		total,
		student,
		studentTestResultKey,
		setStudent
	]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Enter' && isAnswerReady && !isEnd) {
				commitCurrentAndNext();
			}
		},
		[isAnswerReady, commitCurrentAndNext, isEnd]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	const handleRestart = useCallback(() => {
		setIsEnd(false);
		setIndex(0);
		setAnswers({});
		setEvaluations({});
		setGrade(undefined);

		const updatedStudent = { ...student, [studentTestResultKey]: undefined };
		setStudent(updatedStudent);
		storage.saveStudent(updatedStudent);

		onRestart?.();
	}, [student, studentTestResultKey, setStudent, onRestart]);

	if (isEnd) {
		return (
			<section className="py-6 w-full mx-auto space-y-4">
				{/* Инлайн-результат: аналог блока оценки в лабораторной работе */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Тест завершён
							</h2>
							<p className="mt-1 text-gray-600">{testTitle}</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right">
								<div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
									Правильных
								</div>
								<div
									className={`text-3xl font-bold ${gradeTextColor(displayGrade)}`}
								>
									{displayCorrectCount}
									<span className="text-lg font-normal text-gray-400">
										{' '}
										/ {total}
									</span>
								</div>
							</div>
							<div
								className={`px-4 py-2 rounded-lg text-center ${gradeBadgeStyle(displayGrade)}`}
							>
								<div className="text-xs uppercase tracking-wide mb-0.5 opacity-70">
									Оценка
								</div>
								<div className="text-2xl font-bold leading-none">
									{displayGrade}
								</div>
								<div className="text-xs mt-0.5">{gradeLabel(displayGrade)}</div>
							</div>
							<button
								type="button"
								className="px-4 py-2 rounded bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer text-sm"
								onClick={handleRestart}
							>
								Начать заново
							</button>
						</div>
					</div>
				</div>

				{/* Просмотр ответов (только если тест завершён в этой сессии) */}
				{isReviewMode && (
					<>
						<Progress
							questions={questions}
							index={index}
							evaluations={evaluations}
							setIndex={setIndex}
							total={total}
						/>

						<div className="border border-slate-300 rounded bg-slate-50 p-4">
							<div className="text-base font-medium text-slate-900 mb-3">
								{current.text}
							</div>
							<Question
								current={current}
								answers={answers}
								setAnswers={setAnswers}
								evaluations={evaluations}
								isReview
							/>
						</div>

						<div className="mt-4 flex justify-between items-center gap-3">
							<p className="text-sm text-slate-500">
								Вопрос {index + 1} из {total}
							</p>
							<div className="flex gap-3">
								<button
									type="button"
									className="px-4 py-2 rounded bg-slate-200 text-slate-800 disabled:opacity-40 not-disabled:hover:cursor-pointer"
									onClick={() => setIndex((i) => Math.max(0, i - 1))}
									disabled={index === 0}
								>
									Назад
								</button>
								<button
									type="button"
									className="px-4 py-2 rounded bg-slate-800 text-white disabled:opacity-40 not-disabled:hover:cursor-pointer"
									onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
									disabled={index === total - 1}
								>
									Далее
								</button>
							</div>
						</div>
					</>
				)}
			</section>
		);
	}

	return (
		<section className="py-10 w-full min-h-1/2 mx-auto">
			<div className="mb-4">
				<p className="text-sm text-center text-slate-600">
					Вопрос {index + 1} из {total}
				</p>
			</div>

			<Progress
				questions={questions}
				index={index}
				evaluations={evaluations}
				setIndex={setIndex}
				total={total}
			/>

			<div className="border border-slate-300 rounded bg-slate-50 p-4">
				<div className="text-base font-medium text-slate-900 mb-3">
					{current.text}
				</div>

				<Question
					current={current}
					answers={answers}
					setAnswers={setAnswers}
					evaluations={evaluations}
				/>
			</div>

			<div className="mt-4 flex justify-end gap-3">
				<button
					type="button"
					className="px-4 py-2 rounded bg-slate-200 text-slate-800 disabled:opacity-40 not-disabled:hover:cursor-pointer"
					onClick={() => setIndex((i) => Math.max(0, i - 1))}
					disabled={index === 0}
				>
					Назад
				</button>
				<button
					type="button"
					className="px-4 py-2 rounded bg-slate-800 text-white disabled:opacity-40 not-disabled:hover:cursor-pointer"
					onClick={commitCurrentAndNext}
					disabled={!isAnswerReady}
				>
					{index + 1 === total ? 'Завершить' : 'Далее'}
				</button>
			</div>
		</section>
	);
}
