import type { Student } from '../types';

const STORAGE_KEY = 'student_data';

export const storage = {
	async saveStudent(student: Student): Promise<void> {
		if (window.electronAPI) {
			return window.electronAPI.saveStudent(student);
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
	},

	async loadStudent(): Promise<Student | null> {
		if (window.electronAPI) {
			return window.electronAPI.loadStudent();
		}
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? (JSON.parse(data) as Student) : null;
	}
};
