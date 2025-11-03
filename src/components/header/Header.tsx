import { useRegistration } from '../registration-form';

export function Header() {
	const { student } = useRegistration();

	return (
		<header className="bg-sibguti-main p-2 flex items-center gap-4 justify-between">
			<img src="/sibsutis-logo.svg" alt="Logo" />
			<div className="text-white">Измерения оптическим тестером FOT-930</div>
			<div className="text-sm text-gray-300">
				Студент: {student.name} {student.group}
			</div>
		</header>
	);
}
