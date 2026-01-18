export type Answer = {
	text: string;
	isCorrect?: boolean;
};

export type AnswerMap = Record<string, number | number[] | string>;

type QuestionBase = {
	id: string;
	text: string;
};

export type ChoiceQuestion = QuestionBase & {
	type: 'single' | 'multiple';
	answers: Answer[];
};

export type TextQuestion = QuestionBase & {
	type: 'text';
	validator?: (value: string) => boolean;
};

export type TestQuestion = ChoiceQuestion | TextQuestion;
