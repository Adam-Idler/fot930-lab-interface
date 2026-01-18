import type { FormEvent } from 'react';
import { useRegistration } from './registrationContext';

export function RegistrationForm() {
	const { student, setStudent, setIsRegistered } = useRegistration();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await window.electronAPI.saveStudent(student);
		setIsRegistered(true);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 p-6 w-80 mx-auto mt-20 bg-slate-100 rounded-lg"
		>
			<h2 className="text-lg font-semibold text-center text-slate-800">
				Регистрация студента
			</h2>

			<label className="flex flex-col">
				Имя:
				<input
					value={student.name}
					onChange={(e) =>
						setStudent((prev) => ({ ...prev, name: e.target.value }))
					}
					className="border p-2 rounded"
					required
				/>
			</label>

			<label className="flex flex-col">
				Группа:
				<input
					value={student.group}
					onChange={(e) =>
						setStudent((prev) => ({ ...prev, group: e.target.value }))
					}
					className="border p-2 rounded"
					required
				/>
			</label>

			<button
				type="submit"
				className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800 hover:cursor-pointer"
			>
				Зарегистрироваться
			</button>
		</form>
	);
}
