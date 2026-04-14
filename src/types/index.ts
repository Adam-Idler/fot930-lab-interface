export type Section = 'theory' | 'admission' | 'lab-work' | 'final-test';

type TestResult<T = number> = {
	totalQuestions: T;
	correctAnswers: number;
	grade: number;
};

type LabWorkResult = {
	score: number;
	grade: number;
};

export interface Student {
	name: string;
	group: string;
	admissionTestResult?: TestResult<15>;
	labWorkResult?: LabWorkResult;
	finalTestResult?: TestResult<30>;
}
