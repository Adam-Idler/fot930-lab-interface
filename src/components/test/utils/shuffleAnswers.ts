import type { TestQuestion } from '..';

export function shuffleQuestionsAnswers(question: TestQuestion[]) {
	return question.map((question) => {
		if (question.type === 'single' || question.type === 'multiple') {
			return {
				...question,
				answers: [...question.answers].sort(() => Math.random() - 0.5)
			};
		}

		return question;
	});
}
