import { useEffect, useRef } from 'react';

interface AboutModalProps {
	onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
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
				aria-labelledby="about-modal-title"
				tabIndex={-1}
				className="bg-white max-w-113 rounded-xl shadow-2xl w-full outline-none"
			>
				{/* Заголовок */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
					<h2 id="about-modal-title" className="text-lg font-semibold text-gray-800">
						О программе
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

				{/* Содержимое */}
				<div className="px-6 py-5 flex flex-col gap-3">
					<InfoRow label="Название" value={'Интерфейс к лабораторной работе\n«Измерение оптическим тестером FOT-930»'} multiline />
					<InfoRow label="ВУЗ" value="СибГУТИ" />
					<InfoRow label="Кафедра" value="Кафедра фотоники в телекоммуникациях" />
					<InfoRow label="Научный руководитель" value="Первушина Любовь Валентиновна" />
					<InfoRow label="Автор" value="Раков Павел Олегович" />
					<InfoRow
						label="Email"
						value={
							<a
								href="mailto:pasha_rakov@bk.ru"
								className="text-blue-600 hover:underline"
							>
								pasha_rakov@bk.ru
							</a>
						}
					/>
				</div>
			</div>
		</div>
	);
}

interface InfoRowProps {
	label: string;
	value: React.ReactNode;
	multiline?: boolean;
}

function InfoRow({ label, value, multiline }: InfoRowProps) {
	return (
		<div className={`flex gap-2 text-sm text-gray-700 ${multiline ? 'flex-col' : ''}`}>
			<span className="font-semibold shrink-0">{label}:</span>
			<span className={multiline ? 'whitespace-pre-line' : ''}>{value}</span>
		</div>
	);
}
