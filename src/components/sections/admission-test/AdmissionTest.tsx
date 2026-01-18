import { getRandomElements } from '../../../lib/utils';
import { useRegistration } from '../../registration-form';
import { Test } from '../../test/Test';
import { shuffleQuestionsAnswers } from '../../test/utils';
import { questions } from './questions-bank';

const admissionTestQuestions = shuffleQuestionsAnswers(
	getRandomElements(questions, 15)
);

export function AdmissionTest() {
	const { student } = useRegistration();

	return (
		<div className="h-full">
			{student.admissionTestResult === undefined && (
				<h1 className="text-xl font-bold text-gray-900 mb-6">Тест-допуск</h1>
			)}

			<Test testID="admissionTest" questions={admissionTestQuestions} />
		</div>
	);
}
