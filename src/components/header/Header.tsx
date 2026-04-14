import { useState } from 'react';
import { publicUrl } from '../../lib/utils';
import { useRegistration } from '../registration-form';
import { AboutModal } from './AboutModal';
import { StudentResultsModal } from './StudentResultsModal';

export function Header() {
	const { student } = useRegistration();
	const [isAboutOpen, setIsAboutOpen] = useState(false);
	const [isResultsOpen, setIsResultsOpen] = useState(false);

	return (
		<>
			<header className="bg-sibguti-main p-2 flex items-center gap-4 justify-between">
				<button
					type="button"
					aria-label="Открыть сведения о программе"
					onClick={() => setIsAboutOpen(true)}
					className="cursor-pointer transition-opacity hover:opacity-75 active:opacity-60 bg-transparent border-0 p-0"
				>
					<img src={publicUrl('/sibsutis-logo.svg')} alt="Логотип СибГУТИ" />
				</button>
				<div className="text-white">Измерения оптическим тестером FOT-930</div>
				<button
					type="button"
					aria-label="Открыть результаты студента"
					onClick={() => setIsResultsOpen(true)}
					className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 underline underline-offset-2 decoration-dotted"
				>
					Студент: {student.name} {student.group}
				</button>
			</header>

			{isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
			{isResultsOpen && (
				<StudentResultsModal
					student={student}
					onClose={() => setIsResultsOpen(false)}
				/>
			)}
		</>
	);
}
