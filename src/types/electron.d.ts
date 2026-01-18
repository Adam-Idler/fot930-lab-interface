import type { Student } from './index';

declare global {
	interface Window {
		electronAPI: {
			saveStudent: (student: Student) => Promise<void>;
			loadStudent: () => Promise<Student | null>;
		};
	}
}
