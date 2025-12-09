import { getRandomElements } from '../../../lib/utils';
import { useRegistration } from '../../registration-form';
import { Test } from '../../test/Test';
import { questions } from './questions-bank';

// TODO:
/*
1. Закинуть больше вопросов
2. Переход на другой вопрос при нажатии Enter
3. Согласовать пороги оценок
*/

export function AdmissionTest() {
	const { student } = useRegistration();

	const admissionTestQuestions = getRandomElements(questions, 15);

	return (
		<div>
			{student.admissionTestResult === undefined && (
				<h1 className="text-xl font-bold text-gray-900 mb-6">Тест-допуск</h1>
			)}

			<Test
				testID="admissionTest"
				questions={admissionTestQuestions.slice(0, 3)}
			/>
		</div>
	);
}
