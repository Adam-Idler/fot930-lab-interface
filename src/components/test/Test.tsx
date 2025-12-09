import { useMemo, useState } from 'react';
import { useRegistration } from '../registration-form';
import { Progress } from './Progress';
import { Question } from './Question';
import type { AnswerMap, TestQuestion, TextQuestion } from './types';

type TestProps = {
	questions: TestQuestion[];
	testID: 'admissionTest' | 'finalTest';
};

function isTextQuestion(q: TestQuestion): q is TextQuestion {
	return q.type === 'text';
}

function normalizeText(s: string) {
	return s.trim();
}

function calculateGrade(correctCount: number, total: number) {
	const percent = (correctCount / total) * 100;
	if (percent > 95) return 5;
	if (percent > 80) return 4;
	if (percent > 60) return 3;
	return 2;
}

export function Test({ questions, testID }: TestProps) {
	const total = questions.length;

	const { student, setStudent } = useRegistration();

	console.log(student, testID);

	const studentTestResultKey: 'admissionTestResult' | 'finalTestResult' =
		`${testID}Result`;
	const studentTestResult = student[studentTestResultKey];

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
	const computeEvaluation = (
		q: TestQuestion,
		ans: unknown
	): boolean | 'unknown' => {
		if (q.type === 'text') {
			return !!q.validator?.(typeof ans === 'string' ? normalizeText(ans) : '');
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
	};

	function commitCurrentAndNext() {
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
			window.electronAPI.saveStudent(updatedStudent);

			return;
		}

		setIndex((i) => i + 1);
	}

	if (isEnd) {
		return (
			<section className="mx-auto text-center">
				<h2 className="text-2xl font-bold mb-6">Тест завершён</h2>
				<p className="text-lg mb-4">
					Ваш результат:{' '}
					{student.admissionTestResult?.correctAnswers ??
						Object.values(evaluations).filter((v) => v === true).length}{' '}
					из {total}
				</p>
				<p className="text-md">Оценка: {grade}</p>
			</section>
		);
	}

	return (
		<section className="mx-auto">
			<div className="mb-4">
				<p className="text-sm text-slate-600">
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
