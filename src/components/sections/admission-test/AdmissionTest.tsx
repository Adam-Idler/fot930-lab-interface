import { getRandomElements } from '../../../lib/utils';
import { Test } from '../../test/Test';
import { shuffleQuestionsAnswers } from '../../test/utils';
import { questions } from './questions-bank';

const admissionTestQuestions = shuffleQuestionsAnswers(
	getRandomElements(questions, 15)
);

export function AdmissionTest() {
	return (
		<div className="flex flex-col justify-center h-full">
			<Test testID="admissionTest" questions={admissionTestQuestions} />
		</div>
	);
}
