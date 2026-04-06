import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { storage } from '../../lib/storage';
import type { Student } from '../../types';
import {
	defaultStudent,
	RegistrationContext,
	type RegistrationContextProps
} from './registrationContext';

export function RegistrationProvider({ children }: PropsWithChildren) {
	const [isRegistered, setIsRegistered] = useState(false);
	const [student, setStudent] = useState<Student>(defaultStudent);

	useEffect(() => {
		// Пробуем загрузить данные из файла при запуске
		storage.loadStudent().then((savedStudent) => {
			if (savedStudent) {
				setStudent(savedStudent);
				setIsRegistered(true);
			}
		});
	}, []);

	const value = useMemo<RegistrationContextProps>(
		() => ({
			isRegistered,
			setIsRegistered,
			student,
			setStudent
		}),
		[isRegistered, student]
	);

	return (
		<RegistrationContext.Provider value={value}>
			{children}
		</RegistrationContext.Provider>
	);
}
