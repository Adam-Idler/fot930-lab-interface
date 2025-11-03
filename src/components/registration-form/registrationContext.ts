import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useContext
} from 'react';
import { noop } from '../../lib/utils';
import type { Student } from '../../types';

export type RegistrationContextProps = {
	student: Student;
	isRegistered: boolean;
	setIsRegistered: Dispatch<SetStateAction<boolean>>;
	setStudent: Dispatch<SetStateAction<Student>>;
};

export const defaultStudent: Student = {
	name: '',
	group: ''
};

export const RegistrationContext = createContext<RegistrationContextProps>({
	student: defaultStudent,
	isRegistered: false,
	setIsRegistered: noop,
	setStudent: noop
});

export function useRegistration() {
	return useContext(RegistrationContext);
}
