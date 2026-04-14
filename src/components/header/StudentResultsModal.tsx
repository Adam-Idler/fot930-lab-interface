import { useEffect, useRef } from 'react';
import type { Student } from '../../types';

interface StudentResultsModalProps {
	student: Student;
	onClose: () => void;
}

export function StudentResultsModal({
	student,
	onClose
}: StudentResultsModalProps) {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleKeyDown);
		dialogRef.current?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
			onClick={handleBackdropClick}
			aria-hidden="true"
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="student-results-modal-title"
				tabIndex={-1}
				className="bg-white max-w-md rounded-xl shadow-2xl w-full outline-none"
			>
				{/* Заголовок */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
					<h2
						id="student-results-modal-title"
						className="text-lg font-semibold text-gray-800"
					>
						Результаты студента
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Закрыть"
						className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors cursor-pointer"
					>
						&times;
					</button>
				</div>

				{/* Данные студента */}
				<div className="px-6 pt-5 pb-3 flex flex-col gap-2 border-b border-gray-100">
					<InfoRow label="Студент" value={student.name} />
					<InfoRow label="Группа" value={student.group} />
				</div>

				{/* Оценки */}
				<div className="px-6 py-4 flex flex-col gap-1">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
						Оценки
					</p>

					<GradeRow
						label="Тест-допуск"
						grade={student.admissionTestResult?.grade}
						detail={
							student.admissionTestResult
								? `${student.admissionTestResult.correctAnswers} / 15 правильных`
								: undefined
						}
					/>
					<GradeRow
						label="Выполнение работы"
						grade={student.labWorkResult?.grade}
						detail={
							student.labWorkResult
								? `${student.labWorkResult.score} / 100 баллов`
								: undefined
						}
					/>
					<GradeRow
						label="Итоговый тест"
						grade={student.finalTestResult?.grade}
						detail={
							student.finalTestResult
								? `${student.finalTestResult.correctAnswers} / 10 правильных`
								: undefined
						}
					/>
				</div>
			</div>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex gap-2 text-sm text-gray-700">
			<span className="font-semibold shrink-0">{label}:</span>
			<span>{value}</span>
		</div>
	);
}

function GradeRow({
	label,
	grade,
	detail
}: {
	label: string;
	grade?: number;
	detail?: string;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
			<span className="text-sm text-gray-700">{label}</span>
			{grade !== undefined ? (
				<div className="flex items-center gap-3">
					{detail && <span className="text-sm text-gray-500">{detail}</span>}
					<GradeBadge grade={grade} />
				</div>
			) : (
				<span className="text-sm text-gray-400 italic">Не выполнен</span>
			)}
		</div>
	);
}

function GradeBadge({ grade }: { grade: number }) {
	const style =
		grade >= 5
			? 'bg-green-100 text-green-800'
			: grade >= 4
				? 'bg-blue-100 text-blue-800'
				: grade >= 3
					? 'bg-yellow-100 text-yellow-800'
					: 'bg-red-100 text-red-800';

	const label =
		grade >= 5
			? 'отлично'
			: grade >= 4
				? 'хорошо'
				: grade >= 3
					? 'удовлетворительно'
					: 'неудовлетворительно';

	return (
		<div className={`px-3 py-1 rounded-lg text-center min-w-16 ${style}`}>
			<div className="text-xl font-bold leading-none">{grade}</div>
			<div className="text-xs mt-0.5">{label}</div>
		</div>
	);
}
