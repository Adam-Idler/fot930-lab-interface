export type Section = 'theory' | 'admission' | 'lab-work';

type TestResult<T = number> = {
	totalQuestions: T;
	correctAnswers: number;
	grade: number;
};

export interface Student {
	name: string;
	group: string;
	admissionTestResult?: TestResult<15>;
	finalTestResult?: TestResult<30>;
}
